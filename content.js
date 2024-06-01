// Function to fetch the API key from Chrome storage
function getApiKey() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('apiKey', (data) => {
      if (data.apiKey) {
        resolve(data.apiKey);
      } else {
        reject('No API key found');
      }
    });
  });
}

// Function to fetch response from ChatGPT API
async function fetchChatGPTResponse(inputText) {
  try {
    const apiKey = await getApiKey();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Given is the input text that a user is trying to write in some input or textarea for some specific purpose on a web page. Take the context to make better & concise suggestions to help user write better input. Ensure to always provide 3 suggestions in an array only plainly without any code block symbols(```) nor with numbering or bullets'
          },
          {
            role: 'user',
            content: inputText
          }
        ]
      })
    });

    const responseData = await response.json();
    return responseData.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching response from ChatGPT API:', error);
    return null;
  }
}

// Function to show suggestions in a dropdown
function showSuggestions(inputElement, suggestions) {
  // Remove any existing dropdown
  const existingDropdown = document.querySelector('.suggestion-dropdown');
  if (existingDropdown) {
    existingDropdown.remove();
  }

  // Create a dropdown element
  const dropdown = document.createElement('div');
  dropdown.classList.add('suggestion-dropdown');

  // Calculate the position of the input element
  const rect = inputElement.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const dropdownHeight = 200; // Max height of the dropdown
  const spaceBelow = windowHeight - rect.bottom;
  const spaceAbove = rect.top;

  if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
    // Position the dropdown above the input element
    dropdown.style.bottom = (windowHeight - rect.top + 5) + 'px';
    dropdown.style.left = rect.left + 'px';
  } else {
    // Position the dropdown below the input element
    dropdown.style.top = (rect.bottom + 5) + 'px';
    dropdown.style.left = rect.left + 'px';
  }

  // Add suggestions to the dropdown
  suggestions.forEach(suggestion => {
    const suggestionItem = document.createElement('div');
    suggestionItem.textContent = suggestion;
    suggestionItem.addEventListener('click', () => {
      inputElement.value = suggestion;
      dropdown.remove(); // Remove the dropdown after selection
    });

    dropdown.appendChild(suggestionItem);
  });

  document.body.appendChild(dropdown);
}

// Function to fetch ChatGPT response and show suggestions
async function fillInputWithChatGPTResponse(inputElement) {
  try {
    const inputValue = inputElement.value;
    const response = await fetchChatGPTResponse(inputValue);
    if (response !== null) {
      const suggestions = response.split('\n').filter(line => line.trim() !== '');
      showSuggestions(inputElement, suggestions);
    }
  } catch (error) {
    if (error === 'No API key found') {
      alert('Please add your API key in the extension settings.');
    } else {
      console.error('Error:', error);
    }
  }
}


// Function to add improvement icons to text inputs and textareas on the page
function addImprovementIcons() {
  const textInputs = document.querySelectorAll('input[type="text"], textarea');
  textInputs.forEach(function (input) {
    createImprovementIcon(input);
  });
}

// Function to remove all improvement icons
function removeImprovementIcons() {
  const wrappers = document.querySelectorAll('.improvement-wrapper');
  wrappers.forEach(wrapper => {
    const element = wrapper.firstChild; // The original input/textarea element
    wrapper.parentNode.insertBefore(element, wrapper); // Move the element out of the wrapper
    wrapper.remove(); // Remove the wrapper
  });
}

// Function to create and append the improvement icon
function createImprovementIcon(element) {
  // Check if the wrapper already exists to avoid duplicating icons
  if (element.parentNode.classList.contains('improvement-wrapper')) {
    return;
  }

  // Create a wrapper for the element
  const wrapper = document.createElement('div');
  wrapper.classList.add('improvement-wrapper');
  wrapper.style.position = 'relative';
  wrapper.style.display = 'inline-block';
  wrapper.style.width = element.offsetWidth + 'px';
  wrapper.style.height = element.offsetHeight + 'px';
  wrapper.style.verticalAlign = 'top';

  // Insert the wrapper before the element
  element.parentNode.insertBefore(wrapper, element);

  // Move the element into the wrapper
  wrapper.appendChild(element);

  // Adjust element styling to ensure it fits inside the wrapper
  element.style.boxSizing = 'border-box';
  element.style.width = 'calc(100% - 25px)'; // Adjust width to accommodate icon

  var icon = document.createElement('img');
  icon.src = 'https://cdn-icons-png.freepik.com/512/5278/5278434.png?ga=GA1.1.1159128350.1716491571';
  icon.classList.add('improvement-icon');
  icon.title = 'Get Suggestions';

  icon.addEventListener('click', function () {
    fillInputWithChatGPTResponse(element);
  });

  wrapper.appendChild(icon);
}

// MutationObserver callback to handle dynamic DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const textInputs = node.querySelectorAll ? node.querySelectorAll('input[type="text"], textarea') : [];
          textInputs.forEach((input) => {
            createImprovementIcon(input);
          });
        }
      });
    }
  });
});

// Start observing the document body for added nodes
observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from background script to determine when to add or remove improvement icons
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'enable_extension') {
    addImprovementIcons();
    observer.observe(document.body, { childList: true, subtree: true }); // Ensure observer is active
  } else if (message.action === 'disable_extension') {
    removeImprovementIcons();
    observer.disconnect(); // Stop observing when the extension is disabled
  }
});

// Check if the extension is enabled on load
chrome.storage.sync.get('extensionEnabled', function(result) {
  if (result.extensionEnabled) {
    addImprovementIcons();
    observer.observe(document.body, { childList: true, subtree: true }); // Ensure observer is active
  }
});
