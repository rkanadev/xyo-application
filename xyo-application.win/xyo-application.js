//
// XYO Application
//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

//
Script.requireExtension=Script.requireInternalExtension;
//

Script.requireExtension("Application");
Script.requireExtension("JSON");
Script.requireExtension("Shell");

var pathExecutable=Application.getPathExecutable();
var configFileName=pathExecutable+"/config.json";
var configContent=Shell.fileGetContents(configFileName);

if(!Script.isNil(configContent)){
	var config=JSON.decode(configContent);
	if(!Script.isNil(config)){
		if(!Script.isNil(config["electron"])){
			Shell.executeNoWait("library/"+config["electron"]+"/electron library/xyo-application.electron/xyo-application.js");
			return;
		};
		throw("Electron application not found");
	};
};

throw("Config file not found or invalid");
