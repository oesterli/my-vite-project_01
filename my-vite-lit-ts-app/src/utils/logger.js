// logger.js

let logCounter = 0;

export function loggeText(text) {
  logCounter++;

  console.log(`[Logger ${logCounter}] ${text}`);
  //console.log('OGC API Loader initialized');
}
