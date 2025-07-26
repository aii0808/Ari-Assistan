// PENTING: Masukkan API Key Anda yang valid di sini
const API_KEY = 'AIzaSyB5Hr4P5rP_xpbDAZK_B8JmhFQYRML1UYw'; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Elemen-elemen dari HTML
const themeSwitcher = document.getElementById('theme-switcher');
const body = document.body;
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// --- Logika Pengubah Tema ---
function setIcon(theme) {
    const icon = themeSwitcher.querySelector('i');
    if (theme === 'light') {
        icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
    }
}
function applyTheme(theme) {
    body.className = theme + '-mode';
    setIcon(theme);
    localStorage.setItem('theme', theme);
}
themeSwitcher.addEventListener('click', () => {
    const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(newTheme);
});
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
});


// --- Logika Chat ---

// Fungsi untuk memformat jawaban AI (menangani baris baru dan teks tebal)
function formatAIResponse(text) {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/\n/g, '<br>');
    return formattedText;
}

// Fungsi untuk menambahkan pesan ke jendela chat
function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    const pElement = document.createElement('p');

    if (sender === 'ai') {
        pElement.innerHTML = formatAIResponse(message);
    } else {
        pElement.textContent = message;
    }

    messageElement.appendChild(pElement);
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Fungsi utama untuk mengirim pesan ke API
async function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    addMessage('user', message);
    userInput.value = '';

    try {
        const requestBody = { "contents": [{ "role": "user", "parts": [{ "text": message }] }] };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error dari API:', errorData);
            throw new Error('Respons jaringan tidak bagus.');
        }
        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;
        addMessage('ai', aiResponse);
    } catch (error) {
        console.error('Error:', error);
        addMessage('ai', 'Maaf, terjadi kesalahan. Coba lagi nanti.');
    }
}

// Event listener untuk tombol dan keyboard
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') sendMessage();
});