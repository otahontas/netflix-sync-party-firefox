function runOnNetflixTab(tab) {
  const NETFLIX_WATCH_REGEX = /netflix\.com\/watch\/\d*/gi;
  const WATCH_TRACK_REGEX = /watch\/\d*/gi;
  const TRACK_ID_REGEX = /\d.*/gi;
  const GMT_TIMESTAMP_REGEX = /\d.*/gi;
  const SYNC_GMT_TIMESTAMP_PARAM = 'syncGMTTimestampSec';
  const SYNC_GMT_TIMESTAMP_REGEX = new RegExp("[\\?&]" + SYNC_GMT_TIMESTAMP_PARAM + "=([^&#]*)");

  const EXTENSION_LINK = 'https://github.com/debkbanerji/netflix-sync-extension/releases';

  const MS_IN_SEC = 1000;

  const url = tab.url;

  // hide all possible views, then show the one we want to view
  document.getElementById('synced-video-view').hidden = true
  document.getElementById('unsynced-video-view').hidden = true;
  document.getElementById('non-video-view').hidden = true;

  let trackID = null;

  if (NETFLIX_WATCH_REGEX.test(url)) {
    if (SYNC_GMT_TIMESTAMP_REGEX.test(url)) {
      document.getElementById('synced-video-view').hidden = false;

      document.getElementById('resync').addEventListener('click', () => {
        chrome.tabs.reload(tab.id);
      });

      document.getElementById('copy-url').addEventListener('click', () => {
        navigator.clipboard.writeText(url);
      });

      const timestampGMTMatch = SYNC_GMT_TIMESTAMP_REGEX.exec(url)[0];
      const timestampGMT = parseInt(GMT_TIMESTAMP_REGEX.exec(timestampGMTMatch)[0]) * MS_IN_SEC;

      document.getElementById('scheduled-start-time-gmt').innerHTML = new Date(timestampGMT).toUTCString();;

    } else {
      document.getElementById('unsynced-video-view').hidden = false;

      // get track ID
      const trackIDMatch = WATCH_TRACK_REGEX.exec(url)[0];
      const trackID = TRACK_ID_REGEX.exec(trackIDMatch)[0];

      document.getElementById('copy-extension-link').addEventListener('click', () => {
        navigator.clipboard.writeText(EXTENSION_LINK);
      });
    }
  } else {
    document.getElementById('non-video-view').hidden = false;
  }
}

chrome.tabs.query({
  active: true,
  currentWindow: true
}, (tabs) => {
  // attach the extension logic to currently opened tab
  const targetTab = tabs[0];
  const targetTabID = targetTab.id;
  runOnNetflixTab(targetTab);

  // whenever the url of this tab changes, rerun this
  chrome.tabs.onUpdated.addListener((tabID, changeInfo, tab) => {
    if (tabID === targetTabID && changeInfo.status === 'complete') {
      runOnNetflixTab(tab);
    }
  });
});