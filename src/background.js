const offIcon = (tabId) => {
  const iconSizes = {
    '16' : 'icon-grayed-16.png',
    '32' : 'icon-grayed-32.png'
  };
  const title = 'HAR/JSON viewer is inapplicable to this content';
  chrome.browserAction.setIcon({ tabId, path: iconSizes});
  chrome.browserAction.setTitle({ tabId, title });
  chrome.browserAction.disable(tabId);
};

const setBadge = (tabId, mode) => {
  const text = mode? (mode > 1? 'HAR' : 'JSON') : '';
  chrome.browserAction.setBadgeText({ tabId, text });
};

chrome.runtime.onMessage.addListener( (data, sender) => {
  if (!sender.tab || !sender.tab.id)
    return;
  const { id, type, mode } = data || {};
  if (id !== 'initIcon')
    return;
  const tabId = sender.tab.id;
  type? setBadge(tabId, mode) : offIcon(tabId);
  busy = false;
});

let busy = false;
chrome.browserAction.onClicked.addListener( tab => {
  if (busy || !tab.id)
    return;
  busy = true;
  const tabId = tab.id;
  
  chrome.tabs.sendMessage(tabId, {id: 'clickIcon'}, data => {
    if (chrome.runtime.lastError) {
      chrome.tabs.executeScript({ file: 'content.js' });
      return;
    }
    const { mode } = data || {};
    setBadge(tabId, mode);
    busy = false;
  });
});
