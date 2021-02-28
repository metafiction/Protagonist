chcp 437

setlocal enabledelayedexpansion

for /f "usebackq tokens=*" %%i in (`reg query "hklm\software\mozilla"`) do (
for /f "usebackq tokens=*" %%j in (`reg query "%%i\bin" /f pathtoexe ^| find "firefox.exe"`) do (
set a=%%j
)
)

set a=%a:PathToExe=%
set a=%a:REG_SZ=%
set a=%a:  =%


"%a%" -app application.ini

endlocal
