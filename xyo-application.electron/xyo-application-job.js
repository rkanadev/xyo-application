//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

var newJob=function() {
	var this_= {};

	var jobList=[];
	var jobIndex=0;
	var isError=false;
	var errorMessage="";
	var jobReturn=null;

	this_.setReturn=function(job) {
		jobReturn=job;
	};

	this_.add=function(fnProcess,job) {
		if(job===this_) {
			return false;
		};
		jobList.push({
			process: fnProcess,
			job: job,
			processed: false
		});
		if(job) {
			job.setReturn(this_);
		};
		return true;
	};

	this_.next=function(data) {
		setTimeout(function() {
			this_.process(data);
		},10);
	};

	this_.begin=function() {
		for(var k=0; k<jobList.length; ++k) {
			jobList[k].processed=false;
			if(jobList[k].job) {
				jobList[k].job.begin();
			};
		};
		jobIndex=0;
		isError=false;
		errorMessage="";
	};

	this_.done=function() {
		for(var k=0; k<jobList.length; ++k) {
			if(!jobList[k].processed) {
				return false;
			};
		};
		return true;
	};

	this_.process=function(data) {
		if(isError) {
			return false;
		};
		if(jobIndex>=jobList.length) {
			return false;
		};
		for(; jobIndex<jobList.length; ++jobIndex) {
			if(jobList[jobIndex].processed) {
				continue;
			};
			if(jobList[jobIndex].job) {
				if(jobList[jobIndex].job.process()) {
					return true;
				};
			};
			this_.onStep(this_);
			jobList[jobIndex].process(this_,data);
			jobList[jobIndex].processed=true;
			return true;
		};
		if(jobReturn) {
			jobReturn.process();
		};
		this_.onDone(this_);
		return false;
	};

	this_.count=function() {
		var count=0;
		for(var k=0; k<jobList.length; ++k) {
			++count;
			if(jobList[k].job) {
				count+=jobList[k].job.count();
			};
		};
		return count;
	};

	this_.index=function() {
		var index=0;
		for(var k=0; k<jobList.length; ++k) {
			if(jobList[k].job) {
				index+=jobList[k].job.index();
			};
			if(!jobList[k].processed) {
				continue;
			};
			++index;
		};
		return index;
	};

	this_.beginWork=function() {
		this.begin();
		this.process();
	};

	this_.setError=function(message) {
		isError=true;
		errorMessage=message;
		this_.onError(this_,message);
	};

	this_.isError=function() {
		for(var k=0; k<jobList.length; ++k) {
			if(jobList[k].job) {
				if(jobList[k].job.isError) {
					return true;
				};
			};
		};
		return isError;
	};

	this_.getErrorMessage=function() {
		for(var k=0; k<jobList.length; ++k) {
			if(jobList[k].job) {
				if(jobList[k].job.isError) {
					return jobList[k].job.getErrorMessage();
				};
			};
		};
		return errorMessage;
	};

	this_.newJob=newJob;

	this_.onStep=function(job) {
		if(jobReturn) {
			jobReturn.onStep(jobReturn);
		};
	};

	this_.onError=function(job,errorMessage) {
		if(jobReturn) {
			jobReturn.onError(jobReturn,errorMessage);
		};
	};

	this_.onDone=function(job) {
	};

	return this_;
};

module.exports.newJob=newJob;
