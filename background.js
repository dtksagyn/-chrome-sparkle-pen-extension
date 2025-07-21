// background.js

// This background script will mainly ensure the content script is injectable
// if a user lands on a new tab, but the primary 'toggle'
// will be handled by the popup button.

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    // Only attempt to inject if the tab URL is valid and accessible
    if (
      tab &&
      tab.url &&
      !tab.url.startsWith("chrome://") &&
      !tab.url.startsWith("about:") &&
      !tab.url.startsWith("https://chromewebstore.google.com/") &&
      !tab.url.startsWith("edge://")
    ) {
      // Attempt to inject content.js into the newly active tab
      // This is generally a good practice to ensure the content script is always available
      // to receive messages from the popup, though the popup will also attempt injection.
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          files: ["content.js"],
        })
        .then(() => {
          console.log("Content script (re)injected into " + tab.url);
        })
        .catch((err) => {
          // Catch errors if injection fails on certain pages
          console.warn(
            "Failed to inject content script on " + tab.url + ":",
            err.message
          );
        });
    }
  });
});

// Listener for messages from popup to communicate with content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // This background script will simply forward messages to the content script.
  // The actual toggle logic resides in content.js.
  if (request.action === "togglePen") {
    // The popup handles the injection, so we just need to forward the message if needed.
    // Or, more robustly, ensure we target the right tab.
    if (sender.tab && sender.tab.id) {
      // We don't necessarily need to forward this message through background.js
      // as popup.js directly sends to the active tab.
      // This listener might become redundant if popup always injects first.
      // Keeping it minimal for now.
    }
    sendResponse({ status: "ok" });
  }
});
