@echo off
TITLE Local MongoDB Server
echo Starting local MongoDB server on port 27017...
"C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "%~dp0backend\data" --port 27017
pause
