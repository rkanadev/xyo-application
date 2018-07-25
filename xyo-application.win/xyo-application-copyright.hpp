//
// XYO Application
//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef XYO_APPLICATION_COPYRIGHT_HPP
#define XYO_APPLICATION_COPYRIGHT_HPP

#define XYO_APPLICATION_COPYRIGHT            "Copyright (c) Grigore Stefan."
#define XYO_APPLICATION_PUBLISHER            "Grigore Stefan"
#define XYO_APPLICATION_COMPANY              XYO_APPLICATION_PUBLISHER
#define XYO_APPLICATION_CONTACT              "g_stefan@yahoo.com"
#define XYO_APPLICATION_FULL_COPYRIGHT       XYO_APPLICATION_COPYRIGHT " <" XYO_APPLICATION_CONTACT ">"

#ifndef XYO_RC

namespace XYOApplication {

	class Copyright {
		public:
			static const char *copyright();
			static const char *publisher();
			static const char *company();
			static const char *contact();
			static const char *fullCopyright();

	};

};

#endif
#endif
