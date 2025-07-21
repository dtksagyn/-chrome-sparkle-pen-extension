# Sparkle Pen Chrome Extension

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/YOUR_USERNAME/chrome-sparkle-pen-extension/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/chrome-sparkle-pen-extension.svg?style=social)](https://github.com/YOUR_USERNAME/chrome-sparkle-pen-extension/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/chrome-sparkle-pen-extension.svg?style=social)](https://github.com/YOUR_USERNAME/chrome-sparkle-pen-extension/network/members)

A whimsical Chrome Extension that adds a magical, customizable sparkle trail to your cursor as you browse the web! Experience a touch of enchantment and personalize your Browse experience.

## ✨ Features

* **Magical Cursor Trail:** Follows your mouse movement with a delightful stream of particles.
* **Toggle On/Off:** Easily activate or deactivate the sparkle effect via the extension's popup.
* **Customizable Sparkle Shapes:** Choose between different particle styles directly from the popup:
    * **Circle:** Classic, soft glow.
    * **Star:** Twinkling, celestial points.
    * **Bubble:** Bubbly, rising translucent spheres.
* **Performance Optimized:** Built with HTML5 Canvas and `requestAnimationFrame` for smooth animations without impacting page performance.
* **Manifest V3 Compliant:** Developed using the latest Chrome Extension API for enhanced security and efficiency.
* **User-Friendly Error Handling:** Intelligently disables the pen on Chrome internal pages or other non-injectable URLs, providing clear user feedback.

## 🚀 How to Install & Use

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/chrome-sparkle-pen-extension.git](https://github.com/YOUR_USERNAME/chrome-sparkle-pen-extension.git)
    ```
2.  **Open Chrome Extensions Page:**
    * Open your Chrome browser.
    * Type `chrome://extensions/` into the address bar and press Enter.
3.  **Enable Developer Mode:**
    * In the top-right corner of the Extensions page, toggle on the "Developer mode" switch.
4.  **Load Unpacked Extension:**
    * Click the "Load unpacked" button that appears.
    * Navigate to the folder where you cloned this repository (`chrome-sparkle-pen-extension`) and select it.
5.  **Pin the Extension (Optional, but Recommended):**
    * After loading, you'll see the "Sparkle Pen" extension listed.
    * Click the puzzle piece icon in your Chrome toolbar (usually next to the address bar).
    * Find "Sparkle Pen" in the dropdown list and click the "pin" icon next to it to make it visible on your toolbar.
6.  **Activate & Customize:**
    * Click the Sparkle Pen icon in your toolbar.
    * Click the "Activate Sparkle Pen" button.
    * Move your mouse to see the magic!
    * Use the "Shape" dropdown to change the sparkle style.

## 🛠️ Development & Structure

This extension is built using standard web technologies: HTML, CSS, and JavaScript.

* **`manifest.json`**: The blueprint of the extension, defining permissions, background script, popup, and other metadata.
* **`background.js`**: The service worker, running in the background. It listens for browser events (like tab activation) to ensure the `content.js` is available.
* **`popup.html` / `popup.js` / `styles/popup.css`**: The user interface that appears when you click the extension icon. It allows you to toggle the sparkle pen and customize its settings. It communicates with the `content.js` to control the effects.
* **`content.js`**: Injected directly into the active web page. This script creates the canvas overlay, listens for mouse movements, draws the sparkle particles, and manages the particle animation loop based on user settings.
* **`icons/`**: Contains the extension icons in various sizes.

## 🐛 Debugging

* Go to `chrome://extensions/`.
* Ensure "Developer mode" is on.
* For `background.js` issues, click "Service worker" under the Sparkle Pen extension.
* For `popup.js` / `popup.html` issues, click "popup.html" under the Sparkle Pen extension.
* For `content.js` issues (especially related to drawing/interactions on the webpage), right-click anywhere on the webpage where the extension is active, select "Inspect", and choose the `sparklePenCanvas` or the content script context in the Developer Tools console/sources tab.

## 🤝 Contributing

Feel free to fork this repository, open issues, or submit pull requests with improvements, new features, or bug fixes. All contributions are welcome!

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**[Your Name/GitHub Username]**
* [Link to your GitHub Profile (e.g., `https://github.com/YOUR_USERNAME`)]
* [Optional: Link to your personal website/portfolio]
* [Optional: Link to your LinkedIn profile]

---
