chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url.match(/(netflix)\.com/)) {
    chrome.pageAction.show(tabId);
  } else if (changeInfo.status === 'complete') {
    chrome.pageAction.hide(tabId);
  }
});
chrome.tabs.onCreated.addListener(function(tab) {
  if (tab.url && tab.url.match(/(netflix)\.com/)) {
    chrome.pageAction.show(tab.id);
  } else if (tab.url) {
    chrome.pageAction.hide(tab.id);
  }
});
