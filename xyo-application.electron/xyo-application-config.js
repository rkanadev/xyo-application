//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var this_=module.exports;

var cwd=process.cwd();
var fs=require("fs");

//
// Default config values
//

this_.config= {
	"application.name": "XYO Application",
	"apache-httpd": "httpd-2.4.29-win64-vc15",
	"apache-httpd.port": 10001,
	"mariadb": "mariadb-10.1.34-winx64",
	"mariadb.port": 10002,
	"php": "php-7.2.1-Win32-VC15-x64",
	"electron": "electron-v2.0.0-win32-x64",
	"phpmyadmin": "phpMyAdmin-4.8.2-all-languages",
	"developer": false,
	"mariadb.username": "root",
	"mariadb.password": ""
};

var configData=null;
var config= {};

try {
	configData=fs.readFileSync(cwd+"/config.json", {encoding:"utf-8"});
	config=JSON.parse(configData);
} catch(e) {
	console.log(e);
	return;
};

for(var k in this_.config) {
	if(k in config) {
		this_.config[k]=config[k];
	};
};

