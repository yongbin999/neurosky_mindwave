### mindwave
 * installed and open SDK ThinkGear from their website
 * the neurosky minwave headset
 * habe bluetooth pair with the headset.


### usage
 * npm install
 * node public/server.js

- now it would print the blinking activity and the brain activity level in console.
- once the level gets too low, warning message comes on, and sends request to arduino through johnny-five

### or you can runing it as a webapp:
got most codes from neurosky-node-websocket (chart non-functional, no time to implement correctly)
- npm install
- npm start
- go to localhost:3000