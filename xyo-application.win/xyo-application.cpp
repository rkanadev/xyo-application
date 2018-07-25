//
// XYO Application
//
// Copyright (c) 2018 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define WIN32_LEAN_AND_MEAN
#include <windows.h>

#include "libquantum-script.hpp"
#include "quantum-script-extension-application.hpp"
#include "quantum-script-extension-console.hpp"
#include "quantum-script-extension-json.hpp"
#include "quantum-script-extension-shellfind.hpp"
#include "quantum-script-extension-shell.hpp"
#include "quantum-script-extension-buffer.hpp"

#include "xyo-application-license.hpp"
#include "xyo-application-copyright.hpp"
#include "xyo-application-version.hpp"
#include "xyo-application.src"

namespace Main {

	using namespace XYO;
	using namespace XYO::Core;
	using namespace Quantum::Script;

	class Application :
		public virtual IMain {
			XYO_CORE_DISALLOW_COPY_ASSIGN_MOVE(Application);
		protected:

			static void initExecutive(Executive *);

			void showUsage();
			void showLicense();

			char buffer[4096];
			static char *msgBoxTitle;
		public:

			inline Application() {};

			int main(int cmdN, char *cmdS[]);
	};

	char *Application::msgBoxTitle="XYO Application";

	void Application::initExecutive(Executive *executive) {
		Extension::Application::registerInternalExtension(executive);
		Extension::Console::registerInternalExtension(executive);
		Extension::JSON::registerInternalExtension(executive);
		Extension::ShellFind::registerInternalExtension(executive);
		Extension::Shell::registerInternalExtension(executive);
		Extension::Buffer::registerInternalExtension(executive);
	};

	void Application::showUsage() {
		String message;
		message<<"XYO Application\n";
		sprintf(buffer,"version %s build %s [%s]\n", XYOApplication::Version::getVersion(), XYOApplication::Version::getBuild(), XYOApplication::Version::getDatetime());
		message<<buffer;
		message<<XYOApplication::Copyright::fullCopyright()<<"\n\n";
		message<<
		       "options:\n"
		       "    --license           show license\n";
		message<<"\n";
		MessageBox(nullptr,message,msgBoxTitle,MB_OK|MB_ICONINFORMATION);
	};

	void Application::showLicense() {
		MessageBox(nullptr,XYOApplication::License::content(),msgBoxTitle,MB_OK|MB_ICONINFORMATION);
	};

	int Application::main(int cmdN, char *cmdS[]) {
		int i;
		char *opt;
		char *fileIn;

		for (i = 1; i < cmdN; ++i) {
			if (strncmp(cmdS[i], "--", 2) == 0) {
				opt = &cmdS[i][2];
				if (strcmp(opt, "license") == 0) {
					showLicense();
					if (cmdN == 2) {
						return 0;
					};
				};
				continue;
			};
		};

		if(ExecutiveX::initExecutive(cmdN,cmdS,initExecutive)) {
			if(ExecutiveX::executeString(XYOApplicationSource)) {
				ExecutiveX::endProcessing();
				return 0;
			};
		};

		MessageBox(nullptr,(ExecutiveX::getError()),msgBoxTitle,MB_OK|MB_ICONERROR);

		ExecutiveX::endProcessing();
		return 1;
	};

};

XYO_CORE_APPLICATION_MAIN_STD(Main::Application);

