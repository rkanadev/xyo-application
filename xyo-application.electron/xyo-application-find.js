//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

module.exports = function(win) {

	var ipcMain=require("electron").ipcMain;
	var BrowserWindow=require("electron").BrowserWindow;
	var path=require("path");
	var url=require("url");

	var searchWindow=null;
	var searchWindowParent=null;

	ipcMain.on("find-text", (event, textToFind) => {
		if((""+textToFind).length>0) {
			if(searchWindowParent) {
				searchWindowParent.webContents.findInPage(textToFind);
			};
		};
	});

	ipcMain.on("find-text-next", (event, textToFind) => {
		if((""+textToFind).length>0) {
			if(searchWindowParent) {
				searchWindowParent.webContents.findInPage(textToFind, {
					findNext:true
				});
			};
		};
	});

	if(!searchWindow) {

		searchWindowParent=win;
		searchWindow=new BrowserWindow({
			width: 360,
			height: 90,
			icon: path.join(__dirname, "xyo-application.ico"),
			parent: win,
			title: "Find"
		});
		searchWindow.on("closed", () => {
			searchWindow = null;
			if(searchWindowParent!=null) {
				searchWindowParent.webContents.stopFindInPage("clearSelection");
			};
			searchWindowParent= null;
		});
		searchWindow.setMenu(null);
		//
		searchWindow.loadURL(url.format({
			protocol: "file",
			slashes: true,
			pathname: path.join(__dirname, "xyo-application-find.html")
		}));

	};

};

