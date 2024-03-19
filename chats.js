function makeChatRoom() {
    const chats = [];

    function sendChat(author, message) {
        const newChat = { author, message };
        chats.push(newChat);
        return newChat;
    }

    function getChats() {
        return chats;
    }

    return {
        sendChat, getChats
    }
};

module.exports = {
    makeChatRoom,
};
