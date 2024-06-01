chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "fill_input") {
    chrome.scripting.executeScript({
      target: {tabId: sender.tab.id},
      files: ['content.js']
    });
  } else if (message.action === "enable_extension" || message.action === "disable_extension") {
    chrome.storage.sync.set({ extensionEnabled: message.action === "enable_extension" });
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(tab => {
        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          func: setExtensionState,
          args: [message.action === "enable_extension"]
        });
      });
    });
  }
});

function setExtensionState(isEnabled) {
  if (isEnabled) {
    addImprovementIcons();
  } else {
    removeImprovementIcons();
  }
}
