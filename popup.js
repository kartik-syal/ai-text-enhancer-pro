document.addEventListener('DOMContentLoaded', function() {
    var toggleSwitch = document.getElementById('toggleSwitch');
    var apiKeyInput = document.getElementById('apiKey');
    var saveApiKeyButton = document.getElementById('saveApiKey');
    var clearApiKeyButton = document.getElementById('clearApiKey');
    
    // Load saved API key from Chrome storage
    chrome.storage.sync.get(['apiKey'], function(result) {
        if (result.apiKey) {
            apiKeyInput.value = result.apiKey;
            apiKeyInput.style.display = 'none';
            saveApiKeyButton.style.display = 'none';
            clearApiKeyButton.style.display = 'inline-block';
        } else {
            clearApiKeyButton.style.display = 'none';
        }
    });
  
    // Load the state of the extension from Chrome storage
    chrome.storage.sync.get('extensionEnabled', function(result) {
        toggleSwitch.checked = result.extensionEnabled || false;
    });
    
    // Toggle the extension state when the toggle switch is clicked
    toggleSwitch.addEventListener('change', function() {
        var isChecked = toggleSwitch.checked;
        
        chrome.storage.sync.set({ 'extensionEnabled': isChecked }, function() {
            console.log('Extension ' + (isChecked ? 'enabled' : 'disabled'));
            
            chrome.runtime.sendMessage({ action: isChecked ? 'enable_extension' : 'disable_extension' });
        });
    });
    
    // Save the API key when the "Save" button is clicked
    saveApiKeyButton.addEventListener('click', function() {
        var apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.sync.set({ 'apiKey': apiKey }, function() {
                console.log('API key saved:', apiKey);
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
        chrome.storage.sync.remove('apiKey', function() {
            console.log('API key cleared');
            apiKeyInput.style.display = 'inline-block';
            saveApiKeyButton.style.display = 'inline-block';
            clearApiKeyButton.style.display = 'none';
            apiKeyInput.value = ''; // Clear the input field
        });
    });
});
