@echo off
setlocal
call "C:\Program Files\Microsoft Visual Studio\2022\Professional\VC\Auxiliary\Build\vcvars64.bat"
if errorlevel 1 exit /b 1
"%~dp0..\..\.venv\Scripts\python.exe" -B "%~dp0test_first_job.py"
exit /b %errorlevel%
