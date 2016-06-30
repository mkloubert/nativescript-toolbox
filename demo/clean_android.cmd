@ECHO OFF
CLS

ECHO Cleanup android ...
CD platforms\android
CALL gradlew.bat clean

ECHO Remove android ...
CD ..\..
CALL tns platform remove android

ECHO Re-Add android ...
CALL tns platform add android

ECHO Cleanup android ...
CD platforms\android
CALL gradlew.bat clean

CD ..\..
