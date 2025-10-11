@echo off
REM -----------------------------------------
REM Read old and new app names from name.txt
REM -----------------------------------------
setlocal enabledelayedexpansion

REM Read first line (old name)
set /p OLD_NAME=<name.txt

REM Read second line (new name)
for /f "skip=1 delims=" %%a in (name.txt) do (
    set NEW_NAME=%%a
    goto afterRead
)
:afterRead

echo Replacing "%OLD_NAME%" with "%NEW_NAME%"...

REM Replace in app.json
powershell -Command "(Get-Content app.json) -replace '%OLD_NAME%','%NEW_NAME%' | Set-Content app.json"

REM Replace in package.json
powershell -Command "(Get-Content package.json) -replace '%OLD_NAME%','%NEW_NAME%' | Set-Content package.json"

echo Done!
pause
