import { CLIENT, ERROR_MESSAGES } from './constants';

const state = {
    username: '',
    isLoggedIn: false,
    error: '',

    chats: [],
    users: [],

    loginLoading: true, // We start with our login status unknown
    chatsLoading: false,
    usersLoading: false,
}

export function setChats(chats) {
    state.chats = chats;
    state.chatsLoading = false;
    state.error = '';
}

export function sendChat(newChat) {
    state.chats.push(newChat);
    state.error = '';
}

export function setUsers(users) {
    state.users = users;
    state.usersLoading = false;
    state.error = '';
}

export function login(username) {
    state.isLoggedIn = true;
    state.loginLoading = false;
    state.username = username;
    state.error = '';
}

export function logout() {
    state.isLoggedIn = false;
    state.loginLoading = false;
    state.username = '';
    state.error = '';
}

export function waitOnLogin() {
    state.loginLoading = true;
    state.username = '';
    state.isLoggedIn = false;
    state.error = '';
}

export function waitOnChats() {
    state.chatsLoading = true;
    state.error = '';
}

export function waitOnUsers() {
    state.usersLoading = true;
    state.error = '';
}

export function setError(error) {
    if (!error) {
        state.error = '';
        return;
    }

    state.loginLoading = false;
    state.error = ERROR_MESSAGES[error] || ERROR_MESSAGES.default;
}

export default state;