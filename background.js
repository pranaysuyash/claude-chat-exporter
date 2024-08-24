// // // // // background.js

// // // // chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
// // // //   if (request.action === 'downloadChat') {
// // // //     try {
// // // //       await downloadChat(request.chatUrl);
// // // //       sendResponse({ success: true });
// // // //     } catch (error) {
// // // //       console.error('Error during chat download:', error);
// // // //       sendResponse({ success: false, error: error.message });
// // // //     }
// // // //   } else if (request.action === 'fetchChats') {
// // // //     try {
// // // //       const organizationId = await getOrganizationId();
// // // //       console.log('Organization ID:', organizationId);

// // // //       if (!organizationId) {
// // // //         console.error('Organization ID retrieval failed.');
// // // //         sendResponse({ success: false });
// // // //         return;
// // // //       }

// // // //       console.log('Fetching chat list...');
// // // //       const response = await fetch(
// // // //         `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations`,
// // // //         {
// // // //           method: 'GET',
// // // //           credentials: 'include',
// // // //           headers: {
// // // //             'Content-Type': 'application/json',
// // // //           },
// // // //         }
// // // //       );

// // // //       if (!response.ok) {
// // // //         console.error('Failed to fetch chat list:', response.status);
// // // //         sendResponse({ success: false });
// // // //         return;
// // // //       }

// // // //       const chatList = await response.json();
// // // //       console.log('Chat list retrieved:', chatList);
// // // //       sendResponse({ success: true, chatList: chatList });
// // // //     } catch (error) {
// // // //       console.error('Error fetching chats:', error);
// // // //       sendResponse({ success: false, error: error.message });
// // // //     }
// // // //   }
// // // //   return true; // Keeps the message channel open for async responses
// // // // });

// // // // async function getOrganizationId() {
// // // //   try {
// // // //     const response = await fetch('https://api.claude.ai/api/organizations', {
// // // //       method: 'GET',
// // // //       credentials: 'include',
// // // //       headers: {
// // // //         'Content-Type': 'application/json',
// // // //       },
// // // //     });

// // // //     if (!response.ok) {
// // // //       throw new Error(`Failed to fetch organization ID. Status: ${response.status}`);
// // // //     }

// // // //     const data = await response.json();
// // // //     if (data.length > 0) {
// // // //       return data[0].uuid; // Assuming the first organization is the correct one
// // // //     } else {
// // // //       throw new Error('No organizations found');
// // // //     }
// // // //   } catch (error) {
// // // //     console.error('Error fetching organization ID:', error);
// // // //     return null; // Ensuring the function always returns a value
// // // //   }
// // // // }

// // // // async function downloadChat(chatUrl) {
// // // //   try {
// // // //     const url = new URL(chatUrl);
// // // //     const chatId = url.pathname.split('/').pop();
// // // //     console.log('Extracted Chat ID:', chatId);

// // // //     const organizationId = await getOrganizationId();
// // // //     if (!organizationId) {
// // // //       console.error('Failed to retrieve organization ID.');
// // // //       return;
// // // //     }

// // // //     const apiUrl = `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`;

// // // //     const response = await fetch(apiUrl, {
// // // //       method: 'GET',
// // // //       credentials: 'include',
// // // //       headers: {
// // // //         'Content-Type': 'application/json',
// // // //       },
// // // //     });

// // // //     if (!response.ok) {
// // // //       throw new Error(`Failed to fetch chat data. Status: ${response.status}`);
// // // //     }

// // // //     const data = await response.json();
// // // //     console.log('Chat Data:', data);

// // // //     const htmlContent = await generateHtmlContentWithImages(data, chatId);

// // // //     chrome.downloads.download(
// // // //       {
// // // //         url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
// // // //         filename: `claude_chat_${chatId}.html`,
// // // //         saveAs: true,
// // // //       },
// // // //       (downloadId) => {
// // // //         if (chrome.runtime.lastError) {
// // // //           console.error('Download failed:', chrome.runtime.lastError.message);
// // // //         } else {
// // // //           console.log('Download started:', downloadId);
// // // //         }
// // // //       }
// // // //     );
// // // //   } catch (error) {
// // // //     console.error('Error during chat download:', error);
// // // //   }
// // // // }

// // // // async function generateHtmlContentWithImages(data, chatId) {
// // // //   let html = `
// // // //       <!DOCTYPE html>
// // // //       <html>
// // // //       <head>
// // // //           <meta charset="UTF-8">
// // // //           <title>${data.name}</title>
// // // //           <style>
// // // //               body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f4f4; }
// // // //               h1 { text-align: center; color: #333; }
// // // //               .message { margin-bottom: 20px; padding: 15px; border-radius: 5px; }
// // // //               .human { background-color: #e9f7ef; border-left: 5px solid #2ecc71; }
// // // //               .assistant { background-color: #e8f0fe; border-left: 5px solid #3498db; }
// // // //               .message-header { font-weight: bold; margin-bottom: 10px; }
// // // //               .message-time { font-size: 12px; color: #888; }
// // // //               pre { white-space: pre-wrap; word-wrap: break-word; background-color: #f0f0f0; padding: 10px; border-radius: 4px; overflow: auto; }
// // // //               img { max-width: 100%; height: auto; display: block; margin: 10px 0; }
// // // //               a.file-link { display: block; margin: 10px 0; color: #007BFF; text-decoration: none; }
// // // //           </style>
// // // //       </head>
// // // //       <body>
// // // //           <h1>${data.name}</h1>
// // // //   `;

// // // //   for (const msg of data.chat_messages) {
// // // //     const className = msg.sender === 'human' ? 'human' : 'assistant';
// // // //     const messageTime = new Date(msg.created_at).toLocaleString();
// // // //     let messageContent = formatMessageText(msg.text);

// // // //     if (msg.attachments && msg.attachments.length > 0) {
// // // //       for (const attachment of msg.attachments) {
// // // //         const attachmentUrl = `https://claude.ai/api/{organizationId}/files/${attachment.id}/preview`;
// // // //         if (attachment.file_type && attachment.file_type.startsWith('image/')) {
// // // //           const imageUrl = await fetchImageWithReferer(attachment.id, chatId);
// // // //           messageContent += `<img src="${imageUrl}" alt="Image">`;
// // // //         } else {
// // // //           messageContent += `<a href="${attachmentUrl}" class="file-link" target="_blank">Download ${attachment.file_name}</a>`;
// // // //         }
// // // //       }
// // // //     }

// // // //     // Assuming 'files' are also attachments
// // // //     if (msg.files && msg.files.length > 0) {
// // // //       for (const file of msg.files) {
// // // //         const fileUrl = `https://claude.ai/api/{organizationId}/files/${file.id}/preview`;
// // // //         if (file.file_type && file.file_type.startsWith('image/')) {
// // // //           const imageUrl = await fetchImageWithReferer(file.id, chatId);
// // // //           messageContent += `<img src="${imageUrl}" alt="Image">`;
// // // //         } else {
// // // //           messageContent += `<a href="${fileUrl}" class="file-link" target="_blank">Download ${file.file_name}</a>`;
// // // //         }
// // // //       }
// // // //     }

// // // //     html += `
// // // //           <div class="message ${className}">
// // // //               <div class="message-header">${
// // // //                 msg.sender === 'human' ? 'You' : 'Claude'
// // // //               } <span class="message-time">${messageTime}</span></div>
// // // //               <div class="message-content">${messageContent}</div>
// // // //           </div>
// // // //       `;
// // // //   }

// // // //   html += `
// // // //       </body>
// // // //       </html>
// // // //   `;

// // // //   return html;
// // // // }

// // // // async function fetchImageWithReferer(fileId, chatId) {
// // // //   try {
// // // //     const organizationId = await getOrganizationId();
// // // //     if (!organizationId) {
// // // //       console.error('Failed to retrieve organization ID for image fetching.');
// // // //       return '';
// // // //     }

// // // //     const imageUrl = `https://claude.ai/api/organizations/${organizationId}/files/${fileId}/download`;

// // // //     const response = await fetch(imageUrl, {
// // // //       method: 'GET',
// // // //       credentials: 'include',
// // // //       headers: {
// // // //         Referer: `https://claude.ai/chat/${chatId}`,
// // // //         'Sec-CH-UA':
// // // //           'Chromium;v="128", Not;A=Brand;v="24", Google Chrome;v="128"',
// // // //         'Sec-CH-UA-Mobile': '?0',
// // // //         'Sec-CH-UA-Platform': 'macOS',
// // // //         'User-Agent':
// // // //           'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
// // // //       },
// // // //     });

// // // //     if (!response.ok) {
// // // //       console.error('Failed to fetch image:', response.status);
// // // //       return '';
// // // //     }

// // // //     const blob = await response.blob();
// // // //     const objectUrl = URL.createObjectURL(blob);
// // // //     console.log('Fetched image URL:', objectUrl);
// // // //     return objectUrl;
// // // //   } catch (error) {
// // // //     console.error('Error fetching image:', error);
// // // //     return '';
// // // //   }
// // // // }

// // // // function formatMessageText(text) {
// // // //   const escapedText = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
// // // //   const formattedText = escapedText.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
// // // //   return formattedText.replace(/\n/g, '<br>');
// // // // }

// // // // background.js

// // // chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
// // //   if (request.action === 'downloadChat') {
// // //     try {
// // //       await downloadChat(request.chatUrl);
// // //       sendResponse({ success: true });
// // //     } catch (error) {
// // //       console.error('Error during chat download:', error);
// // //       sendResponse({ success: false, error: error.message });
// // //     }
// // //   } else if (request.action === 'fetchChats') {
// // //     try {
// // //       const organizationId = await getOrganizationId();
// // //       console.log('Organization ID:', organizationId);

// // //       if (!organizationId) {
// // //         console.error('Organization ID retrieval failed.');
// // //         sendResponse({ success: false });
// // //         return;
// // //       }

// // //       console.log('Fetching chat list...');
// // //       const response = await fetch(
// // //         `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations`,
// // //         {
// // //           method: 'GET',
// // //           credentials: 'include',
// // //           headers: {
// // //             'Content-Type': 'application/json',
// // //           },
// // //         }
// // //       );

// // //       if (!response.ok) {
// // //         console.error('Failed to fetch chat list:', response.status);
// // //         sendResponse({ success: false });
// // //         return;
// // //       }

// // //       const chatList = await response.json();
// // //       console.log('Chat list retrieved:', chatList);
// // //       sendResponse({ success: true, chatList: chatList });
// // //     } catch (error) {
// // //       console.error('Error fetching chats:', error);
// // //       sendResponse({ success: false, error: error.message });
// // //     }
// // //   }
// // //   return true; // Keeps the message channel open for async responses
// // // });

// // // async function getOrganizationId() {
// // //   try {
// // //     const response = await fetch('https://api.claude.ai/api/organizations', {
// // //       method: 'GET',
// // //       credentials: 'include',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //       },
// // //     });

// // //     if (!response.ok) {
// // //       throw new Error(`Failed to fetch organization ID. Status: ${response.status}`);
// // //     }

// // //     const data = await response.json();
// // //     if (data.length > 0) {
// // //       return data[0].uuid; // Assuming the first organization is the correct one
// // //     } else {
// // //       throw new Error('No organizations found');
// // //     }
// // //   } catch (error) {
// // //     console.error('Error fetching organization ID:', error);
// // //     return null; // Ensuring the function always returns a value
// // //   }
// // // }

// // // async function downloadChat(chatUrl) {
// // //   try {
// // //     const url = new URL(chatUrl);
// // //     const chatId = url.pathname.split('/').pop();
// // //     console.log('Extracted Chat ID:', chatId);

// // //     const organizationId = await getOrganizationId();
// // //     if (!organizationId) {
// // //       console.error('Failed to retrieve organization ID.');
// // //       return;
// // //     }

// // //     const apiUrl = `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`;

// // //     const response = await fetch(apiUrl, {
// // //       method: 'GET',
// // //       credentials: 'include',
// // //       headers: {
// // //         'Content-Type': 'application/json',
// // //       },
// // //     });

// // //     if (!response.ok) {
// // //       throw new Error(`Failed to fetch chat data. Status: ${response.status}`);
// // //     }

// // //     const data = await response.json();
// // //     console.log('Chat Data:', data);

// // //     const htmlContent = await generateHtmlContentWithImages(data, chatId, organizationId); // Pass organizationId

// // //     chrome.downloads.download(
// // //       {
// // //         url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
// // //         filename: `claude_chat_${chatId}.html`,
// // //         saveAs: true,
// // //       },
// // //       (downloadId) => {
// // //         if (chrome.runtime.lastError) {
// // //           console.error('Download failed:', chrome.runtime.lastError.message);
// // //         } else {
// // //           console.log('Download started:', downloadId);
// // //         }
// // //       }
// // //     );
// // //   } catch (error) {
// // //     console.error('Error during chat download:', error);
// // //   }
// // // }

// // // async function generateHtmlContentWithImages(data, chatId, organizationId) { // Receive organizationId
// // //   let html = `
// // //       <!DOCTYPE html>
// // //       <html>
// // //       <head>
// // //           <meta charset="UTF-8">
// // //           <title>${data.name}</title>
// // //           <style>
// // //               body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f4f4; }
// // //               h1 { text-align: center; color: #333; }
// // //               .message { margin-bottom: 20px; padding: 15px; border-radius: 5px; }
// // //               .human { background-color: #e9f7ef; border-left: 5px solid #2ecc71; }
// // //               .assistant { background-color: #e8f0fe; border-left: 5px solid #3498db; }
// // //               .message-header { font-weight: bold; margin-bottom: 10px; }
// // //               .message-time { font-size: 12px; color: #888; }
// // //               pre { white-space: pre-wrap; word-wrap: break-word; background-color: #f0f0f0; padding: 10px; border-radius: 4px; overflow: auto; }
// // //               img { max-width: 100%; height: auto; display: block; margin: 10px 0; }
// // //               a.file-link { display: block; margin: 10px 0; color: #007BFF; text-decoration: none; }
// // //           </style>
// // //       </head>
// // //       <body>
// // //           <h1>${data.name}</h1>
// // //   `;

// // //   // You already have organizationId here

// // //   for (const msg of data.chat_messages) {
// // //     const className = msg.sender === 'human' ? 'human' : 'assistant';
// // //     const messageTime = new Date(msg.created_at).toLocaleString();
// // //     let messageContent = formatMessageText(msg.text);

// // //     if (msg.attachments && msg.attachments.length > 0) {
// // //       for (const attachment of msg.attachments) {
// // //         const attachmentUrl = `https://claude.ai/api/${organizationId}/files/${attachment.id}/preview`;

// // //         if (attachment.file_type && attachment.file_type.startsWith('image/')) {
// // //           const imageUrl = await fetchImageWithReferer(attachment.id, chatId);
// // //           messageContent += `<img src="${imageUrl}" alt="Image">`;
// // //         } else {
// // //           messageContent += `<a href="${attachmentUrl}" class="file-link" target="_blank">Download ${attachment.file_name}</a>`;
// // //         }
// // //       }
// // //     }

// // //     if (msg.files && msg.files.length > 0) {
// // //       for (const file of msg.files) {
// // //         const fileUrl = `https://claude.ai/api/${organizationId}/files/${file.id}/preview`;
// // //         if (file.file_type && file.file_type.startsWith('image/')) {
// // //           const imageUrl = await fetchImageWithReferer(file.id, chatId);
// // //           messageContent += `<img src="${imageUrl}" alt="Image">`;
// // //         } else {
// // //           messageContent += `<a href="${fileUrl}" class="file-link" target="_blank">Download ${file.file_name}</a>`;
// // //         }
// // //       }
// // //     }

// // //     html += `
// // //           <div class="message ${className}">
// // //               <div class="message-header">${
// // //                 msg.sender === 'human' ? 'You' : 'Claude'
// // //               } <span class="message-time">${messageTime}</span></div>
// // //               <div class="message-content">${messageContent}</div>
// // //           </div>
// // //       `;
// // //   }

// // //   html += `
// // //       </body>
// // //       </html>
// // //   `;

// // //   return html;
// // // }

// // // async function fetchImageWithReferer(fileId, chatId) {
// // //   try {
// // //     const organizationId = await getOrganizationId();
// // //     if (!organizationId) {
// // //       console.error('Failed to retrieve organization ID for image fetching.');
// // //       return '';
// // //     }

// // //     const imageUrl = `https://claude.ai/api/organizations/${organizationId}/files/${fileId}/download`;

// // //     const response = await fetch(imageUrl, {
// // //       method: 'GET',
// // //       credentials: 'include',
// // //       headers: {
// // //         Referer: `https://claude.ai/chat/${chatId}`,
// // //         'Sec-CH-UA':
// // //           'Chromium;v="128", Not;A=Brand;v="24", Google Chrome;v="128"',
// // //         'Sec-CH-UA-Mobile': '?0',
// // //         'Sec-CH-UA-Platform': 'macOS',
// // //         'User-Agent':
// // //           'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
// // //       },
// // //     });

// // //     if (!response.ok) {
// // //       console.error('Failed to fetch image:', response.status);
// // //       return '';
// // //     }

// // //     const blob = await response.blob();
// // //     const objectUrl = URL.createObjectURL(blob);
// // //     console.log('Fetched image URL:', objectUrl);
// // //     return objectUrl;
// // //   } catch (error) {
// // //     console.error('Error fetching image:', error);
// // //     return '';
// // //   }
// // // }

// // // function formatMessageText(text) {
// // //   const escapedText = text.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
// // //   const formattedText = escapedText.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
// // //   return formattedText.replace(/\n/g, '<br>');
// // // }

// // // background.js

// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //   if (request.action === 'downloadChat') {
// //     downloadChat(request.chatUrl).then(data => {
// //       sendResponse({ success: true, data: data });
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   } else if (request.action === 'fetchChats') {
// //     fetchChats().then(chatList => {
// //       sendResponse({ success: true, chatList: chatList });
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   }
// // });

// // async function getOrganizationId() {
// //   try {
// //     const response = await fetch('https://api.claude.ai/api/organizations', {
// //       method: 'GET',
// //       credentials: 'include',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //     });

// //     if (!response.ok) {
// //       throw new Error(`Failed to fetch organization ID. Status: ${response.status}`);
// //     }

// //     const data = await response.json();
// //     if (data.length > 0) {
// //       return data[0].uuid;
// //     } else {
// //       throw new Error('No organizations found');
// //     }
// //   } catch (error) {
// //     console.error('Error fetching organization ID:', error);
// //     return null;
// //   }
// // }

// // async function fetchChats() {
// //   const organizationId = await getOrganizationId();
// //   if (!organizationId) {
// //     throw new Error('Failed to retrieve organization ID.');
// //   }

// //   const response = await fetch(
// //     `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations`,
// //     {
// //       method: 'GET',
// //       credentials: 'include',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //     }
// //   );

// //   if (!response.ok) {
// //     throw new Error(`Failed to fetch chat list: ${response.status}`);
// //   }

// //   return response.json();
// // }

// // async function downloadChat(chatUrl) {
// //   try {
// //     const url = new URL(chatUrl);
// //     const chatId = url.pathname.split('/').pop();
// //     console.log('Extracted Chat ID:', chatId);

// //     const organizationId = await getOrganizationId();
// //     if (!organizationId) {
// //       throw new Error('Failed to retrieve organization ID.');
// //     }

// //     const apiUrl = `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`;

// //     const response = await fetch(apiUrl, {
// //       method: 'GET',
// //       credentials: 'include',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //     });

// //     if (!response.ok) {
// //       throw new Error(`Failed to fetch chat data. Status: ${response.status}`);
// //     }

// //     const data = await response.json();
// //     console.log('Chat Data:', data);

// //     return data;
// //   } catch (error) {
// //     console.error('Error during chat download:', error);
// //     throw error;
// //   }
// // }

// // async function generateHtmlContentWithImages(data, chatId) {
// //   let html = `
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
// //             img { max-width: 100%; height: auto; display: block; margin: 10px 0; }
// //             a.file-link { display: block; margin: 10px 0; color: #007BFF; text-decoration: none; }
// //         </style>
// //     </head>
// //     <body>
// //         <h1>${data.name}</h1>
// //   `;

// //   for (const msg of data.chat_messages) {
// //     const className = msg.sender === 'human' ? 'human' : 'assistant';
// //     const messageTime = new Date(msg.created_at).toLocaleString();
// //     let messageContent = formatMessageText(msg.text);

// //     if (msg.attachments && msg.attachments.length > 0) {
// //       for (const attachment of msg.attachments) {
// //         const attachmentUrl = `https://claude.ai/api/{organizationId}/files/${attachment.id}/preview`;
// //         if (attachment.file_type && attachment.file_type.startsWith('image/')) {
// //           const imageUrl = await fetchImageWithReferer(attachment.id, chatId);
// //           messageContent += `<img src="${imageUrl}" alt="Image">`;
// //         } else {
// //           messageContent += `<a href="${attachmentUrl}" class="file-link" target="_blank">Download ${attachment.file_name}</a>`;
// //         }
// //       }
// //     }

// //     html += `
// //         <div class="message ${className}">
// //             <div class="message-header">${
// //               msg.sender === 'human' ? 'You' : 'Claude'
// //             } <span class="message-time">${messageTime}</span></div>
// //             <div class="message-content">${messageContent}</div>
// //         </div>
// //     `;
// //   }

// //   html += `
// //     </body>
// //     </html>
// //   `;

// //   return html;
// // }

// // function formatMessageText(text) {
// //   const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// //   const formattedText = escapedText.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
// //   return formattedText.replace(/\n/g, '<br>');
// // }

// // async function fetchImageWithReferer(fileId, chatId) {
// //   try {
// //     const organizationId = await getOrganizationId();
// //     if (!organizationId) {
// //       console.error('Failed to retrieve organization ID for image fetching.');
// //       return '';
// //     }

// //     const imageUrl = `https://claude.ai/api/organizations/${organizationId}/files/${fileId}/download`;

// //     const response = await fetch(imageUrl, {
// //       method: 'GET',
// //       credentials: 'include',
// //       headers: {
// //         Referer: `https://claude.ai/chat/${chatId}`,
// //         'Sec-CH-UA': 'Chromium;v="128", Not;A=Brand;v="24", Google Chrome;v="128"',
// //         'Sec-CH-UA-Mobile': '?0',
// //         'Sec-CH-UA-Platform': 'macOS',
// //         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
// //       },
// //     });

// //     if (!response.ok) {
// //       console.error('Failed to fetch image:', response.status);
// //       return '';
// //     }

// //     const blob = await response.blob();
// //     const objectUrl = URL.createObjectURL(blob);
// //     console.log('Fetched image URL:', objectUrl);
// //     return objectUrl;
// //   } catch (error) {
// //     console.error('Error fetching image:', error);
// //     return '';
// //   }
// // }

// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //   if (request.action === 'downloadChat') {
// //     downloadChat(request.chatUrl).then(data => {
// //       sendResponse({ success: true, data: data });
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   } else if (request.action === 'fetchChats') {
// //     fetchChats().then(chatList => {
// //       sendResponse({ success: true, chatList: chatList });
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   }
// // });

// // importScripts('jszip.min.js');


// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //   if (request.action === 'downloadChat') {
// //     downloadChat(request.chatUrl).then(result => {
// //       sendResponse(result);
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   } else if (request.action === 'fetchChats') {
// //     fetchChats().then(chatList => {
// //       sendResponse({ success: true, chatList: chatList });
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   }
// // });

// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //   if (request.action === 'downloadChat') {
// //     downloadChat(request.chatUrl).then(result => {
// //       sendResponse(result);
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   } else if (request.action === 'fetchChats') {
// //     fetchChats().then(chatList => {
// //       sendResponse({ success: true, chatList: chatList });
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   } else if (request.action === 'downloadSelectedChats') {
// //     downloadSelectedChats(request.chats).then(result => {
// //       sendResponse(result);
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   }
// // });


// // import * as JSZip from './jszip.min.js';

// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //   if (request.action === 'downloadChat') {
// //     downloadChat(request.chatUrl).then(result => {
// //       sendResponse(result);
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true;
// //   } else if (request.action === 'fetchChats') {
// //     fetchChats().then(chatList => {
// //       sendResponse({ success: true, chatList: chatList });
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true;
// //   } else if (request.action === 'downloadSelectedChats') {
// //     downloadSelectedChats(request.chats).then(result => {
// //       sendResponse(result);
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true;
// //   }
// // });
// importScripts('jszip.min.js');

// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //   if (request.action === 'downloadChat') {
// //     downloadChat(request.chatUrl).then(result => {
// //       sendResponse(result);
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   } else if (request.action === 'fetchChats') {
// //     fetchChats().then(chatList => {
// //       sendResponse({ success: true, chatList: chatList });
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   } else if (request.action === 'downloadSelectedChats') {
// //     downloadSelectedChats(request.chats).then(result => {
// //       sendResponse(result);
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true; // Keeps the message channel open for async response
// //   }
// // });

// // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// //   if (request.action === 'downloadChat') {
// //     downloadChat(request.chatUrl).then(result => {
// //       sendResponse(result);
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true;
// //   } else if (request.action === 'fetchChats') {
// //     fetchChats().then(chatList => {
// //       sendResponse({ success: true, chatList: chatList });
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true;
// //   } else if (request.action === 'downloadSelectedChats') {
// //     downloadSelectedChats(request.chats).then(result => {
// //       sendResponse(result);
// //     }).catch(error => {
// //       sendResponse({ success: false, error: error.message });
// //     });
// //     return true;
// //   }
// // });


// import JSZip from './jszip-wrapper.js';

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'downloadChat') {
//     downloadChat(request.chatUrl).then(result => {
//       sendResponse(result);
//     }).catch(error => {
//       sendResponse({ success: false, error: error.message });
//     });
//     return true;
//   } else if (request.action === 'fetchChats') {
//     fetchChats().then(chatList => {
//       sendResponse({ success: true, chatList: chatList });
//     }).catch(error => {
//       sendResponse({ success: false, error: error.message });
//     });
//     return true;
//   } else if (request.action === 'downloadSelectedChats') {
//     downloadSelectedChats(request.chats).then(result => {
//       sendResponse(result);
//     }).catch(error => {
//       sendResponse({ success: false, error: error.message });
//     });
//     return true;
//   }
// });


// // async function getOrganizationId() {
// //   try {
// //     const response = await fetch('https://api.claude.ai/api/organizations', {
// //       method: 'GET',
// //       credentials: 'include',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //     });

// //     if (!response.ok) {
// //       throw new Error(`Failed to fetch organization ID. Status: ${response.status}`);
// //     }

// //     const data = await response.json();
// //     if (data.length > 0) {
// //       return data[0].uuid;
// //     } else {
// //       throw new Error('No organizations found');
// //     }
// //   } catch (error) {
// //     console.error('Error fetching organization ID:', error);
// //     throw error;
// //   }
// // }

// async function getOrganizationId() {
//   try {
//     const response = await fetch('https://api.claude.ai/api/organizations', {
//       method: 'GET',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch organization ID. Status: ${response.status}`);
//     }

//     const data = await response.json();
//     if (data.length > 0) {
//       return data[0].uuid;
//     } else {
//       throw new Error('No organizations found');
//     }
//   } catch (error) {
//     console.error('Error fetching organization ID:', error);
//     throw error;
//   }
// }
// // async function fetchChats() {
// //   const organizationId = await getOrganizationId();
// //   const response = await fetch(
// //     `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations`,
// //     {
// //       method: 'GET',
// //       credentials: 'include',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //     }
// //   );

// //   if (!response.ok) {
// //     throw new Error(`Failed to fetch chat list: ${response.status}`);
// //   }

// //   return response.json();
// // }

// // async function downloadChat(chatUrl) {
// //   const url = new URL(chatUrl);
// //   const chatId = url.pathname.split('/').pop();
// //   console.log('Extracted Chat ID:', chatId);

// //   const organizationId = await getOrganizationId();
// //   const apiUrl = `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`;

// //   const response = await fetch(apiUrl, {
// //     method: 'GET',
// //     credentials: 'include',
// //     headers: {
// //       'Content-Type': 'application/json',
// //     },
// //   });

// //   if (!response.ok) {
// //     throw new Error(`Failed to fetch chat data. Status: ${response.status}`);
// //   }

// //   const data = await response.json();
// //   console.log('Chat Data:', data);

// //   return data;
// // }


// // async function downloadChat(chatUrl) {
// //   try {
// //     const url = new URL(chatUrl);
// //     const chatId = url.pathname.split('/').pop();
// //     console.log('Extracted Chat ID:', chatId);

// //     const organizationId = await getOrganizationId();
// //     const apiUrl = `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`;

// //     const response = await fetch(apiUrl, {
// //       method: 'GET',
// //       credentials: 'include',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //     });

// //     if (!response.ok) {
// //       throw new Error(`Failed to fetch chat data. Status: ${response.status}`);
// //     }

// //     const data = await response.json();
// //     console.log('Chat Data:', data);

// //     const htmlContent = await generateHtmlContentWithImages(data, chatId);

// //     const blob = new Blob([htmlContent], { type: 'text/html' });
// //     const downloadUrl = URL.createObjectURL(blob);

// //     chrome.downloads.download({
// //       url: downloadUrl,
// //       filename: `claude_chat_${chatId}.html`,
// //       saveAs: true
// //     }, (downloadId) => {
// //       if (chrome.runtime.lastError) {
// //         console.error('Download failed:', chrome.runtime.lastError);
// //       } else {
// //         console.log('Download started:', downloadId);
// //       }
// //     });

// //     return { success: true };
// //   } catch (error) {
// //     console.error('Error during chat download:', error);
// //     return { success: false, error: error.message };
// //   }
// // }

// // async function downloadSelectedChats(chats) {
// //   const zip = new JSZip();

// //   for (const chat of chats) {
// //     try {
// //       const chatData = await downloadChat(chat.url);
// //       const htmlContent = await generateHtmlContentWithImages(chatData, chat.id);
// //       zip.file(`claude_chat_${chat.id}.html`, htmlContent);
// //     } catch (error) {
// //       console.error(`Error downloading chat ${chat.id}:`, error);
// //     }
// //   }

// //   const content = await zip.generateAsync({ type: "blob" });
// //   const url = URL.createObjectURL(content);
  
// //   return new Promise((resolve, reject) => {
// //     chrome.downloads.download({
// //       url: url,
// //       filename: "claude_chats.zip",
// //       saveAs: true
// //     }, (downloadId) => {
// //       if (chrome.runtime.lastError) {
// //         reject(chrome.runtime.lastError);
// //       } else {
// //         resolve({ success: true, downloadId });
// //       }
// //     });
// //   });
// // }


// // async function downloadSelectedChats(chats) {
// //   const zip = new JSZip();

// //   for (const chat of chats) {
// //     try {
// //       const chatData = await downloadChat(chat.url);
// //       const htmlContent = await generateHtmlContentWithImages(chatData, chat.id);
// //       zip.file(`claude_chat_${chat.id}.html`, htmlContent);
// //     } catch (error) {
// //       console.error(`Error downloading chat ${chat.id}:`, error);
// //     }
// //   }

// //   const content = await zip.generateAsync({ type: "blob" });
// //   const url = URL.createObjectURL(content);
  
// //   return new Promise((resolve, reject) => {
// //     chrome.downloads.download({
// //       url: url,
// //       filename: "claude_chats.zip",
// //       saveAs: true
// //     }, (downloadId) => {
// //       if (chrome.runtime.lastError) {
// //         reject(chrome.runtime.lastError);
// //       } else {
// //         resolve({ success: true, downloadId });
// //       }
// //     });
// //   });
// // }


// async function fetchChats() {
//   const organizationId = await getOrganizationId();
//   const response = await fetch(
//     `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations`,
//     {
//       method: 'GET',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Failed to fetch chat list: ${response.status}`);
//   }

//   return response.json();
// }

// // async function downloadChat(chatUrl) {
// //   try {
// //     const url = new URL(chatUrl);
// //     const chatId = url.pathname.split('/').pop();
// //     console.log('Extracted Chat ID:', chatId);

// //     const organizationId = await getOrganizationId();
// //     const apiUrl = `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`;

// //     const response = await fetch(apiUrl, {
// //       method: 'GET',
// //       credentials: 'include',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //     });

// //     if (!response.ok) {
// //       throw new Error(`Failed to fetch chat data. Status: ${response.status}`);
// //     }

// //     const data = await response.json();
// //     console.log('Chat Data:', data);

// //     const htmlContent = await generateHtmlContentWithImages(data, chatId);

// //     chrome.downloads.download({
// //       url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
// //       filename: `claude_chat_${chatId}.html`,
// //       saveAs: true
// //     }, (downloadId) => {
// //       if (chrome.runtime.lastError) {
// //         console.error('Download failed:', chrome.runtime.lastError);
// //       } else {
// //         console.log('Download started:', downloadId);
// //       }
// //     });

// //     return { success: true };
// //   } catch (error) {
// //     console.error('Error during chat download:', error);
// //     return { success: false, error: error.message };
// //   }
// // }

// // async function downloadSelectedChats(chats) {
// //   try {
// //     for (const chat of chats) {
// //       await downloadChat(chat.url);
// //     }
// //     return { success: true };
// //   } catch (error) {
// //     console.error('Error downloading selected chats:', error);
// //     return { success: false, error: error.message };
// //   }
// // }

// async function downloadChat(chatUrl) {
//   try {
//     const url = new URL(chatUrl);
//     const chatId = url.pathname.split('/').pop();
//     console.log('Extracted Chat ID:', chatId);

//     const organizationId = await getOrganizationId();
//     const apiUrl = `https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`;

//     const response = await fetch(apiUrl, {
//       method: 'GET',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch chat data. Status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log('Chat Data:', data);

//     const htmlContent = await generateHtmlContentWithImages(data, chatId);

//     return { success: true, htmlContent, chatId };
//   } catch (error) {
//     console.error('Error during chat download:', error);
//     return { success: false, error: error.message };
//   }
// }

// // async function downloadSelectedChats(chats) {
// //   const zip = new JSZip();

// //   for (const chat of chats) {
// //     try {
// //       const result = await downloadChat(chat.url);
// //       if (result.success) {
// //         zip.file(`claude_chat_${result.chatId}.html`, result.htmlContent);
// //       } else {
// //         console.error(`Failed to download chat ${chat.id}:`, result.error);
// //       }
// //     } catch (error) {
// //       console.error(`Error downloading chat ${chat.id}:`, error);
// //     }
// //   }

// //   try {
// //     const content = await zip.generateAsync({ type: "blob" });
// //     const url = URL.createObjectURL(content);
    
// //     return new Promise((resolve) => {
// //       chrome.downloads.download({
// //         url: url,
// //         filename: "claude_chats.zip",
// //         saveAs: true
// //       }, (downloadId) => {
// //         if (chrome.runtime.lastError) {
// //           console.error('Download failed:', chrome.runtime.lastError);
// //           resolve({ success: false, error: chrome.runtime.lastError.message });
// //         } else {
// //           console.log('Download started:', downloadId);
// //           resolve({ success: true, downloadId });
// //         }
// //       });
// //     });
// //   } catch (error) {
// //     console.error('Error creating zip file:', error);
// //     return { success: false, error: error.message };
// //   }
// // }

// async function downloadSelectedChats(chats) {
//   const zip = new JSZip();

//   for (const chat of chats) {
//     try {
//       const result = await downloadChat(chat.url);
//       if (result.success) {
//         zip.file(`claude_chat_${result.chatId}.html`, result.htmlContent);
//       } else {
//         console.error(`Failed to download chat ${chat.id}:`, result.error);
//       }
//     } catch (error) {
//       console.error(`Error downloading chat ${chat.id}:`, error);
//     }
//   }

//   try {
//     const content = await zip.generateAsync({ type: "blob" });
//     const url = URL.createObjectURL(content);
    
//     return new Promise((resolve) => {
//       chrome.downloads.download({
//         url: url,
//         filename: "claude_chats.zip",
//         saveAs: true
//       }, (downloadId) => {
//         if (chrome.runtime.lastError) {
//           console.error('Download failed:', chrome.runtime.lastError);
//           resolve({ success: false, error: chrome.runtime.lastError.message });
//         } else {
//           console.log('Download started:', downloadId);
//           resolve({ success: true, downloadId });
//         }
//       });
//     });
//   } catch (error) {
//     console.error('Error creating zip file:', error);
//     return { success: false, error: error.message };
//   }
// }

// async function generateHtmlContentWithImages(data, chatId) {
//   let html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="UTF-8">
//         <title>${data.name}</title>
//         <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f4f4; }
//             h1 { text-align: center; color: #333; }
//             .message { margin-bottom: 20px; padding: 15px; border-radius: 5px; }
//             .human { background-color: #e9f7ef; border-left: 5px solid #2ecc71; }
//             .assistant { background-color: #e8f0fe; border-left: 5px solid #3498db; }
//             .message-header { font-weight: bold; margin-bottom: 10px; }
//             .message-time { font-size: 12px; color: #888; }
//             pre { white-space: pre-wrap; word-wrap: break-word; background-color: #f0f0f0; padding: 10px; border-radius: 4px; overflow: auto; }
//             img { max-width: 100%; height: auto; display: block; margin: 10px 0; }
//             a.file-link { display: block; margin: 10px 0; color: #007BFF; text-decoration: none; }
//         </style>
//     </head>
//     <body>
//         <h1>${data.name}</h1>
//   `;

//   for (const msg of data.chat_messages) {
//     const className = msg.sender === 'human' ? 'human' : 'assistant';
//     const messageTime = new Date(msg.created_at).toLocaleString();
//     let messageContent = formatMessageText(msg.text);

//     if (msg.attachments && msg.attachments.length > 0) {
//       for (const attachment of msg.attachments) {
//         const attachmentUrl = `https://claude.ai/api/{organizationId}/files/${attachment.id}/preview`;
//         if (attachment.file_type && attachment.file_type.startsWith('image/')) {
//           const imageUrl = await fetchImageWithReferer(attachment.id, chatId);
//           messageContent += `<img src="${imageUrl}" alt="Image">`;
//         } else {
//           messageContent += `<a href="${attachmentUrl}" class="file-link" target="_blank">Download ${attachment.file_name}</a>`;
//         }
//       }
//     }

//     html += `
//         <div class="message ${className}">
//             <div class="message-header">${
//               msg.sender === 'human' ? 'You' : 'Claude'
//             } <span class="message-time">${messageTime}</span></div>
//             <div class="message-content">${messageContent}</div>
//         </div>
//     `;
//   }

//   html += `
//     </body>
//     </html>
//   `;

//   return html;
// }

// function formatMessageText(text) {
//   const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
//   const formattedText = escapedText.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
//   return formattedText.replace(/\n/g, '<br>');
// }

// async function fetchImageWithReferer(fileId, chatId) {
//   try {
//     const organizationId = await getOrganizationId();
//     if (!organizationId) {
//       console.error('Failed to retrieve organization ID for image fetching.');
//       return '';
//     }

//     const imageUrl = `https://claude.ai/api/organizations/${organizationId}/files/${fileId}/download`;

//     const response = await fetch(imageUrl, {
//       method: 'GET',
//       credentials: 'include',
//       headers: {
//         Referer: `https://claude.ai/chat/${chatId}`,
//         'Sec-CH-UA': 'Chromium;v="128", Not;A=Brand;v="24", Google Chrome;v="128"',
//         'Sec-CH-UA-Mobile': '?0',
//         'Sec-CH-UA-Platform': 'macOS',
//         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
//       },
//     });

//     if (!response.ok) {
//       console.error('Failed to fetch image:', response.status);
//       return '';
//     }

//     const blob = await response.blob();
//     const objectUrl = URL.createObjectURL(blob);
//     console.log('Fetched image URL:', objectUrl);
//     return objectUrl;
//   } catch (error) {
//     console.error('Error fetching image:', error);
//     return '';
//   }
// }


importScripts('jszip.min.js');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'downloadChat') {
    downloadChat(request.chatUrl).then(result => {
      sendResponse(result);
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  } else if (request.action === 'fetchChats') {
    fetchChats().then(chatList => {
      sendResponse({ success: true, chatList: chatList });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  } else if (request.action === 'downloadSelectedChats') {
    downloadSelectedChats(request.chats).then(result => {
      sendResponse(result);
    }).catch(error => {
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

    const htmlContent = await generateHtmlContentWithImages(data, chatId);

    chrome.downloads.download({
      url: `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`,
      filename: `claude_chat_${chatId}.html`,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download failed:', chrome.runtime.lastError);
      } else {
        console.log('Download started:', downloadId);
      }
    });

    return { success: true, htmlContent, chatId };
  } catch (error) {
    console.error('Error during chat download:', error);
    return { success: false, error: error.message };
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
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    
    return new Promise((resolve) => {
      chrome.downloads.download({
        url: url,
        filename: "claude_chats.zip",
        saveAs: true
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error('Download failed:', chrome.runtime.lastError);
          resolve({ success: false, error: chrome.runtime.lastError.message });
        } else {
          console.log('Download started:', downloadId);
          resolve({ success: true, downloadId });
        }
      });
    });
  } catch (error) {
    console.error('Error creating zip file:', error);
    return { success: false, error: error.message };
  }
}

// async function generateHtmlContentWithImages(data, chatId) {
//   let html = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//         <meta charset="UTF-8">
//         <title>${data.name}</title>
//         <style>
//             body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; background-color: #f4f4f4; }
//             h1 { text-align: center; color: #333; }
//             .message { margin-bottom: 20px; padding: 15px; border-radius: 5px; }
//             .human { background-color: #e9f7ef; border-left: 5px solid #2ecc71; }
//             .assistant { background-color: #e8f0fe; border-left: 5px solid #3498db; }
//             .message-header { font-weight: bold; margin-bottom: 10px; }
//             .message-time { font-size: 12px; color: #888; }
//             pre { white-space: pre-wrap; word-wrap: break-word; background-color: #f0f0f0; padding: 10px; border-radius: 4px; overflow: auto; }
//             img { max-width: 100%; height: auto; display: block; margin: 10px 0; }
//             a.file-link { display: block; margin: 10px 0; color: #007BFF; text-decoration: none; }
//         </style>
//     </head>
//     <body>
//         <h1>${data.name}</h1>
//   `;

//   for (const msg of data.chat_messages) {
//     const className = msg.sender === 'human' ? 'human' : 'assistant';
//     const messageTime = new Date(msg.created_at).toLocaleString();
//     let messageContent = formatMessageText(msg.text);

//     if (msg.attachments && msg.attachments.length > 0) {
//       for (const attachment of msg.attachments) {
//         const attachmentUrl = `https://claude.ai/api/{organizationId}/files/${attachment.id}/preview`;
//         if (attachment.file_type && attachment.file_type.startsWith('image/')) {
//           const imageUrl = await fetchImageWithReferer(attachment.id, chatId);
//           messageContent += `<img src="${imageUrl}" alt="Image">`;
//         } else {
//           messageContent += `<a href="${attachmentUrl}" class="file-link" target="_blank">Download ${attachment.file_name}</a>`;
//         }
//       }
//     }

//     html += `
//         <div class="message ${className}">
//             <div class="message-header">${
//               msg.sender === 'human' ? 'You' : 'Claude'
//             } <span class="message-time">${messageTime}</span></div>
//             <div class="message-content">${messageContent}</div>
//         </div>
//     `;
//   }

//   html += `
//     </body>
//     </html>
//   `;

//   return html;
// }

async function generateHtmlContentWithImages(data, chatId) {
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
        </style>
    </head>
    <body>
        <h1>${data.name}</h1>
  `;

  const organizationId = await getOrganizationId(); // Fetch organizationId inside the function

  for (const msg of data.chat_messages) {
    const className = msg.sender === 'human' ? 'human' : 'assistant';
    const messageTime = new Date(msg.created_at).toLocaleString();
    let messageContent = formatMessageText(msg.text);

    if (msg.attachments && msg.attachments.length > 0) {
      for (const attachment of msg.attachments) {
        const attachmentUrl = `https://claude.ai/api/${organizationId}/files/${attachment.id}/preview`; // Use organizationId here
        if (attachment.file_type && attachment.file_type.startsWith('image/')) {
          const imageUrl = await fetchImageWithReferer(attachment.id, chatId);
          messageContent += `<img src="${imageUrl}" alt="Image">`;
        } else {
          messageContent += `<a href="${attachmentUrl}" class="file-link" target="_blank">Download ${attachment.file_name}</a>`;
        }
      }
    }

    html += `
        <div class="message ${className}">
            <div class="message-header">${
              msg.sender === 'human' ? 'You' : 'Claude'
            } <span class="message-time">${messageTime}</span></div>
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

function formatMessageText(text) {
  const escapedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const formattedText = escapedText.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
  return formattedText.replace(/\n/g, '<br>');
}

async function fetchImageWithReferer(fileId, chatId) {
  try {
    const organizationId = await getOrganizationId();
    if (!organizationId) {
      console.error('Failed to retrieve organization ID for image fetching.');
      return '';
    }

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