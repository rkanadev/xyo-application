@echo off

rem --- make

echo ^> make xyo-application ^<

goto Make
:ErrorMake
echo Error: make
goto :eof
:Make

file-to-cs --touch=xyo-application.cpp --file-in=xyo-application.js --file-out=xyo-application.src --is-string --name=XYOApplicationSource
IF ERRORLEVEL 1 goto ErrorMake
xyo-cc --mode=%ACTION% --exe xyo-application --inc=. --use-project=qse-application.static --use-project=qse-console.static --use-project=qse-json.static --use-project=qse-shell.static --use-project=qse-shellfind.static
IF ERRORLEVEL 1 goto ErrorMake


