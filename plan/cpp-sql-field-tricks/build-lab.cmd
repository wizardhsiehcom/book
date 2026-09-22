@echo off
call "C:\Program Files\Microsoft Visual Studio\2022\Professional\VC\Auxiliary\Build\vcvars64.bat"
if errorlevel 1 exit /b 1
cd /d D:\book\plan\cpp-sql-field-tricks
if not exist build mkdir build
cl /nologo /std:c++17 /EHsc /W4 /WX /utf-8 /Z7 /Od ..\..\docs\cpp-sql-field-tricks\examples\field_lab.cpp /Febuild\field_lab.exe /Fobuild\field_lab.obj
if errorlevel 1 exit /b 1
cl /nologo /std:c++17 /EHsc /W4 /WX /utf-8 /Z7 /Od ..\..\docs\cpp-sql-field-tricks\examples\sql_lab.cpp odbc32.lib /Febuild\sql_lab.exe /Fobuild\sql_lab.obj
