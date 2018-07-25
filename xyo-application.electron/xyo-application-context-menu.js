//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var this_=module.exports;

var path=require("path");
var cmdFind=require("./xyo-application-find.js");
var config=require("./xyo-application-config.js").config;
var spawn=require("child_process").spawn;
var cwd=process.cwd();
var BrowserWindow=require("electron").BrowserWindow;

var phpMyAdminWindow=null;

var menu=[];

menu.push({
	label: "Print...",
	click(item, win) {
		win.webContents.print();
	}
});

menu.push({
	label: "Find...",
	click(item, win) {
		cmdFind(win);
	}
});

if(config["developer"]) {

	menu.push({
		type: "separator"
	});

	menu.push({
		label: "PHPMyAdmin",
		click(item, win) {

			if(phpMyAdminWindow) {
				if (phpMyAdminWindow.isMinimized()) {
					phpMyAdminWindow.restore();
				};
				phpMyAdminWindow.focus();
				return;
			};
			phpMyAdminWindow = new BrowserWindow({
				width: 1366,
				height: 768,
				icon: path.join(__dirname, "xyo-application.ico"),
				backgroundColor: "#FFFFFF",
				webPreferences: {
					nodeIntegration: false,
					plugins: true,
					webSecurity: true,
					allowDisplayingInsecureContent: false,
					allowRunningInsecureContent: false
				}
			});
			//
			phpMyAdminWindow.on("closed", function() {
				phpMyAdminWindow = null;
			});
			//
			phpMyAdminWindow.loadURL("http://127.0.0.1:"+config["apache-httpd.port"]+"/phpmyadmin");

		}
	});

	var cmdLine=["mysql","--host=127.0.0.1","--user="+config["mariadb.username"],"--port="+config["mariadb.port"],"--protocol=TCP"];
	if(config["mariadb.password"]) {
		cmdLine[cmdLine.length]="--password="+config["mariadb.password"];
	};

	menu.push({
		label: "MariaDB Console",
		click(item, win) {
			spawn("start",  cmdLine, {
				cwd: cwd+"/library/"+config["mariadb"]+"/bin",
				windowsHide: false,
				stdio: "ignore",
				shell: true
			});
		}
	});
};

require("electron-context-menu")({
	append: params => menu
});

