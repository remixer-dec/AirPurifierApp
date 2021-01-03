## AirPurifierApp  
A small web-app to control Xiaomi Mi Air Purifier (only the 2nd model was tested) and capture its stats.  

![Screenshot](https://i.imgur.com/yJPyWEy.png)  

### Installation  
0) Move Server directory somewhere from the root directory
1) Navigate to Server directory  
2) Run `npm install`  
3) Run `node miio-fix`  
4) Edit config.js (You have to set up miio token first, see more info in miio docs)  
5) Run `node index.js` to start the server  
6) If you're using different IP/Port, edit the first line of client.js in the root directory.  
7) Run any [http-server](https://www.npmjs.com/package/http-server) in the root directory  
  
Libraries used (licenses): Vue(MIT), FontAwesome4(MIT+OFL), miio(MIT), Chart.js(MIT), nodejs-websocket(MIT), workbox(MIT)
