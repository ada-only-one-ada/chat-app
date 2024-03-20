import { SERVER, CLIENT } from "./constants";
import state, { login, logout, setChats, setUsers, setError } from './state';
import { fetchSession, fetchChats, fetchUsers } from "./services";
import { render, renderChats, renderUsers } from './render';
import { toLogin, toLogout, toSendChat } from "./listeners";

const mainEl = document.querySelector('#main');

function checkForSession() {
    fetchSession()
        .then(session => {
            login(session.username);
            render({ state, mainEl });
            return Promise.all([fetchChats(), fetchUsers()]);
        })
        .catch(err => {
            if (err?.error === SERVER.AUTH_MISSING) {
                return Promise.reject({ error: CLIENT.NO_SESSION });
            }
            return Promise.reject(err);
        })
        .then(([chats, users]) => {
            setChats(chats);
            setUsers(users);

            const usersEl = document.querySelector('#users');
            const chatsEl = document.querySelector('#chats');
            renderChats({ state, chatsEl });
            renderUsers({ state, usersEl });
        })
        .catch(err => {
            if (err?.error === CLIENT.NO_SESSION) {
                logout();
                render({ state, mainEl });
                return;
            }
            setError(err?.error || 'ERROR');
            render({ state, mainEl });
        });
}

function periodicallyUpdateChats() {
    setInterval(() => {
        if (state.isLoggedIn) {
            fetchChats()
                .then(chats => {
                    setChats(chats);
                    const chatsEl = document.querySelector('#chats');
                    renderChats({ state, chatsEl });
                })
                .catch(err => console.error("Error updating chats: ", err));
        }
    }, 5000);
}

function periodicallyUpdateUsers() {
    setInterval(() => {
        if (state.isLoggedIn) {
            fetchUsers()
                .then(users => {
                    setUsers(users);
                    const usersEl = document.querySelector('#users');
                    renderUsers({ state, usersEl });
                })
                .catch(err => console.error("Error updating users: ", err));
        }
    }, 5000);
}

function initChatapp() {
    checkForSession();
    toLogin({ state, mainEl });
    toLogout({ state, mainEl });
    toSendChat({ state, mainEl });
    render({ state, mainEl });
    periodicallyUpdateChats();
    periodicallyUpdateUsers();
}

initChatapp();

