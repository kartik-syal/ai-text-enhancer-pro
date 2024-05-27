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
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Improve user input english'
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

// Function to fill input with ChatGPT response
async function fillInputWithChatGPTResponse(inputElement) {
  const inputValue = inputElement.value;
  const response = await fetchChatGPTResponse(inputValue);
  if (response !== null) {
    inputElement.value = response;
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
  icon.title = 'Suggest improvement';

  icon.addEventListener('click', function () {
    fillInputWithChatGPTResponse(element);
  });

  wrapper.appendChild(icon);
}

// Listen for messages from background script to determine when to add or remove improvement icons
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'enable_extension') {
    addImprovementIcons();
  } else if (message.action === 'disable_extension') {
    removeImprovementIcons();
  }
});

// Check if the extension is enabled on load
chrome.storage.sync.get('extensionEnabled', function(result) {
  if (result.extensionEnabled) {
    addImprovementIcons();
  }
});
