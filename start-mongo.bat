@echo off
REM start-mongo.bat
REM Starts MongoDB using the installation under C:\Program Files\MongoDB\Server\8.2
REM Run this file as Administrator if you need the service to access protected folders.

REM Change drive and directory to the Mongo bin folder
cd /d "C:\Program Files\MongoDB\Server\8.2\bin"

REM Start mongod in a new window so the batch file returns immediately.
REM Window title is "MongoDB". mongod will write logs to the configured log path.
start "MongoDB" mongod.exe --dbpath "C:\Program Files\MongoDB\Server\8.2\data" --logpath "C:\Program Files\MongoDB\Server\8.2\log\mongod.log" --bind_ip 127.0.0.1

echo MongoDB start command issued (look for a new window titled "MongoDB").
echo Logs: C:\Program Files\MongoDB\Server\8.2\log\mongod.log
echo If the mongod process does not start, try running this batch as Administrator.
pause
