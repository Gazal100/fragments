# fragments
Cloud Computing Course (AWS)

ESLint is configured to lint JavaScript files. To check for linting issues, run:
 - npm run lint

npm i and run the server by any of the following commands:
 - npm start (To start server normally)
 - npm run dev (To start with nodemon - automatic reloading)
 - npm run debug (To start the server with debugging enabled)

launch.json - to set up the debugging environment.

Health Check with curl:
To run curl with jq: (gets the log in the json format)
  curl.exe -s localhost:8080 | C:\Users\Public\jq.exe    
  curl.exe -i (To confirm that your server is sending the right HTTP headers)

Pino - configured for logging. Logs are output in JSON format. 
The logging level can be set using the LOG_LEVEL environment variable (e.g., LOG_LEVEL=debug).
