// Inject content script when extension is loaded
chrome.tabs.executeScript({
    file: 'content.js'
  });
  