const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.static('./public'));
app.use(express.json());

const chatroom = require('./chatroom');
const sessions = require('./sessions');
const users = require('./users');

// Check if there is a valid session
app.get('/api/v1/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUsername(sid) : '';

    if (!sid || !users.isValidUsername(username)) { // No session will call the login form 
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    res.json({ username });  // An existing session will get back the username and user need to call for chats 
});

// Create a session
app.post('/api/v1/session', (req, res) => {
    const { username } = req.body;

    if (!users.isValidUsername(username)) {
        res.status(400).json({ error: 'required-username' });
        return;
    }

    if (username === 'dog') {
        res.status(403).json({ error: 'auth-insufficient' });
        return;
    }

    const sid = sessions.addSession(username);
    users.addUser(username);

    res.cookie('sid', sid);
    res.json(chatroom.getChats()); // But create a new session will return the chats directly 
});

// Delete a session
app.delete('/api/v1/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUsername(sid) : '';

    users.deleteUser(username);

    if (sid) {
        res.clearCookie('sid');
    }

    if (username) {
        sessions.deleteSession(sid); // Delete the session, but not the user data?
    }

    res.json({ username });
});

// Get all chats 
app.get('/api/v1/chats', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUsername(sid) : '';

    if (!sid || !users.isValidUsername(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    res.json(chatroom.getChats());
});

// Send a chat
app.post('/api/v1/chats', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUsername(sid) : '';

    if (!sid || !users.isValidUsername(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    const { author, message } = req.body;
    if (!message) {
        res.status(400).json({ error: 'required-message' });
        return;
    }

    const newChat = chatroom.sendChat(author, message);
    res.json(newChat);
});

// Get all users
app.get('/api/v1/users', (req, res) => {

    res.json(users.getUsers());

});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
