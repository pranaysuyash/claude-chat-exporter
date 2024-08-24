// // When the DOM is fully loaded, execute the following code
// document.addEventListener('DOMContentLoaded', () => { 
//   // Add click event listeners to both buttons
//   document.getElementById('downloadCurrentTab').addEventListener('click', downloadCurrentTabChat);
//   document.getElementById('downloadFromUrl').addEventListener('click', downloadChatFromUrl);
//   document.getElementById('massDownload').addEventListener('click', massDownloadChats);
//   document.getElementById('downloadSelectedChats').addEventListener('click', downloadSelectedChats);
// });

// // Function to update the status message in the popup
// function updateStatus(message, type = 'info') {
//   const statusElement = document.getElementById('status');
//   statusElement.textContent = message;
//   statusElement.className = type;
// }

// // Function to download the chat from the currently active tab
// function downloadCurrentTabChat() {
//   updateStatus('Fetching current tab URL...');
//   // Query the tabs API to get the URL of the active tab
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     if (chrome.runtime.lastError || !tabs[0]) {
//       updateStatus('Unable to get current tab URL.', 'error');
//       return;
//     }
//     const activeTabUrl = tabs[0].url;
//     console.log('Active Tab URL:', activeTabUrl);
//     if (isValidClaudeUrl(activeTabUrl)) {
//       // Send a message to the background script to download the chat
//       chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: activeTabUrl });
//     } else {
//       updateStatus('Current tab is not a valid Claude chat URL.', 'error');
//     }
//   });
// }

// // Function to download the chat from the URL provided in the input field
// function downloadChatFromUrl() {
//   const chatUrl = document.getElementById('chatUrl').value.trim();
//   if (!chatUrl) {
//     updateStatus('Please enter a Claude chat URL.', 'error');
//     return;
//   }
//   if (!isValidClaudeUrl(chatUrl)) {
//     updateStatus('Entered URL is not a valid Claude chat URL.', 'error');
//     return;
//   }
//   console.log('Provided URL:', chatUrl);
//   // Send a message to the background script to download the chat
//   chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: chatUrl });
// }

// // Function to validate if a given URL is a valid Claude chat URL
// function isValidClaudeUrl(url) {
//   try {
//     const parsedUrl = new URL(url);
//     return parsedUrl.hostname === 'claude.ai' && parsedUrl.pathname.startsWith('/chat/');
//   } catch (e) {
//     return false;
//   }
// }

// // Mass Download Feature
// // async function massDownloadChats() {
// //   updateStatus('Fetching all available chats...');
// //   const organizationId = await getOrganizationId();
// //   if (!organizationId) {
// //       updateStatus('Failed to retrieve organization ID.', 'error');
// //       return;
// //   }

// //   const response = await fetch(`https://api.claude.ai/api/organizations/${organizationId}/chat_conversations`, {
// //       method: 'GET',
// //       credentials: 'include',
// //       headers: {
// //           'Content-Type': 'application/json',
// //       },
// //   });

// //   if (!response.ok) {
// //       updateStatus('Failed to fetch chat list.', 'error');
// //       return;
// //   }

// //   const chatList = await response.json();
// //   console.log('Available Chats:', chatList);

// //   // Show the chat list for selection
// //   renderChatListForSelection(chatList);
// // }
// // function massDownloadChats() {
// //   updateStatus('Fetching all available chats...');
  
// //   chrome.runtime.sendMessage({ action: 'fetchChats' }, (response) => {
// //       if (chrome.runtime.lastError || !response.success) {
// //           updateStatus('Failed to retrieve chats.', 'error');
// //           return;
// //       }
// //       const chatList = response.chatList;
// //       console.log('Available Chats:', chatList);

// //       // Show the chat list for selection
// //       renderChatListForSelection(chatList);
// //   });
// // }

// // function massDownloadChats() {
// //   updateStatus('Fetching all available chats...');
  
// //   chrome.runtime.sendMessage({ action: 'fetchChats' }, (response) => {
// //       if (chrome.runtime.lastError || !response.success) {
// //           console.error('Error in response:', chrome.runtime.lastError);
// //           updateStatus('Failed to retrieve chats.', 'error');
// //           return;
// //       }
// //       console.log('Chat list received:', response.chatList);
      
// //       const chatList = response.chatList;
// //       if (!chatList || chatList.length === 0) {
// //           console.error('No chats found or chat list is empty.');
// //           updateStatus('No chats found.', 'error');
// //           return;
// //       }
      
// //       // Show the chat list for selection
// //       renderChatListForSelection(chatList);
// //   });
// // }
// // function massDownloadChats() {
// //   updateStatus('Fetching all available chats...');
  
// //   chrome.runtime.sendMessage({ action: 'fetchChats' }, (response) => {
// //       if (chrome.runtime.lastError || !response || !response.success) {
// //           console.error('Error in response:', chrome.runtime.lastError || 'Response not successful');
// //           updateStatus('Failed to retrieve chats.', 'error');
// //           return;
// //       }
// //       console.log('Chat list received:', response.chatList);
      
// //       const chatList = response.chatList;
// //       if (!chatList || chatList.length === 0) {
// //           console.error('No chats found or chat list is empty.');
// //           updateStatus('No chats found.', 'error');
// //           return;
// //       }
      
// //       // Show the chat list for selection
// //       renderChatListForSelection(chatList);
// //   });
// // }

// function massDownloadChats() {
//     updateStatus('Fetching all available chats...');

//     chrome.runtime.sendMessage({ action: 'fetchChats' }, (response) => {
//         if (chrome.runtime.lastError || !response || !response.success) {
//             console.error('Error in response:', chrome.runtime.lastError || 'Response not successful');
//             updateStatus('Failed to retrieve chats.', 'error');
//             return;
//         }

//         console.log('Chat list received:', response.chatList);

//         const chatList = response.chatList;
//         if (!chatList || chatList.length === 0) {
//             console.error('No chats found or chat list is empty.');
//             updateStatus('No chats found.', 'error');
//             return;
//         }

//         // Show the chat list for selection
//         renderChatListForSelection(chatList);
//     });
// }


// // Function to render chat list with Select All option
// // function renderChatListForSelection(chatList) {
// //   const chatListContainer = document.getElementById('chatListContainer');
// //   const chatListElement = document.getElementById('chatList');

// //   // Clear any existing chat items
// //   chatListElement.innerHTML = '';

// //   // Create Select All checkbox
// //   const selectAllDiv = document.createElement('div');
// //   selectAllDiv.className = 'chat-item';
// //   const selectAllCheckbox = document.createElement('input');
// //   selectAllCheckbox.type = 'checkbox';
// //   selectAllCheckbox.id = 'selectAllCheckbox';
// //   const selectAllLabel = document.createElement('label');
// //   selectAllLabel.textContent = 'Select All';
  
// //   selectAllDiv.appendChild(selectAllCheckbox);
// //   selectAllDiv.appendChild(selectAllLabel);
// //   chatListElement.appendChild(selectAllDiv);

// //   // Add event listener for Select All functionality
// //   selectAllCheckbox.addEventListener('change', (e) => {
// //       const isChecked = e.target.checked;
// //       const checkboxes = chatListElement.querySelectorAll('input[type="checkbox"]:not(#selectAllCheckbox)');
// //       checkboxes.forEach(checkbox => {
// //           checkbox.checked = isChecked;
// //       });
// //   });

// //   // Create checkboxes for each chat item
// //   chatList.forEach(chat => {
// //       const chatItemDiv = document.createElement('div');
// //       chatItemDiv.className = 'chat-item';
// //       const checkbox = document.createElement('input');
// //       checkbox.type = 'checkbox';
// //       checkbox.value = chat.uuid;
// //       const label = document.createElement('label');
// //       label.textContent = chat.name || `Chat ${chat.uuid}`;
      
// //       chatItemDiv.appendChild(checkbox);
// //       chatItemDiv.appendChild(label);
// //       chatListElement.appendChild(chatItemDiv);
// //   });

// //   // Show the chat list container
// //   chatListContainer.style.display = 'block';
// // }

// function renderChatListForSelection(chatList) {
//   const chatListContainer = document.getElementById('chatListContainer');
//   const chatListElement = document.getElementById('chatList');

//   // Clear any existing chat items
//   chatListElement.innerHTML = '';

//   // Create Select All checkbox
//   const selectAllDiv = document.createElement('div');
//   selectAllDiv.className = 'chat-item';
//   const selectAllCheckbox = document.createElement('input');
//   selectAllCheckbox.type = 'checkbox';
//   selectAllCheckbox.id = 'selectAllCheckbox';
//   const selectAllLabel = document.createElement('label');
//   selectAllLabel.textContent = 'Select All';
  
//   selectAllDiv.appendChild(selectAllCheckbox);
//   selectAllDiv.appendChild(selectAllLabel);
//   chatListElement.appendChild(selectAllDiv);

//   // Add event listener for Select All functionality
//   selectAllCheckbox.addEventListener('change', (e) => {
//       const isChecked = e.target.checked;
//       const checkboxes = chatListElement.querySelectorAll('input[type="checkbox"]:not(#selectAllCheckbox)');
//       checkboxes.forEach(checkbox => {
//           checkbox.checked = isChecked;
//       });
//   });

//   // Create checkboxes for each chat item
//   chatList.forEach(chat => {
//       console.log('Rendering chat:', chat.name || `Chat ${chat.uuid}`);
      
//       const chatItemDiv = document.createElement('div');
//       chatItemDiv.className = 'chat-item';
//       const checkbox = document.createElement('input');
//       checkbox.type = 'checkbox';
//       checkbox.value = chat.uuid;
//       const label = document.createElement('label');
//       label.textContent = chat.name || `Chat ${chat.uuid}`;
      
//       chatItemDiv.appendChild(checkbox);
//       chatItemDiv.appendChild(label);
//       chatListElement.appendChild(chatItemDiv);
//   });

//   // Show the chat list container
//   chatListContainer.style.display = 'block';
// }


// // Function to download selected chats
// // function downloadSelectedChats() {
// //   const selectedChatIds = Array.from(document.querySelectorAll('#chatList input:checked'))
// //       .map(checkbox => checkbox.value);

// //   if (selectedChatIds.length === 0) {
// //       updateStatus('No chats selected for download.', 'error');
// //       return;
// //   }

// //   updateStatus('Downloading selected chats...');
  
// //   selectedChatIds.forEach(chatId => {
// //       const chatUrl = `https://claude.ai/chat/${chatId}`;
// //       chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: chatUrl });
// //   });

// //   updateStatus('Selected chats downloaded successfully!', 'success');
// // }

// // async function downloadSelectedChats() {
// //   const selectedChatIds = Array.from(document.querySelectorAll('#chatList input:checked:not(#selectAllCheckbox)'))
// //     .map(checkbox => checkbox.value);

// //   if (selectedChatIds.length === 0) {
// //     updateStatus('No chats selected for download.', 'error');
// //     return;
// //   }

// //   updateStatus('Downloading selected chats...');
  
// //   const zip = new JSZip();

// //   for (const chatId of selectedChatIds) {
// //     const chatUrl = `https://claude.ai/chat/${chatId}`;
// //     try {
// //       const chatData = await fetchChatData(chatUrl);
// //       const htmlContent = await generateHtmlContent(chatData, chatId);
// //       zip.file(`claude_chat_${chatId}.html`, htmlContent);
// //     } catch (error) {
// //       console.error(`Error downloading chat ${chatId}:`, error);
// //       updateStatus(`Error downloading chat ${chatId}`, 'error');
// //     }
// //   }

// //   try {
// //     const content = await zip.generateAsync({ type: "blob" });
// //     const url = URL.createObjectURL(content);
// //     const downloadId = await chrome.downloads.download({
// //       url: url,
// //       filename: "claude_chats.zip",
// //       saveAs: true
// //     });
// //     console.log('Download started:', downloadId);
// //     updateStatus('Selected chats downloaded successfully!', 'success');
// //   } catch (error) {
// //     console.error('Error creating zip file:', error);
// //     updateStatus('Failed to create zip file.', 'error');
// //   }
// // }

// // async function downloadSelectedChats() {
// //   const selectedChatIds = Array.from(document.querySelectorAll('#chatList input:checked:not(#selectAllCheckbox)'))
// //     .map(checkbox => checkbox.value);

// //   if (selectedChatIds.length === 0) {
// //     updateStatus('No chats selected for download.', 'error');
// //     return;
// //   }

// //   updateStatus('Downloading selected chats...');
  
// //   const zip = new JSZip();

// //   for (const chatId of selectedChatIds) {
// //     const chatUrl = `https://claude.ai/chat/${chatId}`;
// //     try {
// //       const chatData = await fetchChatData(chatUrl);
// //       const htmlContent = await generateHtmlContent(chatData, chatId);
// //       zip.file(`claude_chat_${chatId}.html`, htmlContent);
// //     } catch (error) {
// //       console.error(`Error downloading chat ${chatId}:`, error);
// //       updateStatus(`Error downloading chat ${chatId}`, 'error');
// //     }
// //   }

// //   try {
// //     const content = await zip.generateAsync({ type: "blob" });
// //     const url = URL.createObjectURL(content);
// //     chrome.downloads.download({
// //       url: url,
// //       filename: "claude_chats.zip",
// //       saveAs: true
// //     }, (downloadId) => {
// //       if (chrome.runtime.lastError) {
// //         console.error('Download failed:', chrome.runtime.lastError);
// //         updateStatus('Download failed', 'error');
// //       } else {
// //         console.log('Download started:', downloadId);
// //         updateStatus('Selected chats downloaded successfully!', 'success');
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Error creating zip file:', error);
// //     updateStatus('Failed to create zip file.', 'error');
// //   }
// // }


// // async function downloadSelectedChats() {
// //   const selectedChatIds = Array.from(document.querySelectorAll('#chatList input:checked:not(#selectAllCheckbox)'))
// //     .map(checkbox => ({ id: checkbox.value, url: `https://claude.ai/chat/${checkbox.value}` }));

// //   if (selectedChatIds.length === 0) {
// //     updateStatus('No chats selected for download.', 'error');
// //     return;
// //   }

// //   updateStatus('Downloading selected chats...');

// //   try {
// //     const result = await chrome.runtime.sendMessage({ 
// //       action: 'downloadSelectedChats', 
// //       chats: selectedChatIds 
// //     });

// //     if (result.success) {
// //       updateStatus('Selected chats downloaded successfully!', 'success');
// //     } else {
// //       updateStatus('Failed to download chats.', 'error');
// //     }
// //   } catch (error) {
// //     console.error('Error downloading chats:', error);
// //     updateStatus('Failed to download chats.', 'error');
// //   }
// // }

// // async function downloadSelectedChats() {
// //   const selectedChatIds = Array.from(document.querySelectorAll('#chatList input:checked:not(#selectAllCheckbox)'))
// //     .map(checkbox => ({ id: checkbox.value, url: `https://claude.ai/chat/${checkbox.value}` }));

// //   if (selectedChatIds.length === 0) {
// //     updateStatus('No chats selected for download.', 'error');
// //     return;
// //   }

// //   updateStatus('Downloading selected chats...');

// //   try {
// //     const result = await chrome.runtime.sendMessage({ 
// //       action: 'downloadSelectedChats', 
// //       chats: selectedChatIds 
// //     });

// //     if (result.success) {
// //       updateStatus('Selected chats downloaded successfully!', 'success');
// //     } else {
// //       updateStatus('Failed to download chats.', 'error');
// //     }
// //   } catch (error) {
// //     console.error('Error downloading chats:', error);
// //     updateStatus('Failed to download chats.', 'error');
// //   }
// // }

// async function downloadSelectedChats() {
//   const selectedChatIds = Array.from(document.querySelectorAll('#chatList input:checked:not(#selectAllCheckbox)'))
//     .map(checkbox => ({ id: checkbox.value, url: `https://claude.ai/chat/${checkbox.value}` }));

//   if (selectedChatIds.length === 0) {
//     updateStatus('No chats selected for download.', 'error');
//     return;
//   }

//   updateStatus('Downloading selected chats...');

//   try {
//     const result = await chrome.runtime.sendMessage({ 
//       action: 'downloadSelectedChats', 
//       chats: selectedChatIds 
//     });

//     if (result.success) {
//       updateStatus('Selected chats downloaded successfully!', 'success');
//     } else {
//       updateStatus('Failed to download chats.', 'error');
//     }
//   } catch (error) {
//     console.error('Error downloading chats:', error);
//     updateStatus('Failed to download chats.', 'error');
//   }
// }
// function fetchChatData(chatUrl) {
//   return new Promise((resolve, reject) => {
//     chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: chatUrl }, response => {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else if (response && response.success) {
//         resolve(response.data);
//       } else {
//         reject(new Error(response ? response.error : 'Unknown error'));
//       }
//     });
//   });
// }

// // async function generateHtmlContent(data, chatId) {
// //   return new Promise((resolve, reject) => {
// //     chrome.runtime.sendMessage({ 
// //       action: 'generateHtmlContent', 
// //       data: data, 
// //       chatId: chatId 
// //     }, response => {
// //       if (chrome.runtime.lastError) {
// //         reject(chrome.runtime.lastError);
// //       } else if (response && response.success) {
// //         resolve(response.htmlContent);
// //       } else {
// //         reject(new Error(response ? response.error : 'Unknown error'));
// //       }
// //     });
// //   });
// // }


document.addEventListener('DOMContentLoaded', () => { 
  document.getElementById('downloadCurrentTab').addEventListener('click', downloadCurrentTabChat);
  document.getElementById('downloadFromUrl').addEventListener('click', downloadChatFromUrl);
  document.getElementById('massDownload').addEventListener('click', massDownloadChats);
  document.getElementById('downloadSelectedChats').addEventListener('click', downloadSelectedChats);
});

function updateStatus(message, type = 'info') {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.className = type;
}

function downloadCurrentTabChat() {
  updateStatus('Fetching current tab URL...');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (chrome.runtime.lastError || !tabs[0]) {
      updateStatus('Unable to get current tab URL.', 'error');
      return;
    }
    const activeTabUrl = tabs[0].url;
    console.log('Active Tab URL:', activeTabUrl);
    if (isValidClaudeUrl(activeTabUrl)) {
      chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: activeTabUrl });
    } else {
      updateStatus('Current tab is not a valid Claude chat URL.', 'error');
    }
  });
}

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
  chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: chatUrl });
}

function isValidClaudeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === 'claude.ai' && parsedUrl.pathname.startsWith('/chat/');
  } catch (e) {
    return false;
  }
}

function massDownloadChats() {
    updateStatus('Fetching all available chats...');

    chrome.runtime.sendMessage({ action: 'fetchChats' }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
            console.error('Error in response:', chrome.runtime.lastError || 'Response not successful');
            updateStatus('Failed to retrieve chats.', 'error');
            return;
        }

        console.log('Chat list received:', response.chatList);

        const chatList = response.chatList;
        if (!chatList || chatList.length === 0) {
            console.error('No chats found or chat list is empty.');
            updateStatus('No chats found.', 'error');
            return;
        }

        renderChatListForSelection(chatList);
    });
}

function renderChatListForSelection(chatList) {
  const chatListContainer = document.getElementById('chatListContainer');
  const chatListElement = document.getElementById('chatList');

  chatListElement.innerHTML = '';

  const selectAllDiv = document.createElement('div');
  selectAllDiv.className = 'chat-item';
  const selectAllCheckbox = document.createElement('input');
  selectAllCheckbox.type = 'checkbox';
  selectAllCheckbox.id = 'selectAllCheckbox';
  const selectAllLabel = document.createElement('label');
  selectAllLabel.textContent = 'Select All';
  
  selectAllDiv.appendChild(selectAllCheckbox);
  selectAllDiv.appendChild(selectAllLabel);
  chatListElement.appendChild(selectAllDiv);

  selectAllCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      const checkboxes = chatListElement.querySelectorAll('input[type="checkbox"]:not(#selectAllCheckbox)');
      checkboxes.forEach(checkbox => {
          checkbox.checked = isChecked;
      });
  });

  chatList.forEach(chat => {
      console.log('Rendering chat:', chat.name || `Chat ${chat.uuid}`);
      
      const chatItemDiv = document.createElement('div');
      chatItemDiv.className = 'chat-item';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = chat.uuid;
      const label = document.createElement('label');
      label.textContent = chat.name || `Chat ${chat.uuid}`;
      
      chatItemDiv.appendChild(checkbox);
      chatItemDiv.appendChild(label);
      chatListElement.appendChild(chatItemDiv);
  });

  chatListContainer.style.display = 'block';
}

async function downloadSelectedChats() {
  const selectedChatIds = Array.from(document.querySelectorAll('#chatList input:checked:not(#selectAllCheckbox)'))
    .map(checkbox => ({ id: checkbox.value, url: `https://claude.ai/chat/${checkbox.value}` }));

  if (selectedChatIds.length === 0) {
    updateStatus('No chats selected for download.', 'error');
    return;
  }

  updateStatus('Downloading selected chats...');

  try {
    const result = await chrome.runtime.sendMessage({ 
      action: 'downloadSelectedChats', 
      chats: selectedChatIds 
    });

    if (result.success) {
      updateStatus('Selected chats downloaded successfully!', 'success');
    } else {
      updateStatus('Failed to download chats.', 'error');
    }
  } catch (error) {
    console.error('Error downloading chats:', error);
    updateStatus('Failed to download chats.', 'error');
  }
}

function fetchChatData(chatUrl) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'downloadChat', chatUrl: chatUrl }, response => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else if (response && response.success) {
        resolve(response.data);
      } else {
        reject(new Error(response ? response.error : 'Unknown error'));
      }
    });
  });
}