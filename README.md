# TextEnhancer Pro

TextEnhancer Pro is a Chrome extension designed to enhance your text inputs with AI-powered suggestions. Utilizing the power of OpenAI's GPT-4 model, this extension helps you write better and more concise text by providing three suggestions for improvement.

## Features

- **AI-Powered Suggestions**: Get three AI-generated suggestions for improving your text inputs.
- **User-Friendly Interface**: Simple and intuitive interface for enabling/disabling the extension and managing API keys.
- **Dynamic Input Handling**: Automatically adds improvement icons to text inputs and textareas on web pages, even if they are dynamically added.
- **Persistent Storage**: Saves your API key and extension state using Chrome's storage, ensuring your settings persist across sessions.

## Installation

1. **Clone the Repository**:
   ```
   git clone https://github.com/kartik-syal/ai-text-enhancer-pro.git
   ```

2. **Load the Extension**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable "Developer mode" using the toggle switch in the top right corner.
   - Click "Load unpacked" and select the directory where you cloned the repository.

3. **Set Your OpenAI API Key**:
   - Click on the TextEnhancer Pro extension icon in the Chrome toolbar.
   - Enter your OpenAI API key and click "Save".

## Usage

1. **Enable/Disable Extension**:
   - Use the toggle switch in the extension popup to enable or disable TextEnhancer Pro.

2. **Get Text Suggestions**:
   - When enabled, an improvement icon will appear in text input fields and textareas on web pages.
   - Click the improvement icon to receive three suggestions from the AI.

## Files and Directories

- `manifest.json`: Defines the extension's metadata and permissions.
- `background.js`: Manages the background script for handling extension state and messaging.
- `content.js`: Handles the logic for interacting with web pages, fetching suggestions, and displaying dropdowns.
- `popup.html`: The HTML for the extension's popup interface.
- `popup.js`: JavaScript for handling the popup's functionality.
- `popup.css`: Styling for the popup interface.
- `styles.css`: Additional CSS for styling the improvement icons and suggestion dropdowns.

## Contributing

We welcome contributions to improve TextEnhancer Pro! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your fork and open a pull request.

## Contact

For questions or feedback, please open an issue on GitHub or contact us at [kartik.syal40@gmail.com].

---

Thank you for using TextEnhancer Pro! We hope it helps you write better and more concise text with ease.