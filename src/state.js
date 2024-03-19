import { CLIENT, MESSAGES } from './constants';

const state = {
    chats: [],
    isLoggedIn: false,
    isLoginPending: true,
    username: '',
    loggedInUsers: [],
    isLoggedInUsersPending: false,
    isChatPending: false,
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
    updateLogginUsersVisibility();
    state.isLoginPending = false;
    state.username = username;
    state.error = '';
}

export function logout() {
    state.loggedInUsers = [];
    state.isLoggedIn = false;
    updateLogginUsersVisibility();
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

export function sendChat(chat) {
    state.chats.push(chat);
    state.error = '';
}

export function setError(error) {
    if (!error) {
        state.error = '';
        return;
    }

    if (error === CLIENT.NETWORK_ERROR) {
        logout();
        state.error = MESSAGES[CLIENT.NETWORK_ERROR];
    } else {
        state.isLoginPending = false;
        state.error = MESSAGES[error] || MESSAGES.default;
    }
}

export function waitOnLoggedInUsers() {
    state.isLoggedInUsersPending = true;
    state.error = '';
}

export function setLoggedInUsers(loggedInUsers) {
    state.loggedInUsers = loggedInUsers;
    state.isLoggedInUsersPending = false;
    state.error = '';
}

function updateLogginUsersVisibility() {
    const loginSection = document.getElementById('loggin-users__section');
    if (state.isLoggedIn) {
        loginSection.classList.add('shown');
    } else {
        loginSection.classList.remove('shown');
    }
}

export default state;

