const seleniumFirefox = require('selenium-webdriver/firefox');
const fs = require('fs');

const approveNotificationPermisison = (seleniumAssistantBrowser, serverUrl) => {
  switch (seleniumAssistantBrowser.getId()) {
    case 'firefox':
      // This is based off of: https://bugzilla.mozilla.org/show_bug.cgi?id=1275521
      // Unfortunately it doesn't seem to work :(
      const ffProfile = new seleniumFirefox.Profile();
      ffProfile.setPreference('dom.push.testing.ignorePermission', true);
      ffProfile.setPreference('notification.prompt.testing', true);
      ffProfile.setPreference('notification.prompt.testing.allow', true);
      seleniumAssistantBrowser.getSeleniumOptions().setProfile(ffProfile);
      break;
    case 'chrome':
      const notificationsValue = {};
      notificationsValue[serverUrl + ',*'] = {
        setting: 1
      };
      const preferences = {
        profile: {
          content_settings: {
            exceptions: {
              notifications: notificationsValue
            }
          }
        }
      };
      const seleniumOptions = seleniumAssistantBrowser.getSeleniumOptions();
      seleniumOptions.setUserPreferences(preferences);
      break;
    default:
      console.log(`Unable to approve permission for ` +
        `'${seleniumAssistantBrowser.getPrettyName()}'`);
      break;
  }
  return seleniumAssistantBrowser;
};

module.exports = approveNotificationPermisison;
