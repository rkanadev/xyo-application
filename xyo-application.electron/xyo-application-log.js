//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var this_=module.exports;

var cwd=process.cwd();
var fs=require("fs");

this_.log=function(message,level) {
	var timestamp=new Date().toISOString().slice(0,19).replace("T", " ");
	if(!level) {
		level="message";
	};
	fs.appendFileSync(cwd+"/log/application.log", timestamp+" ["+level+"]: "+message+"\r\n");
};

