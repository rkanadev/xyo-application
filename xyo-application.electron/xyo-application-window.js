//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var this_=module.exports;

var config=require("./xyo-application-config.js").config;
var app=require("electron").app;
var path=require("path");
var cwd=process.cwd();

app.setName(config["application.name"]);
app.setPath("appData",path.join(cwd,"application.data"));
app.setPath("userData",path.join(cwd,"application.data/"+app.getName()));

var mainWindow=null;

this_.secondInstance=app.makeSingleInstance(function(commandLine, workingDirectory) {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		};
		mainWindow.focus();
		return;
	};
});

if(this_.secondInstance) {
	app.quit();
	return;
};

require("module").globalPaths.push(cwd+"/library/electron-modules");

var BrowserWindow=require("electron").BrowserWindow;
var ipcMain=require("electron").ipcMain;

app.on("window-all-closed", function() {
	if(this_.shutdownServices) {
		this_.shutdownServices();
	} else {
		app.quit();
	};
});

app.on("before-quit",function() {
	mainWindow.removeAllListeners("close");
});

require("./xyo-application-context-menu.js");

app.on("ready", function() {
	mainWindow = new BrowserWindow({
		width: 1366,
		height: 768,
		icon: path.join(__dirname, "xyo-application.ico"),
		backgroundColor: "#FFFFFF",
		webPreferences: {
			nodeIntegration: false,
			preload: __dirname+"/xyo-application-preload.js",
			plugins: true,
			webSecurity: true,
			allowDisplayingInsecureContent: false,
			allowRunningInsecureContent: false
		}
	});
	//
	mainWindow.setMenu(null);
	//
	mainWindow.on("closed", function() {
		mainWindow = null;
	});
	//
	mainWindow.loadURL(__dirname+"/xyo-application.html");
});

