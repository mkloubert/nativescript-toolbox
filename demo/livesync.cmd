@ECHO OFF
CLS

ECHO Readd plugin...
CALL readd.cmd

tns livesync --watch
