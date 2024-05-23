// Get the API key from environment variable
const apiKey = process.env.OPENAI_API_KEY;

// Function to fetch response from ChatGPT API
async function fetchChatGPTResponse(inputText) {
    try {
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
    var textInputs = document.querySelectorAll('input, textarea');
    textInputs.forEach(function(input) {
      createImprovementIcon(input);
    });
  }
  
  // Function to create and append the improvement icon
  function createImprovementIcon(element) {
    var icon = document.createElement('img');
    icon.src = chrome.runtime.getURL('icon.png'); // Replace 'improvement_icon.png' with your icon file
    icon.style.position = 'absolute';
    icon.style.right = '5px';
    icon.style.top = '50%';
    icon.style.transform = 'translateY(-50%)';
    icon.style.cursor = 'pointer';
    icon.title = 'Suggest improvement';
    
    icon.addEventListener('click', function() {
      fillInputWithChatGPTResponse(element);
    });
  
    element.parentNode.appendChild(icon);
  }
  
  // Listen for messages from background script to determine when to add improvement icons
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'enable_extension') {
      addImprovementIcons();
    }
  });
  
  // Add improvement icons when the content script is injected
  window.addEventListener('load', addImprovementIcons); // Ensure content script is injected after page load
  