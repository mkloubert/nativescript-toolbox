@ECHO OFF
CLS

CALL clean_android.cmd
CALL readd.cmd

ECHO Rebuilding app...
CALL tns prepare android
CALL tns build android
