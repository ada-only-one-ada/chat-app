const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

const todos = require('./chats');
const sessions = require('./sessions');
const users = require('./users');

app.use(cookieParser());
app.use(express.static('./public'));
app.use(express.json());

let loggedInUsers = [];
app.get('/api/v1/loggedInUsers', (req, res) => {
    res.json({ loggedInUsers });
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

    if (!loggedInUsers.includes(username)) {
        loggedInUsers.push(username);
    }

    const sid = sessions.addSession(username);
    const existingUserData = users.getUserData(username);

    if (!existingUserData) {
        users.addUserData(username, todos.makeTodoList());
    }

    res.cookie('sid', sid);
    res.json(users.getUserData(username).getTodos());
});

app.delete('/api/v1/session', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';

    const index = loggedInUsers.indexOf(username);
    if (index > -1) {
        loggedInUsers.splice(index, 1);
    }

    if (sid) {
        res.clearCookie('sid');
    }

    if (username) {
        sessions.deleteSession(sid);
    }

    res.json({ username });
});

app.get('/api/v1/todos', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if (!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }

    res.json(users.getUserData(username).getTodos());

});

app.post('/api/v1/todos', (req, res) => {
    const sid = req.cookies.sid;
    const username = sid ? sessions.getSessionUser(sid) : '';
    if (!sid || !users.isValid(username)) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    }
    const { task } = req.body;
    if (!task) {
        res.status(400).json({ error: 'required-task' });
        return;
    }

    const todoList = users.getUserData(username);
    const id = todoList.addTodo(task);
    res.json(todoList.getTodo(id));
});


app.listen(PORT, () => console.log(`http://localhost:${PORT}`));