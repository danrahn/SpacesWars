@echo off
REM Super smart "build" system
copy /B header.txt + jquery.js + jscolor.js + spaceswars.js + config.js spaceswarsGM.js
copy /B header.txt + startAnon.js + spaceswars.js + config.js + stopAnon.js spaceswarsTM.js