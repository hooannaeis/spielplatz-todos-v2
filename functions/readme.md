# functions

## local debugging
### starting the debugger
if you want to run the functions locally, start by adding a service-account key to the environment variables:

```$  $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\hanne\Documents\Bitbucket Repositories\spielplatz-todos-v2\functions\gcloudCredentials.json"```

more here: https://cloud.google.com/vision/docs/before-you-begin
Then run the emulator by

```$ firebase emulators:start --only functions```

Your function will then be reachable under

http://localhost:5001/project-name/function-region/function-name

(e. g. http://localhost:5001/project-polar-eda66/us-central1/getFriendlyName?inputSeed=abc)

### interaction with other firebase products
set up authetntication 
https://cloud.google.com/docs/authentication/getting-started#windows