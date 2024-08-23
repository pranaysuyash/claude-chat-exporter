chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadChat') {
      downloadChat(request.chatUrl);
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
        return data[0].uuid; // Assuming the first organization is the correct one
      } else {
        throw new Error('No organizations found');
      }
    } catch (error) {
      console.error('Error fetching organization ID:', error);
      return null;
    }
  }
// Function to download the chat data and initiate the download
async function downloadChat(chatUrl) {
    const url = new URL(chatUrl);
    const chatId = url.pathname.split('/').pop();
    console.log('Extracted Chat ID:', chatId);
  
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      // Handle the error (e.g., show an error message in the popup)
      console.error('Failed to retrieve organization ID.');
      return;
    }
  
    const apiUrl = `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`;
  
    try {
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
  
      const htmlContent = generateHtmlContent(data);
  
      // Use chrome.downloads.download() with a data URL
      chrome.downloads.download({
        url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
        filename: `claude_chat_${chatId}.html`,
        saveAs: true
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error('Download failed:', chrome.runtime.lastError.message);
        } else {
          console.log('Download started:', downloadId);
        }
      });
  
    } catch (error) {
      console.error('Error:', error);
    }
  }
  function generateHtmlContent(data) {
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
          </style>
      </head>
      <body>
          <h1>${data.name}</h1>
      `;
  
    data.chat_messages.forEach(msg => {
      const className = msg.sender === 'human' ? 'human' : 'assistant';
      const messageTime = new Date(msg.created_at).toLocaleString();
      html += `
          <div class="message ${className}">
              <div class="message-header">${msg.sender === 'human' ? 'You' : 'Claude'} <span class="message-time">${messageTime}</span></div>
              <div class="message-content">${formatMessageText(msg.text)}</div>
          </div>
          `;
    });
  
    html += `
      </body>
      </html>
      `;
  
    return html;
  }
  
  function formatMessageText(text) {
    // Escape HTML characters (corrected)
    // const escapedText = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
    // Convert markdown code blocks to <pre> tags
    const formattedText = escapedText.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
  
    return formattedText.replace(/\n/g, '<br>');
  }
  
//   function initiateDownload(content, filename) {
//     console.log('initiateDownload called'); 
//     console.log('Content:', content); 
//     console.log('Filename:', filename);
//     const blob = new Blob([content], { type: 'text/html' });
//     const url = URL.createObjectURL(blob);
  
//     chrome.downloads.download({
//       url: url,
//       filename: filename,
//       saveAs: true
//     }, (downloadId) => {
//       if (chrome.runtime.lastError) {
//         console.error('Download failed:', chrome.runtime.lastError.message);
//       } else {
//         console.log('Download started:', downloadId);
//       }
//       URL.revokeObjectURL(url);
//     });
//   }