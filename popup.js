document.addEventListener('DOMContentLoaded', function() {
  var toggleSwitch = document.getElementById('toggleSwitch');
  var apiKeyInput = document.getElementById('apiKey');
  var saveApiKeyButton = document.getElementById('saveApiKey');
  var clearApiKeyButton = document.getElementById('clearApiKey');
  
  // Load saved API key from Chrome storage
  chrome.storage.sync.get(['apiKey'], function(result) {
      if (result.apiKey) {
          apiKeyInput.value = result.apiKey;
          // Hide the API key input field if an API key is saved
          apiKeyInput.style.display = 'none';
          saveApiKeyButton.style.display = 'none';
          clearApiKeyButton.style.display = 'inline-block';
      } else {
          // Hide the Clear button if no API key is saved
          clearApiKeyButton.style.display = 'none';
      }
  });
  
  // Toggle the extension state when the toggle switch is clicked
  toggleSwitch.addEventListener('change', function() {
      var isChecked = toggleSwitch.checked;
      
      // Save the state of the extension to Chrome storage
      chrome.storage.sync.set({ 'extensionEnabled': isChecked }, function() {
          console.log('Extension ' + (isChecked ? 'enabled' : 'disabled'));
          
          // Send a message to the background script to enable or disable the extension
          chrome.runtime.sendMessage({ action: isChecked ? 'enable_extension' : 'disable_extension' });
          
          // Update the visibility of the suggest improvement button based on the toggle switch state
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, { action: isChecked ? 'enable_extension' : 'disable_extension' });
          });
      });
  });
  
  // Save the API key when the "Save" button is clicked
  saveApiKeyButton.addEventListener('click', function() {
      var apiKey = apiKeyInput.value.trim();
      if (apiKey) {
          // Save the API key to Chrome storage
          chrome.storage.sync.set({ 'apiKey': apiKey }, function() {
              console.log('API key saved:', apiKey);
              // Hide the API key input field after saving
              apiKeyInput.style.display = 'none';
              saveApiKeyButton.style.display = 'none';
              clearApiKeyButton.style.display = 'inline-block';
          });
      } else {
          console.log('Please enter an API key');
      }
  });
  
  // Clear the saved API key when the "Clear" button is clicked
  clearApiKeyButton.addEventListener('click', function() {
      // Clear the API key from Chrome storage
      chrome.storage.sync.remove('apiKey', function() {
          console.log('API key cleared');
          // Show the API key input field and save button after clearing
          apiKeyInput.style.display = 'inline-block';
          saveApiKeyButton.style.display = 'inline-block';
          clearApiKeyButton.style.display = 'none';
      });
  });
});
