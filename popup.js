// popup.js - REVISED FOR BUTTON FIX

document.addEventListener("DOMContentLoaded", async () => {
  const toggleSparklePenButton = document.getElementById("toggleSparklePen");
  const sparkleShapeSelect = document.getElementById("sparkleShape");

  // Function to check if a URL is injectable (unchanged)
  function isUrlInjectable(url) {
    if (!url) return false;
    const nonInjectablePrefixes = [
      "chrome://",
      "about:",
      "https://chromewebstore.google.com/",
      "edge://",
    ];
    for (const prefix of nonInjectablePrefixes) {
      if (url.startsWith(prefix)) {
        return false;
      }
    }
    return true;
  }

  // Function to update button text based on pen status
  function updateButtonText(isActive) {
    toggleSparklePenButton.textContent = isActive
      ? "Deactivate Sparkle Pen"
      : "Activate Sparkle Pen";
  }

  // Function to send sparkle config to content script (unchanged)
  async function sendSparkleConfig(config) {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab || !isUrlInjectable(tab.url)) {
      console.warn("Cannot send config: Page not injectable.");
      return;
    }
    try {
      // Ensure content.js is present
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });
      await chrome.tabs.sendMessage(tab.id, {
        action: "updateSparkleConfig",
        config: config,
      });
      console.log("Sparkle config sent:", config);
    } catch (error) {
      console.error("Error sending sparkle config:", error);
    }
  }

  // Function to get initial state and set button text AND initial settings
  async function initializeButtonAndSettingsState() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !isUrlInjectable(tab.url)) {
      toggleSparklePenButton.disabled = true;
      toggleSparklePenButton.textContent = "Not Available on This Page";
      toggleSparklePenButton.style.backgroundColor = "#95a5a6";
      sparkleShapeSelect.disabled = true;
      return;
    } else {
      toggleSparklePenButton.disabled = false;
      toggleSparklePenButton.style.backgroundColor = "";
      sparkleShapeSelect.disabled = false;
    }

    try {
      // Ensure content script is injected BEFORE asking for status
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });

      // Now, send message to get current status from content.js
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "getPenStatus",
      });
      if (response && response.isPenActive !== undefined) {
        updateButtonText(response.isPenActive);
        // Set initial shape selection
        if (
          response.currentSparkleConfig &&
          response.currentSparkleConfig.shape
        ) {
          sparkleShapeSelect.value = response.currentSparkleConfig.shape;
        }
      } else {
        // If no proper response (e.g., content script just loaded and didn't respond to getPenStatus quickly)
        // assume it's inactive
        updateButtonText(false);
      }
    } catch (error) {
      console.error("Error initializing Sparkle Pen state or settings:", error);
      updateButtonText(false);
      toggleSparklePenButton.disabled = true;
      toggleSparklePenButton.textContent = "Error Loading Pen";
      toggleSparklePenButton.style.backgroundColor = "#e74c3c";
      sparkleShapeSelect.disabled = true;
    }
  }

  // Toggle Sparkle Pen functionality
  toggleSparklePenButton.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab || !isUrlInjectable(tab.url)) {
      alert(
        "The Sparkle Pen cannot be activated on this type of page (e.g., Chrome internal pages, Web Store, or blank tabs). Please switch to a regular website."
      );
      return;
    }

    try {
      // Ensure content script is injected (important for the first click on a fresh page)
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });

      // Get the current status from the content script
      const statusResponse = await chrome.tabs.sendMessage(tab.id, {
        action: "getPenStatus",
      });
      let currentPenActiveState = statusResponse
        ? statusResponse.isPenActive
        : false;

      // Determine the target action based on the actual state
      const targetAction = currentPenActiveState
        ? "deactivatePen"
        : "activatePen";

      // Send the explicit activate/deactivate message
      const toggleResponse = await chrome.tabs.sendMessage(tab.id, {
        action: targetAction,
      });

      // Update button text based on the *response* from content.js
      if (toggleResponse && toggleResponse.isPenActive !== undefined) {
        updateButtonText(toggleResponse.isPenActive);
      } else {
        // Fallback: If no good response, just toggle the text based on what we tried to do
        updateButtonText(!currentPenActiveState);
      }
    } catch (error) {
      console.error("Error toggling Sparkle Pen:", error);
      alert(
        "An unexpected error occurred while trying to toggle the Sparkle Pen."
      );
      // Re-initialize button state in case of error
      initializeButtonAndSettingsState();
    }
  });

  // Listen for changes in the sparkle shape select box (unchanged)
  sparkleShapeSelect.addEventListener("change", (event) => {
    const selectedShape = event.target.value;
    sendSparkleConfig({ shape: selectedShape });
  });

  // Call initialize function when the popup loads
  initializeButtonAndSettingsState();
});
