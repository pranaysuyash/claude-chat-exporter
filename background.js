importScripts('jszip.min.js');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadChat') {
    downloadChat(request.chatUrl)
      .then((result) => {
        sendResponse(result);
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  } else if (request.action === 'fetchChats') {
    fetchChats()
      .then((chatList) => {
        sendResponse({ success: true, chatList: chatList });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  } else if (request.action === 'downloadSelectedChats') {
    downloadSelectedChats(request.chats)
      .then((result) => {
        sendResponse(result);
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

async function getOrganizationId() {
  try {
    const response = await fetch('https://api.claude.ai/api/organizations', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch organization ID. Status: ${response.status}`);
    }

    const data = await response.json();
    if (data.length > 0) {
      return data[0].uuid;
    } else {
      throw new Error('No organizations found');
    }
  } catch (error) {
    console.error('Error fetching organization ID:', error);
    throw error;
  }
}

async function fetchChats() {
  const organizationId = await getOrganizationId();
  const response = await fetch(
    `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch chat list: ${response.status}`);
  }

  return response.json();
}

async function downloadChat(chatUrl) {
  try {
      const url = new URL(chatUrl);
      const chatId = url.pathname.split('/').pop();
      console.log('Extracted Chat ID:', chatId);

      const organizationId = await getOrganizationId();
      if (!organizationId) {
          throw new Error('Failed to retrieve organization ID.');
      }

      const apiUrl = `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`;

      const response = await fetch(apiUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`Failed to fetch chat data. Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Chat Data:', data);

      const htmlContent = await generateHtmlContentWithImages(data, chatId, organizationId);

      chrome.downloads.download({
          url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
          filename: `claude_chat_${chatId}.html`,
          saveAs: true,
      });
  } catch (error) {
      console.error('Error during chat download:', error);
  }
}

async function downloadSelectedChats(chats) {
  const zip = new JSZip();

  for (const chat of chats) {
    try {
      const result = await downloadChat(chat.url);
      if (result.success) {
        zip.file(`claude_chat_${result.chatId}.html`, result.htmlContent);
      } else {
        console.error(`Failed to download chat ${chat.id}:`, result.error);
      }
    } catch (error) {
      console.error(`Error downloading chat ${chat.id}:`, error);
    }
  }

  try {
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);

    return new Promise((resolve) => {
      chrome.downloads.download(
        {
          url: url,
          filename: 'claude_chats.zip',
          saveAs: true,
        },
        (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error('Download failed:', chrome.runtime.lastError);
            resolve({ success: false, error: chrome.runtime.lastError.message });
          } else {
            console.log('Download started:', downloadId);
            resolve({ success: true, downloadId });
          }
        }
      );
    });
  } catch (error) {
    console.error('Error creating zip file:', error);
    return { success: false, error: error.message };
  }
}

async function generateHtmlContentWithImages(data, chatId, organizationId) {
  let html = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>${data.name}</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f4f4; }
              h1 { text-align: center; color: #333; }
              .message { margin-bottom: 20px; padding: 15px; border-radius: 5px; }
              .human { background-color: #e9f7ef; border-left: 5px solid #2ecc71; }
              .assistant { background-color: #e8f0fe; border-left: 5px solid #3498db; }
              .message-header { font-weight: bold; margin-bottom: 10px; }
              .message-time { font-size: 12px; color: #888; }
              pre { white-space: pre-wrap; word-wrap: break-word; background-color: #f0f0f0; padding: 10px; border-radius: 4px; overflow: auto; }
              img { max-width: 100%; height: auto; display: block; margin: 10px 0; }
              a.file-link { display: block; margin: 10px 0; color: #007BFF; text-decoration: none; }
              .attachment { margin-top: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 4px; }
              .attachment-header { font-weight: bold; margin-bottom: 5px; }
              .html-content { border: 1px solid #ddd; padding: 10px; margin-top: 5px; }
          </style>
      </head>
      <body>
          <h1>${data.name}</h1>
  `;

  for (const msg of data.chat_messages) {
      const className = msg.sender === 'human' ? 'human' : 'assistant';
      const messageTime = new Date(msg.created_at).toLocaleString();
      let messageContent = formatMessageText(msg.text);

      // Handling attachments
      if (msg.attachments && msg.attachments.length > 0) {
          for (const attachment of msg.attachments) {
              messageContent += `<div class="attachment">`;
              messageContent += `<div class="attachment-header">${attachment.file_name}</div>`;
              
              if (['txt', 'html', 'htm', 'email'].includes(attachment.file_type) && attachment.extracted_content) {
                  if (attachment.file_type === 'txt') {
                      messageContent += `<pre>${escapeHtml(attachment.extracted_content)}</pre>`;
                  } else {
                      messageContent += `<div class="html-content">${attachment.extracted_content}</div>`;
                  }
              } else if (attachment.file_type === 'js') {
                  messageContent += `<a href="#" class="file-link" onclick="alert('JavaScript file download not implemented in this view.')">Download ${attachment.file_name}</a>`;
              } else {
                  messageContent += `<pre>${escapeHtml(attachment.extracted_content || 'Content not available')}</pre>`;
              }
              
              messageContent += `</div>`;
          }
      }

      // Handling files (mainly images)
      if (msg.files && msg.files.length > 0) {
          for (const file of msg.files) {
              const thumbnailUrl = `https://claude.ai${file.thumbnail_url}`;
              const previewUrl = `https://claude.ai${file.preview_url}`;

              messageContent += `
                  <div class="attachment">
                      <div class="attachment-header">${file.file_name}</div>
                      <img src="${thumbnailUrl}" alt="${file.file_name}">
                      <a href="${previewUrl}" download="${file.file_name}" class="file-link">Download ${file.file_name}</a>
                  </div>
              `;
          }
      }

      html += `
          <div class="message ${className}">
              <div class="message-header">${msg.sender === 'human' ? 'You' : 'Claude'} <span class="message-time">${messageTime}</span></div>
              <div class="message-content">${messageContent}</div>
          </div>
      `;
  }

  html += `
      </body>
      </html>
  `;

  return html;
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function formatMessageText(text) {
  const escapedText = escapeHtml(text);
  const formattedText = escapedText.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
  return formattedText.replace(/\n/g, '<br>');
}
async function fetchImageWithReferer(fileId, chatId, organizationId) {
  try {
      const imageUrl = `https://claude.ai/api/organizations/${organizationId}/files/${fileId}/download`;

      const response = await fetch(imageUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
              Referer: `https://claude.ai/chat/${chatId}`,
              'Sec-CH-UA': 'Chromium;v="128", Not;A=Brand;v="24", Google Chrome;v="128"',
              'Sec-CH-UA-Mobile': '?0',
              'Sec-CH-UA-Platform': 'macOS',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          },
      });

      if (!response.ok) {
          console.error('Failed to fetch image:', response.status);
          return '';
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      console.log('Fetched image URL:', objectUrl);
      return objectUrl;
  } catch (error) {
      console.error('Error fetching image:', error);
      return '';
  }
}

function formatMessageText(text) {
  const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const formattedText = escapedText.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
  return formattedText.replace(/\n/g, '<br>');
}


async function fetchImageAsBlobUrl(fileId, chatId, organizationId) {
  try {
      const imageUrl = `https://claude.ai/api/organizations/${organizationId}/files/${fileId}/download`;

      const response = await fetch(imageUrl, {
          method: 'GET',
          credentials: 'include',
          headers: {
              Referer: `https://claude.ai/chat/${chatId}`,
              'Sec-CH-UA': 'Chromium;v="128", Not;A=Brand;v="24", Google Chrome;v="128"',
              'Sec-CH-UA-Mobile': '?0',
              'Sec-CH-UA-Platform': 'macOS',
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          },
      });

      if (!response.ok) {
          console.error('Failed to fetch image:', response.status);
          return '';
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      console.log('Fetched image Blob URL:', blobUrl);
      return blobUrl;
  } catch (error) {
      console.error('Error fetching image:', error);
      return '';
  }
}
