const seleniumWebdriver = require('selenium-webdriver');

const checkLogs = (browserDriver) => {
  return browserDriver.getCapabilities()
  .then((capabilities) => {
    const browserName = capabilities.get(seleniumWebdriver.Capability.BROWSER_NAME);
    if (browserName !== 'chrome') {
      console.log(`Skipping log check for: '${browserName}'`);
      return;
    }
    const logs = browserDriver.manage().logs();
    return logs.get(seleniumWebdriver.logging.Type.BROWSER)
    .then((logEntries) => {
      logEntries.forEach((logEntry) => {
        if (logEntry.level.value > seleniumWebdriver.logging.Level.FINE.value) {
          if (logEntry.message.indexOf('Failed to decode downloaded font') !== -1) {
            return;
          }

          throw new Error(`Browser has an error message: '${logEntry.message}'`);
        }
      });
    });
  });
}

module.exports = checkLogs;
