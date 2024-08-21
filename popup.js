document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('downloadCurrentTab').addEventListener('click', () => {
        // Get the URL of the current active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTabUrl = tabs[0].url;
            console.log('Active Tab URL:', activeTabUrl); // Debugging line to check URL
            downloadChat(activeTabUrl);
        });
    });

    document.getElementById('downloadFromUrl').addEventListener('click', () => {
        const chatUrl = document.getElementById('chatUrl').value.trim();
        if (chatUrl) {
            console.log('Provided URL:', chatUrl); // Debugging line to check URL
            downloadChat(chatUrl);
        } else {
            alert('Please enter a valid URL.');
        }
    });
});

async function downloadChat(providedUrl = null) {
    console.log('URL Passed to downloadChat:', providedUrl); // Debugging line to check URL
    const url = providedUrl ? new URL(providedUrl) : new URL(window.location.href);
    const chatId = url.pathname.split('/').pop();
    console.log('Extracted Chat ID:', chatId); // Debugging line to check chat ID
    const organizationId = '27cd869d-5523-4018-97c9-c42cd0bb37a0';

    try {
        const response = await fetch(`https://api.claude.ai/api/organizations/${organizationId}/chat_conversations/${chatId}?tree=True&rendering_mode=raw`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Chat Data:', data);

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                .message { margin-bottom: 15px; }
                .human { color: #4a4a4a; }
                .assistant { color: #0066cc; }
            </style>
        </head>
        <body>
        <h1>${data.name}</h1>
        `;

        data.chat_messages.forEach(msg => {
            const className = msg.sender === 'human' ? 'human' : 'assistant';
            html += `<div class="message ${className}">
                <strong>${msg.sender}:</strong> ${msg.text}
                <br><small>Created at: ${msg.created_at}</small>
            </div>`;
        });

        html += '</body></html>';

        const blob = new Blob([html], { type: 'text/html' });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = `claude_chat_${chatId}.html`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(downloadUrl);

    } catch (error) {
        console.error('Error:', error);
    }
}
