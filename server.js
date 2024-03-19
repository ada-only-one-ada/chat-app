const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

const chatRoom = require('./chats').makeChatRoom();
const sessions = require('./sessions');
const users = require('./users');

app.use(cookieParser());
app.use(express.static('./public'));
app.use(express.json());

let loggedInUsers = {};

app.get('/api/v1/loggedInUsers', (req, res) => {
    const usernames = Object.keys(loggedInUsers);
    res.json({ loggedInUsers: usernames });
});

app.get('/api/v1/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if (!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    res.json({ username });
});

app.post('/api/v1/session', (req, res) => {
    const { username } = req.body;

    if (!users.isValid(username)) {
        res.status(400).json({ error: 'required-username' });
        return;
    }

    if (username === 'dog') {
        res.status(403).json({ error: 'auth-insufficient' });
        return;
    }

    const sid = sessions.addSession(username);

    loggedInUsers[username] = (loggedInUsers[username] || 0) + 1;

    res.cookie('sid', sid, { httpOnly: true });
    res.json(chatRoom.getChats());
});

app.delete('/api/v1/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';

    if (loggedInUsers[username]) {
        loggedInUsers[username] -= 1;
        if (loggedInUsers[username] === 0) {
            delete loggedInUsers[username];
        }
    }

    if (sid) {
        res.clearCookie('sid');
    }

    if (username) {
        sessions.deleteSession(sid);
    }

    res.json({ username });
});

app.get('/api/v1/chats', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if (!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    res.json(chatRoom.getChats());
});

app.post('/api/v1/chats', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if (!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    const { author, message } = req.body;
    if (!message) {
        res.status(400).json({ error: 'required-message' });
        return;
    }

    const newChat = chatRoom.sendChat(author, message);
    res.json(newChat);
});


app.listen(PORT, () => console.log(`http://localhost:${PORT}`));