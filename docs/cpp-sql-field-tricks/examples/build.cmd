@echo off
setlocal
if not defined VSCMD_VER (
  for /f "usebackq tokens=*" %%i in (`"%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe" -latest -products * -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath`) do set "LAB_VS=%%i"
  call :setup
  if errorlevel 1 exit /b 1
)
if not exist build mkdir build
if /i not "%VSCMD_ARG_TGT_ARCH%"=="x64" (echo Use an x64 developer environment. & exit /b 1)
if not "%~1"=="" if /i not "%~1"=="first" (echo Usage: build.cmd [first] & exit /b 1)
cl /nologo /std:c++17 /EHsc /W4 /WX /utf-8 /Z7 /Od "%~dp0first_job.cpp" /Febuild\first_job.exe /Fobuild\first_job.obj
if errorlevel 1 exit /b 1
if /i "%~1"=="first" exit /b 0
cl /nologo /std:c++17 /EHsc /W4 /WX /utf-8 /Z7 /Od "%~dp0field_lab.cpp" /Febuild\field_lab.exe /Fobuild\field_lab.obj
if errorlevel 1 exit /b 1
cl /nologo /std:c++17 /EHsc /W4 /WX /utf-8 /Z7 /Od "%~dp0sql_lab.cpp" odbc32.lib /Febuild\sql_lab.exe /Fobuild\sql_lab.obj
exit /b %errorlevel%
:setup
if not defined LAB_VS (echo Visual Studio C++ x64 tools not found. & exit /b 1)
call "%LAB_VS%\VC\Auxiliary\Build\vcvars64.bat"
exit /b %errorlevel%
