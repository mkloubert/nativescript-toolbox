@ECHO OFF
CLS

CALL rebuild.cmd

ECHO Deploying app...
CALL tns deploy android
