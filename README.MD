## AirPurifierApp  
A small web-app to control Xiaomi Mi Air Purifier (2) and capture it's stats.  


### Installation  
1) Navigate to Server folder  
2) Run `npm install`  
3) Run `node miio-fix`  
4) Edit config.js (You have to set up miio token first, see more info in miio docs)  
5) Run `node index.js`  
6) If you're using different IP/Port, edit the first line of client.js in the root directory.  
  
Libraries used (licenses): Vue(MIT), FontAwesome4(MIT+OFL), miio(MIT), Chart.js(MIT), nodejs-websocket(MIT)