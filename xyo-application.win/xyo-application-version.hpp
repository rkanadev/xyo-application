//
// XYO Application
//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef XYO_APPLICATION_VERSION_HPP
#define XYO_APPLICATION_VERSION_HPP

#define XYO_APPLICATION_VERSION_ABCD                1,0,0,2
#define XYO_APPLICATION_VERSION_STR                 "1.0.0"
#define XYO_APPLICATION_VERSION_STR_BUILD           "2"
#define XYO_APPLICATION_VERSION_STR_DATETIME        "2018-07-26 01:37:09"

#ifndef XYO_RC

namespace XYOApplication {
	class Version {
		public:
			static const char *getVersion();
			static const char *getBuild();
			static const char *getVersionWithBuild();
			static const char *getDatetime();
	};
};

#endif
#endif

