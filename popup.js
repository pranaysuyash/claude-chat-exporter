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
  const chatListContainer = document.getElementById('chatListContainer');
  const downloadButton = document.getElementById('downloadSelectedChats');

  chatListContainer.style.display = 'block';
  downloadButton.style.display = 'block';

  updateStatus('Fetching all available chats...');

  chrome.runtime.sendMessage({ action: 'fetchChats' }, (response) => {
      if (chrome.runtime.lastError || !response || !response.success) {
          updateStatus('Failed to retrieve chats.', 'error');
          return;
      }

      const chatList = response.chatList;
      if (!chatList || chatList.length === 0) {
          updateStatus('No chats found.', 'error');
          return;
      }

      renderChatListForSelection(chatList);
  });
}

function renderChatListForSelection(chatList) {
  const chatListElement = document.getElementById('chatList');
  chatListElement.innerHTML = '';

  const selectAllDiv = document.createElement('div');
  selectAllDiv.className = 'chat-item';
  const selectAllCheckbox = document.createElement('input');
  selectAllCheckbox.type = 'checkbox';
  selectAllCheckbox.id = 'selectAllCheckbox';
  const selectAllLabel = document.createElement('label');
  selectAllLabel.textContent = 'Select All';
  selectAllLabel.setAttribute('for', 'selectAllCheckbox');
  
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
      const chatItemDiv = document.createElement('div');
      chatItemDiv.className = 'chat-item';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `chat-${chat.uuid}`;
      checkbox.value = chat.uuid;
      const label = document.createElement('label');
      label.textContent = chat.name || `Chat ${chat.uuid}`;
      label.setAttribute('for', `chat-${chat.uuid}`);
      
      chatItemDiv.appendChild(checkbox);
      chatItemDiv.appendChild(label);
      chatListElement.appendChild(chatItemDiv);
  });
}

async function downloadSelectedChats() {
  const selectedChatIds = Array.from(document.querySelectorAll('#chatList input:checked:not(#selectAllCheckbox)'))
      .map(checkbox => ({ id: checkbox.value, url: `https://claude.ai/chat/${checkbox.value}` }));

  if (selectedChatIds.length === 0) {
      updateStatus('No chats selected for download.', 'error');
      return;
  }

  updateStatus(`Downloading ${selectedChatIds.length} selected chats...`);

  try {
      const result = await chrome.runtime.sendMessage({ 
          action: 'downloadSelectedChats', 
          chats: selectedChatIds 
      });

      if (result.success) {
          updateStatus(`${selectedChatIds.length} chats downloaded successfully!`, 'success');
      } else {
          updateStatus('Failed to download chats.', 'error');
      }
  } catch (error) {
      console.error('Error downloading chats:', error);
      updateStatus('Failed to download chats.', 'error');
  }
}