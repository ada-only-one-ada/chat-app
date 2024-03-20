const uuid = require('uuid').v4;

const sessions = {};

function addSession(username) {
    const sid = uuid();
    sessions[sid] = { username };
    return sid;
};

function deleteSession(sid) {
    delete sessions[sid];
};

function getSessionUsername(sid) {
    return sessions[sid]?.username;
};

module.exports = { addSession, deleteSession, getSessionUsername }

