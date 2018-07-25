//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var this_=module.exports;

var fs=require("fs");
var crypto=require("crypto");

this_.escapeRegExp=function(str) {
	return str.replace(/[.*+?^$ {}()|[\]\\]/g, "\\$&");
};

this_.replaceString=function(str,searchValue,newValue) {
	return str.replace(new RegExp(this_.escapeRegExp(searchValue), "g"), newValue);
};

this_.replaceText=function(str,listSearchAndReplace) {
	var i;
	for(i=0; i<listSearchAndReplace.length; ++i) {
		str=this_.replaceString(str,listSearchAndReplace[i][0],listSearchAndReplace[i][1]);
	};
	return str;
};

this_.jobReplaceTextInFile=function(job,fileNameIn,fileNameOut,replaceList,errMessage) {

	job.add(function(job) {
		fs.readFile(fileNameIn, "utf-8", (err, data) => {
			if(err) {
				job.setError(errMessage+"1");
				return;
			};
			job.next(data);
		});
	});

	job.add(function(job,data) {
		fs.writeFile(fileNameOut, this_.replaceText(""+data,replaceList), (err) => {
			if(err) {
				job.setError(errMessage+"2");
				return;
			};
			job.next();
		});
	});

};

this_.sha256=function(value) {
	return crypto.createHash("sha256").update(pwd).digest("hex");
};

