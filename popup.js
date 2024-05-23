document.addEventListener('DOMContentLoaded', function() {
    var toggleSwitch = document.getElementById('toggleSwitch');
    
    // Check if the extension is enabled or disabled and set the toggle switch accordingly
    var extensionEnabled = localStorage.getItem('extensionEnabled') === 'true';
    toggleSwitch.checked = extensionEnabled;
    
    // Toggle the extension state when the toggle switch is clicked
    toggleSwitch.addEventListener('change', function() {
      var isChecked = toggleSwitch.checked;
      
      // Save the state of the extension to local storage
      localStorage.setItem('extensionEnabled', isChecked);
      
      console.log('Extension ' + (isChecked ? 'enabled' : 'disabled'));
      
      // Send a message to the background script to enable or disable the extension
      chrome.runtime.sendMessage({ action: isChecked ? 'enable_extension' : 'disable_extension' });
    });
  });
  