import { fetchLogin, fetchLogout, fetchChats, fetchSendChat, fetchUsers } from './services';
import { waitOnLogin, waitOnChats, waitOnUsers, login, logout, setChats, sendChat, setUsers, setError } from './state';
import { render, renderChats, renderUsers } from './render';
import { CLIENT } from './constants';

export function toLogin({ state, mainEl }) {
    mainEl.addEventListener('submit', (e) => {
        if (!e.target.classList.contains('login__form')) {
            return;
        }

        e.preventDefault();
        const username = mainEl.querySelector('.login__username').value;
        waitOnLogin();
        render({ state, mainEl });

        fetchLogin(username)
            .then(() => {
                return new Promise((resolve) => setTimeout(resolve, 1000)); // loading chatroom for 1s 
            })
            .then(() => {
                login(username);

                waitOnChats();
                waitOnUsers();
                render({ state, mainEl });
            })
            .then(() => {
                return new Promise((resolve) => setTimeout(resolve, 1000))
            })
            .then(() => {
                return Promise.all([fetchChats(), fetchUsers()]);
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
                setError(err?.error || 'ERROR');
                render({ state, mainEl });
            });
    });
}

export function toLogout({ state, mainEl }) {
    mainEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('logout')) {
            return;
        }

        logout();
        render({ state, mainEl });

        fetchLogout()
            .catch(err => {
                if (err.error === CLIENT.NETWORK_ERROR) {
                    logout();
                    render({ state, mainEl });
                } else {
                    setError(err?.error || 'ERROR');
                    render({ state, mainEl });
                }
            });
    });
}

export function toSendChat({ state, mainEl }) {
    mainEl.addEventListener('submit', (e) => {
        if (!e.target.classList.contains('send__form')) {
            return;
        }

        e.preventDefault();
        const author = state.username;
        const message = mainEl.querySelector('.send__message').value;

        fetchSendChat(author, message)
            .then(chat => {
                sendChat(chat);
                render({ state, mainEl });
            })
            .catch(err => {
                if (err.error === CLIENT.NETWORK_ERROR) {
                    logout();
                    render({ state, mainEl });
                } else {
                    setError(err?.error || 'ERROR');
                    render({ state, mainEl });
                }
            });
    });
}
