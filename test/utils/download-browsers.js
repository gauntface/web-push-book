'use strict';

const seleniumAssistant = require('selenium-assistant');

const browserCache = 7 * 24;

const promises = [
  seleniumAssistant.downloadLocalBrowser('firefox', 'stable', browserCache),
  seleniumAssistant.downloadLocalBrowser('firefox', 'beta', browserCache),
  seleniumAssistant.downloadLocalBrowser('firefox', 'unstable', browserCache),
  seleniumAssistant.downloadLocalBrowser('chrome', 'stable', browserCache),
  seleniumAssistant.downloadLocalBrowser('chrome', 'beta', browserCache),
  seleniumAssistant.downloadLocalBrowser('chrome', 'unstable', browserCache)
];

console.log('Downloading browsers.');
Promise.all(promises)
.then(function() {
  console.log('Download complete.');
})
.catch(function(err) {
  console.error('Unable to download browsers.', err);
  process.exit(1);
});
