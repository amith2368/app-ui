# Take Home Exercise - UI Connector

A UI connector application implemented using React framework along with [React Diagrams](https://github.com/projectstorm/react-diagrams) library


# Requirements

 - Operating System: Windows with Ubuntu WSL2, Linux (recommended)
 - JavaScript version: ES6 (Chrome & Safari)
 - `create-react- app` version: 5.0.1
 - `npm` version: 8.1.2
 - Terminal: bash(recommended in Linux) or PowerShell(Windows)

# Installation

Follow the following the steps to configure the UI connector app and server on your system.

## Import files

Open the terminal in your respective project directory and enter the following
```	
git clone https://github.com/amith2368/app-ui.git
cd app-ui
```

## Install the dependencies 

Install all the necessary **npm** packages
```
cd app-ui
npm install
```

## Run the React App + MockServer

You can start the react application the mock express server concurrently by
```
npm start
```
Note:

 - The react app is hosted on `localhost:3000`
 - The express server is hosted on `localhost:5000` which takes the API requests through proxy

## You are done!

Now go to the [Local Server](http://localhost:3000/) to view the UI Connector

![The UI Connector Page](/main.png)

![The UI Connector API calls](/mockapi.png)