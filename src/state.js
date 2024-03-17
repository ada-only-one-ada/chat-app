import { MESSAGES } from './constants';

const state = {
    chats: [],
    isLoggedIn: false,
    isLoginPending: true,
    isChatPending: false,
    username: '',
    loggedInUsers: [],
    error: '',
};

export function waitOnLogin() {
    state.isLoggedIn = false;
    state.isLoginPending = true;
    state.username = '';
    state.error = '';
}

export function login(username) {
    state.isLoggedIn = true;
    state.isLoginPending = false;
    state.username = username;
    state.error = '';
}

export function logout() {
    state.isLoggedIn = false;
    state.isLoginPending = false;
    state.username = '';
    state.error = '';
}

export function waitOnChats() {
    state.isChatPending = true;
    state.error = '';
}

export function setChats(chats) {
    state.chats = chats;
    state.isChatPending = false;
    state.error = '';
}

export function addChat(chat) {
    state.chats.push(chat);
    state.error = '';
}

export function setError(error) {
    if (!error) {
        state.error = '';
        return;
    }
    state.isLoginPending = false;
    state.error = MESSAGES[error] || MESSAGES.default;
}

export function setLoggedInUsers(loggedInUsers) {
    state.loggedInUsers = loggedInUsers;
}

export default state;

