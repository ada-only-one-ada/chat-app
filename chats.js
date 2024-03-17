const uuid = require('uuid').v4;

function makeChatRoom() {
    const chats = [];

    function addChat(author, message) {
        const newChat = { author, message };
        chats.push(newChat);
        return newChat;
    }

    function getChats() {
        return chats;
    }

    return {
        addChat, getChats
    }
};

module.exports = {
    makeChatRoom,
};
