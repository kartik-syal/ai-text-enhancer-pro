# AutoFill Extension

AutoFill Extension is a Chrome extension that automatically suggests improvements for text inputs on webpages using ChatGPT.

## Features

- Automatically suggests improvements for text inputs and textareas on webpages.
- Uses the ChatGPT API to generate improved suggestions.
- Toggle switch to enable or disable the extension.

## Installation

1. Clone or download the repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable Developer mode using the toggle switch at the top right.
4. Click on "Load unpacked" and select the directory where you cloned or downloaded the extension.

## Usage

1. Once installed, the extension icon will appear in the Chrome toolbar.
2. Click on the extension icon to open the popup.
3. Toggle the switch to enable or disable the extension.
4. When enabled, the extension will automatically suggest improvements for text inputs and textareas on webpages.

## Environment Variables

- `OPENAI_API_KEY`: Set this environment variable to your ChatGPT API key. This key is used by the extension to access the ChatGPT API for generating suggestions.

## Troubleshooting

- If the extension is not working as expected, try refreshing the webpage or reloading the extension in `chrome://extensions/`.
- Ensure that the `OPENAI_API_KEY` environment variable is correctly set with your ChatGPT API key.
- Check the console in the Chrome DevTools for any errors or warnings related to the extension.

## Contributions

Contributions are welcome! If you find any issues or have suggestions for improvements, please create a GitHub issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Make sure to replace `YOUR_CHATGPT_API_KEY` with your actual ChatGPT API key in the environment variable section.