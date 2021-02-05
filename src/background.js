const actionApi = chrome[process.env.CHROME? 'action' : 'browserAction'];

const offIcon = (tabId, reason) => {
  const iconSizes = {
    '16' : 'icon-grayed-16.png',
    '32' : 'icon-grayed-32.png'
  };
  const name = 'HAR/JSON viewer';
  const titles = [
    `${name} cannot parse this content`,
    `${name} needs your permission to access local files:
chrome://extensions -> ${name} -> Details -> Allow access to File URLs`
  ];
  actionApi.setIcon({ tabId, path: iconSizes});
  actionApi.setTitle({ tabId, title: titles[reason? 1: 0] });
  actionApi.disable(tabId);
};

const setBadge = (tabId, mode) => {
  const badges = ['', process.env.CHROME? 'JSON' : 'json', 'HAR'];
  actionApi.setBadgeText({ tabId, text: badges[mode] || '' });
};

chrome.runtime.onMessage.addListener( (data, sender) => {
  if (!sender.tab || !sender.tab.id)
    return;
  const { id, type, mode } = data || {};
  if (id !== 'initIcon')
    return;
  const tabId = sender.tab.id;
  type? setBadge(tabId, mode) : offIcon(tabId);
});

let filesAllowed = true;

if (process.env.CHROME) {
  chrome.extension.isAllowedFileSchemeAccess( allowed => {
    filesAllowed = allowed;
  });
}

actionApi.onClicked.addListener( tab => {
  if (!tab.id)
    return;
  const tabId = tab.id;
  if (!tab.url || !/^(?:file|https?):/.test(tab.url)) {
    offIcon(tabId);
    return;
  }
  if (!filesAllowed && tab.url.indexOf('file:') === 0) {
    offIcon(tabId, 1);
    return;
  }
  chrome.tabs.sendMessage(tabId, {id: 'clickIcon'}, data => {
    if (chrome.runtime.lastError) {
      chrome.tabs.executeScript({ file: 'content.js' }, () => {
        chrome.runtime.lastError && offIcon(tabId);
      });
    }
    else {
      const { mode } = data || {};
      setBadge(tabId, mode);
    }
  });
});
