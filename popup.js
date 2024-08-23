// // // document.addEventListener('DOMContentLoaded', () => {
// // //     document.getElementById('downloadCurrentTab').addEventListener('click', () => {
// // //         // Get the URL of the current active tab
// // //         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// // //             const activeTabUrl = tabs[0].url;
// // //             console.log('Active Tab URL:', activeTabUrl); // Debugging line to check URL
// // //             downloadChat(activeTabUrl);
// // //         });
// // //     });

// // //     document.getElementById('downloadFromUrl').addEventListener('click', () => {
// // //         const chatUrl = document.getElementById('chatUrl').value.trim();
// // //         if (chatUrl) {
// // //             console.log('Provided URL:', chatUrl); // Debugging line to check URL
// // //             downloadChat(chatUrl);
// // //         } else {
// // //             alert('Please enter a valid URL.');
// // //         }
// // //     });
// // // });

// // // async function downloadChat(providedUrl = null) {
// // //     console.log('URL Passed to downloadChat:', providedUrl); // Debugging line to check URL
// // //     const url = providedUrl ? new URL(providedUrl) : new URL(window.location.href);
// // //     const chatId = url.pathname.split('/').pop();
// // //     console.log('Extracted Chat ID:', chatId); // Debugging line to check chat ID
// // //     const organizationId = '27cd869d-5523-4018-97c9-c42cd0bb37a0';

// // //     try {
// // //         const response = await fetch(`https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`, {
// // //             method: 'GET',
// // //             credentials: 'include',
// // //             headers: {
// // //                 'Content-Type': 'application/json',
// // //             },
// // //         });

// // //         if (!response.ok) {
// // //             throw new Error(`HTTP error! status: ${response.status}`);
// // //         }

// // //         const data = await response.json();
// // //         console.log('Chat Data:', data);

// // //         let html = `
// // //         <!DOCTYPE html>
// // //         <html>
// // //         <head>
// // //             <meta charset="UTF-8">
// // //             <style>
// // //                 body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
// // //                 .message { margin-bottom: 15px; }
// // //                 .human { color: #4a4a4a; }
// // //                 .assistant { color: #0066cc; }
// // //             </style>
// // //         </head>
// // //         <body>
// // //         <h1>${data.name}</h1>
// // //         `;

// // //         data.chat_messages.forEach(msg => {
// // //             const className = msg.sender === 'human' ? 'human' : 'assistant';
// // //             html += `<div class="message ${className}">
// // //                 <strong>${msg.sender}:</strong> ${msg.text}
// // //                 <br><small>Created at: ${msg.created_at}</small>
// // //             </div>`;
// // //         });

// // //         html += '</body></html>';

// // //         const blob = new Blob([html], { type: 'text/html' });
// // //         const downloadUrl = URL.createObjectURL(blob);
// // //         const a = document.createElement('a');
// // //         a.style.display = 'none';
// // //         a.href = downloadUrl;
// // //         a.download = `claude_chat_${chatId}.html`;
// // //         document.body.appendChild(a);
// // //         a.click();
// // //         URL.revokeObjectURL(downloadUrl);

// // //     } catch (error) {
// // //         console.error('Error:', error);
// // //     }
// // // }


// // document.addEventListener('DOMContentLoaded', () => {
// //     document.getElementById('downloadCurrentTab').addEventListener('click', downloadCurrentTabChat);
// //     document.getElementById('downloadFromUrl').addEventListener('click', downloadChatFromUrl);
// // });

// // function updateStatus(message, type = 'info') {
// //     const statusElement = document.getElementById('status');
// //     statusElement.textContent = message;
// //     statusElement.className = type;
// // }

// // function downloadCurrentTabChat() {
// //     updateStatus('Fetching current tab URL...');
// //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
// //         if (chrome.runtime.lastError || !tabs[0]) {
// //             updateStatus('Unable to get current tab URL.', 'error');
// //             return;
// //         }
// //         const activeTabUrl = tabs[0].url;
// //         console.log('Active Tab URL:', activeTabUrl);
// //         if (isValidClaudeUrl(activeTabUrl)) {
// //             downloadChat(activeTabUrl);
// //         } else {
// //             updateStatus('Current tab is not a valid Claude chat URL.', 'error');
// //         }
// //     });
// // }

// // function downloadChatFromUrl() {
// //     const chatUrl = document.getElementById('chatUrl').value.trim();
// //     if (!chatUrl) {
// //         updateStatus('Please enter a Claude chat URL.', 'error');
// //         return;
// //     }
// //     if (!isValidClaudeUrl(chatUrl)) {
// //         updateStatus('Entered URL is not a valid Claude chat URL.', 'error');
// //         return;
// //     }
// //     console.log('Provided URL:', chatUrl);
// //     downloadChat(chatUrl);
// // }

// // function isValidClaudeUrl(url) {
// //     try {
// //         const parsedUrl = new URL(url);
// //         return parsedUrl.hostname === 'claude.ai' && parsedUrl.pathname.startsWith('/chat/');
// //     } catch (e) {
// //         return false;
// //     }
// // }

// // async function getOrganizationId() {
// //     try {
// //         const response = await fetch('https://api.claude.ai/api/organizations', {
// //             method: 'GET',
// //             credentials: 'include',
// //             headers: {
// //                 'Content-Type': 'application/json',
// //             },
// //         });

// //         if (!response.ok) {
// //             throw new Error(`Failed to fetch organization ID. Status: ${response.status}`);
// //         }

// //         const data = await response.json();
// //         if (data.length > 0) {
// //             return data[0].uuid; // Assuming the first organization is the correct one
// //         } else {
// //             throw new Error('No organizations found');
// //         }
// //     } catch (error) {
// //         console.error('Error fetching organization ID:', error);
// //         return null;
// //     }
// // }

// // async function downloadChat(chatUrl) {
// //     updateStatus('Fetching chat data...');
// //     const url = new URL(chatUrl);
// //     const chatId = url.pathname.split('/').pop();
// //     console.log('Extracted Chat ID:', chatId);

// //     const organizationId = await getOrganizationId();
// //     if (!organizationId) {
// //         updateStatus('Failed to retrieve organization ID.', 'error');
// //         return;
// //     }

// //     const apiUrl = `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`;

// //     try {
// //         const response = await fetch(apiUrl, {
// //             method: 'GET',
// //             credentials: 'include',
// //             headers: {
// //                 'Content-Type': 'application/json',
// //             },
// //         });

// //         if (!response.ok) {
// //             throw new Error(`Failed to fetch chat data. Status: ${response.status}`);
// //         }

// //         const data = await response.json();
// //         console.log('Chat Data:', data);

// //         const htmlContent = generateHtmlContent(data);
// //         initiateDownload(htmlContent, `claude_chat_${chatId}.html`);
// //         updateStatus('Chat downloaded successfully!', 'success');
// //     } catch (error) {
// //         console.error('Error:', error);
// //         updateStatus(`Error: ${error.message}`, 'error');
// //     }
// // }

// // function generateHtmlContent(data) {
// //     let html = `
// //     <!DOCTYPE html>
// //     <html>
// //     <head>
// //         <meta charset="UTF-8">
// //         <title>${data.name}</title>
// //         <style>
// //             body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f4f4; }
// //             h1 { text-align: center; color: #333; }
// //             .message { margin-bottom: 20px; padding: 15px; border-radius: 5px; }
// //             .human { background-color: #e9f7ef; border-left: 5px solid #2ecc71; }
// //             .assistant { background-color: #e8f0fe; border-left: 5px solid #3498db; }
// //             .message-header { font-weight: bold; margin-bottom: 10px; }
// //             .message-time { font-size: 12px; color: #888; }
// //             pre { white-space: pre-wrap; word-wrap: break-word; background-color: #f0f0f0; padding: 10px; border-radius: 4px; overflow: auto; }
// //         </style>
// //     </head>
// //     <body>
// //         <h1>${data.name}</h1>
// //     `;

// //     data.chat_messages.forEach(msg => {
// //         const className = msg.sender === 'human' ? 'human' : 'assistant';
// //         const messageTime = new Date(msg.created_at).toLocaleString();
// //         html += `
// //         <div class="message ${className}">
// //             <div class="message-header">${msg.sender === 'human' ? 'You' : 'Claude'} <span class="message-time">${messageTime}</span></div>
// //             <div class="message-content">${formatMessageText(msg.text)}</div>
// //         </div>
// //         `;
// //     });

// //     html += `
// //     </body>
// //     </html>
// //     `;

// //     return html;
// // }

// // function formatMessageText(text) {
// //     // Escape HTML characters
// //     const escapedText = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');

// //     // Convert markdown code blocks to <pre> tags
// //     const formattedText = escapedText.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');

// //     return formattedText.replace(/\n/g, '<br>');
// // }

// // function initiateDownload(content, filename) {
// //     const blob = new Blob([content], { type: 'text/html' });
// //     const url = URL.createObjectURL(blob);
    
// //     chrome.downloads.download({
// //         url: url,
// //         filename: filename,
// //         saveAs: true
// //     }, (downloadId) => {
// //         if (chrome.runtime.lastError) {
// //             console.error(`Download failed: ${chrome.runtime.lastError.message}`);
// //             updateStatus('Failed to initiate download.', 'error');
// //         } else {
// //             console.log(`Download initiated with ID: ${downloadId}`);
// //             // You can optionally update the status here to indicate successful initiation
// //         }
// //         // Revoke the URL after download starts or fails
// //         URL.revokeObjectURL(url); 
// //     });
// // }

// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById('downloadCurrentTab').addEventListener('click', downloadCurrentTabChat);
//     document.getElementById('downloadFromUrl').addEventListener('click', downloadChatFromUrl);
//   });
  
//   function updateStatus(message, type = 'info') {
//     const statusElement = document.getElementById('status');
//     statusElement.textContent = message;
//     statusElement.className = type;
//   }
  
//   function downloadCurrentTabChat() {
//     updateStatus('Fetching current tab URL...');
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       if (chrome.runtime.lastError || !tabs[0]) {
//         updateStatus('Unable to get current tab URL.', 'error');
//         return;
//       }
//       const activeTabUrl = tabs[0].url;
//       console.log('Active Tab URL:', activeTabUrl);
//       if (isValidClaudeUrl(activeTabUrl)) {
//         chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: activeTabUrl });
//       } else {
//         updateStatus('Current tab is not a valid Claude chat URL.', 'error');
//       }
//     });
//   }
  
//   function downloadChatFromUrl() {
//     const chatUrl = document.getElementById('chatUrl').value.trim();
//     if (!chatUrl) {
//       updateStatus('Please enter a Claude chat URL.', 'error');
//       return;
//     }
//     if (!isValidClaudeUrl(chatUrl)) {
//       updateStatus('Entered URL is not a valid Claude chat URL.', 'error');
//       return;
//     }
//     console.log('Provided URL:', chatUrl);
//     chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: chatUrl });
//   }
  
//   function isValidClaudeUrl(url) {
//     try {
//       const parsedUrl = new URL(url);
//       return parsedUrl.hostname === 'claude.ai' && parsedUrl.pathname.startsWith('/chat/');
//     } catch (e) {
//       return false;
//     }
//   }

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