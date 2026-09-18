// logger.js

let logCounter = 0;

export function loggeText(text, component = '') {
  logCounter++;

  const logText =
    `[${logCounter}]${component ? ` [${component}]` : ''} ${text}`;


  console.log(logText);
  //console.log('OGC API Loader initialized');

  return logText;
}
