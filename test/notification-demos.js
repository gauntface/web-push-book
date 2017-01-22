const seleniumAssistant = require('selenium-assistant');
const testServer = require('./utils/test-server');
const approveNotificationPermission = require('./utils/approve-notification-permission');
const checkLogs = require('./utils/check-logs.js');

describe('Notification Demos', function() {
  let testUrl;

  before(function() {
    this.timeout(4000);
    return testServer.start()
    .then((url) => {
      testUrl = url;
    });
  });

  after(function() {
    this.timeout(4000);
    return testServer.stop();
  });

  const setUpTest = function(localBrowser) {
    describe(localBrowser.getPrettyName(), function() {
      const TIMEOUT = 30 * 1000;
      this.timeout(TIMEOUT);
      this.retries(2);

      let browserDriver;

      before(function() {
        this.timeout(4000);

        localBrowser = approveNotificationPermission(localBrowser, testUrl);

        return localBrowser.getSeleniumDriver()
        .then((driver) => {
          browserDriver = driver;
          browserDriver.manage().timeouts().setScriptTimeout(TIMEOUT);
        });
      });

      after(function() {
        this.timeout(10 * 1000);

        return seleniumAssistant.killWebDriver(browserDriver);
      });

      it('should be able to load notification demos', function() {
        return browserDriver.get(`${testUrl}/demos/notification-examples/`)
        .then(() => {
          return browserDriver.executeScript(function() {
            const classNames = []
            document.querySelectorAll('button').forEach((button) => {
              classNames.push(button.className);
            });
            return classNames;
          });
        })
        .then((buttonClassNames) => {
          return buttonClassNames.reduce((promiseChain, buttonClassName) => {
            return promiseChain.then(() => {
              return browserDriver.executeScript(function(buttonClassName) {
                // Click the button
                const button = document.querySelector(`.${buttonClassName}`);
                if (!button.disabled) {
                  button.click();
                }

                return button.disabled;
              }, buttonClassName)
              .then((buttonDisabled) => {
                if (buttonDisabled) {
                  return;
                }

                // Check notification is displayed
                return browserDriver.wait(function() {
                  return browserDriver.executeAsyncScript(function() {
                    const done = arguments[arguments.length - 1];
                    navigator.serviceWorker.getRegistration()
                    .then((reg) => {
                      return reg.getNotifications();
                    })
                    .then((notifications) => {
                      done(notifications.length > 0);
                    });
                  });
                })
                .then(() => {
                  // Check the button betcomes enabled afterwards
                  return browserDriver.wait(function() {
                    return browserDriver.executeScript(function(buttonClassName) {
                      // Click the button
                      const button = document.querySelector(`.${buttonClassName}`);
                      return !button.disabled;
                    }, buttonClassName);
                  })
                });
              })
              .then(() => {
                return browserDriver.executeAsyncScript(function() {
                  const done = arguments[arguments.length - 1];
                  navigator.serviceWorker.getRegistration()
                  .then((reg) => {
                    return reg.getNotifications();
                  })
                  .then((notifications) => {
                    return Promise.all(
                      notifications.map((notification) => {
                        return notification.close();
                      })
                    );
                  })
                  .then(done);
                });
              });
            });
          }, Promise.resolve());
        })
        .then(() => {
          return checkLogs(browserDriver);
        });
      });
    });
  };

  const localBrowsers = seleniumAssistant.getLocalBrowsers();
  localBrowsers.forEach((localBrowser) => {
    switch(localBrowser.getId()) {
      case 'chrome':
      case 'firefox':
        setUpTest(localBrowser);
        break;
      default:
        console.log(`Skipping '${localBrowser.getPrettyName()}'.`);
        break;
    }
  });
});
