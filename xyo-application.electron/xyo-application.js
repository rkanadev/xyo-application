//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"]=true;

var app=require("electron").app;
var appLog=require("./xyo-application-log.js").log;

process.on("uncaughtException",function(e) {
	appLog(e,"exception");
	app.quit();
});

var cwd=process.cwd();
var config=require("./xyo-application-config.js").config;

var appPath=cwd+"\\"+config["electron"]+";";
appPath+=cwd+"\\"+config["apache-httpd"]+"\\bin;";
appPath+=cwd+"\\"+config["php"]+";";
appPath+=cwd+"\\"+config["mariadb"]+"\\bin;";
process.env["PATH"]=appPath+process.env["PATH"];

var path=require("path");
var fs=require("fs");
var appData=path.join(cwd,"application.data");
var ipcMain=require("electron").ipcMain;
var spawn=require("child_process").spawn;

if(!fs.existsSync(appData)) {
	fs.mkdirSync(appData);
};

var win=require("./xyo-application-window.js");

if(win.secondInstance) {
	return;
};

var job=require("./xyo-application-job.js").newJob();
var util=require("./xyo-application-util.js");

if(!fs.existsSync(cwd+"/log")) {
	fs.mkdirSync(cwd+"/log");
};

if(!fs.existsSync(cwd+"/tmp")) {
	fs.mkdirSync(cwd+"/tmp");
};

var processApacheHTTPD=null;
var processApacheHTTPDTerminated=false;
var processMariaDB=null;
var processMariaDBTerminated=false;
var tmpConfigPath=util.replaceString(appData,"\\","/");
var tmpApacheHTTPDConfig=util.replaceString(appData+"/httpd.conf","\\","/");
var tmpPHPConfig=util.replaceString(appData+"/php.ini","\\","/");
var tmpMariaDBConfig=util.replaceString(appData+"/mariadb.ini","\\","/");
var tmpPHPMyAdminConfig=util.replaceString(appData+"/phpmyadmin.config.php","\\","/");

function sleep(millis) {
	return new Promise(resolve => setTimeout(resolve, millis));
}

win.shutdownServices=async function() {
	if(processApacheHTTPD) {
		processApacheHTTPD.kill("SIGTERM");
	};

	if(processMariaDB) {
		var cmdLine=["--host=127.0.0.1","--user="+config["mariadb.username"],"--port="+config["mariadb.port"],"--protocol=TCP"];
		if(config["mariadb.password"]) {
			cmdLine.push("--password="+config["mariadb.password"]);
		};
		cmdLine.push("shutdown");
		spawn("mysqladmin",  cmdLine, {
			cwd: cwd+"/library/"+config["mariadb"]+"/bin",
			windowsHide: true,
			stdio: "ignore",
			shell: false
		});
	};

	if(processApacheHTTPD) {
		while(!processApacheHTTPDTerminated) {
			await sleep(100);
		};
	};

	if(processMariaDB) {
		while(!processMariaDBTerminated) {
			await sleep(100);
		};
	};

	appLog("Shutdown ok");
	app.quit();
};

job.replaceTextInFile=function(source,target,replaceList,errorMessage) {
	util.jobReplaceTextInFile(this,source,target,replaceList,errorMessage);
};

var cwdX=util.replaceString(cwd,"\\","/");

//
// Config Apache HTTPD
//
job.replaceTextInFile(cwd+"/config/httpd.template.conf",
		      tmpApacheHTTPDConfig,[
			      ["%APPLICATION_PATH%",cwdX],
			      ["%SERVER_PATH%",cwdX+"/library/"+config["apache-httpd"]],
			      ["%SERVER_PORT%",config["apache-httpd.port"]],
			      ["%PHP_PATH%",cwdX+"/library/"+config["php"]],
			      ["%PHP_INI_PATH%",tmpConfigPath],
			      ["%PHPMYADMIN_PATH%",cwdX+"/library/"+config["phpmyadmin"]],
			      ["%CONFIG_PATH%",tmpConfigPath]
		      ],
		      "error: config #1");

//
// Config PHP
//
job.replaceTextInFile(cwd+"/config/php.template.ini",
		      tmpPHPConfig,[
			      ["%APPLICATION_PATH%",cwdX],
			      ["%PHP_PATH%",cwdX+"/library/"+config["php"]],
			      ["%MARIADB_PORT%",config["mariadb.port"]]
		      ],
		      "error: config #2");

//
// Config MariaDB
//
job.replaceTextInFile(cwd+"/config/mariadb.template.ini",
		      tmpMariaDBConfig,[
			      ["%APPLICATION_PATH%",cwdX],
			      ["%CONFIG_PATH%",tmpConfigPath],
			      ["%SERVER_PATH%",cwdX+"/library/"+config["mariadb"]],
			      ["%SERVER_PORT%",config["mariadb.port"]]
		      ],
		      "error: config #3");

//
// Config PHPMyAdmin #1
//
job.replaceTextInFile(cwd+"/config/phpmyadmin.config.inc.template.php",
		      cwdX+"/library/"+config["phpmyadmin"]+"/config.inc.php",[
			      ["%APPLICATION_PATH%",cwdX],
			      ["%PHPMYADMIN_CONFIG_FILE%",tmpPHPMyAdminConfig]
		      ],
		      "error: config #4");

//
// Config PHPMyAdmin #2
//
job.replaceTextInFile(cwd+"/config/phpmyadmin.config.template.php",
		      tmpPHPMyAdminConfig,[
			      ["%APPLICATION_PATH%",cwdX],
			      ["%MARIADB_PORT%",config["mariadb.port"]],
			      ["%MARIADB_USERNAME%",config["mariadb.username"]],
			      ["%MARIADB_PASSWORD%",config["mariadb.password"]]
		      ],
		      "error: config #5");

//
// Start Apache HTTPD
//
job.add(function(job) {
	processApacheHTTPD=spawn("httpd",  ["-f",tmpApacheHTTPDConfig], {
		cwd: cwd+"/library/"+config["apache-httpd"]+"/bin",
		windowsHide: true
	});
	processApacheHTTPD.on("close", (code) => {
		appLog("Apache HTTPD terminated");
		processApacheHTTPDTerminated=true;
	});
	setTimeout(function() {
		if(processApacheHTTPDTerminated) {
			job.setError("error: server #1");
			return;
		};
		appLog("Apache HTTPD start");
		job.next();
	},1500);
});

//
// Start MariaDB
//
job.add(function(job) {
	processMariaDB=spawn("mysqld", ["--defaults-file="+tmpMariaDBConfig], {
		cwd: cwd+"/library/"+config["mariadb"]+"/bin",
		windowsHide: true
	});
	processMariaDB.on("close", (code) => {
		appLog("MariaDB terminated");
		processMariaDBTerminated=true;
	});
	setTimeout(function() {
		if(processMariaDBTerminated) {
			job.setError("error: server #2");
			return;
		};
		appLog("MariaDB start");
		job.next();
	},3000);
});

ipcMain.on("start-application", (event) => {
	var count=job.count();
	job.onStep=function(job) {
		event.sender.send("set-procent",Math.floor((job.index()*100)/count));
	};
	job.onError=function(job,errorMessage) {
		appLog(errorMessage,"error");
		event.sender.send("set-error",errorMessage);
	};
	job.onDone=function(job) {
		event.sender.send("set-procent",100);
		event.sender.send("connect-application","http://127.0.0.1:"+config["apache-httpd.port"]);
		appLog("Application start");
	};
	job.beginWork();
});

