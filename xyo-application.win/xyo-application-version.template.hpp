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

#define XYO_APPLICATION_VERSION_ABCD                %VERSION_ABCD%
#define XYO_APPLICATION_VERSION_STR                 "%VERSION_VERSION%"
#define XYO_APPLICATION_VERSION_STR_BUILD           "%VERSION_BUILD%"
#define XYO_APPLICATION_VERSION_STR_DATETIME        "%VERSION_DATETIME%"

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

