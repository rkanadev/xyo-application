//
// XYO Application
//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#include "xyo-application-version.hpp"

namespace XYOApplication {
	static const char *versionVersion="1.0.0";
	static const char *versionBuild="2";
	static const char *versionVersionWithBuild="1.0.0.2";
	static const char *versionDatetime="2018-07-26 01:37:09";

	const char *Version::getVersion() {
		return versionVersion;
	};
	const char *Version::getBuild() {
		return versionBuild;
	};
	const char *Version::getVersionWithBuild() {
		return versionVersionWithBuild;
	};
	const char *Version::getDatetime() {
		return versionDatetime;
	};
};

