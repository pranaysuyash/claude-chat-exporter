// When the DOM is fully loaded, execute the following code
document.addEventListener('DOMContentLoaded', () => { 
    // Add click event listeners to both buttons
    document.getElementById('downloadCurrentTab').addEventListener('click', downloadCurrentTabChat);
    document.getElementById('downloadFromUrl').addEventListener('click', downloadChatFromUrl);
  });
  
  // Function to update the status message in the popup
  function updateStatus(message, type = 'info') {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = type;
  }
  
  // Function to download the chat from the currently active tab
  function downloadCurrentTabChat() {
    updateStatus('Fetching current tab URL...');
    // Query the tabs API to get the URL of the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError || !tabs[0]) {
        updateStatus('Unable to get current tab URL.', 'error');
        return;
      }
      const activeTabUrl = tabs[0].url;
      console.log('Active Tab URL:', activeTabUrl);
      if (isValidClaudeUrl(activeTabUrl)) {
        // Send a message to the background script to download the chat
        chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: activeTabUrl });
      } else {
        updateStatus('Current tab is not a valid Claude chat URL.', 'error');
      }
    });
  }
  
  // Function to download the chat from the URL provided in the input field
  function downloadChatFromUrl() {
    const chatUrl = document.getElementById('chatUrl').value.trim();
    if (!chatUrl) {
      updateStatus('Please enter a Claude chat URL.', 'error');
      return;
    }
    if (!isValidClaudeUrl(chatUrl)) {
      updateStatus('Entered URL is not a valid Claude chat URL.', 'error');
      return;
    }
    console.log('Provided URL:', chatUrl);
    // Send a message to the background script to download the chat
    chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: chatUrl });
  }
  
  // Function to validate if a given URL is a valid Claude chat URL
  function isValidClaudeUrl(url) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname === 'claude.ai' && parsedUrl.pathname.startsWith('/chat/');
    } catch (e) {
      return false;
    }
  }