
### Getting Started
 Below are instructions to start this application in your local server.


 **First off, you must have node/npm installed. Install the latest node version [here](https://nodejs.org/en/download/).**

 ### Installation
 

 1. Clone this repository by running this on your terminal: `git clone https://seyiogunjuyigbe_touchcore@bitbucket.org/tcore2020/zpclone.git`
 2. Navigate to the project's directory with: `cd zohoproject`
 3. Run `npm install` to install dependencies
 4. You will need to create your environment variables. Create a `.env` file and fill in te variables as seen in the `.env.example` file
 5. Run  `npm run dev` to start the server on a local host
 6. Run `npm test` to test.
 
##### Test Driven
Tests are written with mocha, chai-http and chai.

##### This will be the file and folder structure

    src
    ├── config
           ├── constants.js   
    ├── database
    ├── helpers  
    ├── middlewares 
    ├── models 
    ├── routes   
    ├── tests  
    └── views                     

#### Stack:
* Node JS
* Mongodb