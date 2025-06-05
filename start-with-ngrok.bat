@echo off
echo Starting Osoora application with ngrok for baktipm.com...

REM Start the server in the background
start cmd /k "node server.js"

REM Wait for server to start
timeout /t 3

REM Start ngrok with baktipm.com domain
echo Using ngrok with baktipm.com domain to forward to port 5101...

REM Force baktipm.com domain usage with HTTPS
ngrok http --domain=baktipm.com --scheme=https 5101

echo Done.ngrok http --domain baktipm.com 5101  


