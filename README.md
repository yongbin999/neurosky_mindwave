### mindwave
 * installed and open SDK ThinkGear from their website
 * the neurosky minwave headset
 * have bluetooth pair with the headset


### usage from main directory
 * npm install
 * node ./public/server.js

  - now it would print the blinking activity and the brain activity level in console.
  - once the level gets too low, warning message comes on, and sends request to arduino through johnny-five

### or you can runing it as a webapp:
got most codes from neurosky-node-websocket d3 stream charts (no time to implement our warning chart)
- npm install
- npm start
- go to localhost:3000
