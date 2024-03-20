let chats = [];

function sendChat(author, message) {
    const newChat = { author, message };
    chats.push(newChat);
    return newChat;
}

function getChats() {
    return chats;
}

module.exports = { sendChat, getChats };