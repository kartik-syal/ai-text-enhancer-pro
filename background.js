chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action == "fill_input") {
    chrome.scripting.executeScript({
      target: {tabId: sender.tab.id},
      files: ['content.js']
    });
  }
});
