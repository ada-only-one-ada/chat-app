import { fetchLogin, fetchLogout, fetchChats, fetchAddChat, fetchLoggedInUsers } from './services';
import { waitOnLogin, setChats, setError, login, logout, addChat, setLoggedInUsers } from './state';
import { render, renderLoggedInUsers } from './render';

export function addAbilityToLogin({ state, appEl }) {
    appEl.addEventListener('submit', (e) => {
        if (!e.target.classList.contains('login__form')) {
            return;
        }

        e.preventDefault();
        const username = appEl.querySelector('.login__username').value;
        waitOnLogin();

        fetchLogin(username)
            .then(() => login(username))
            .then(fetchLoggedInUsers)
            .then(loggedInUersData => {
                setLoggedInUsers(loggedInUersData.loggedUsers);
                return fetchChats();
            })
            .then(chats => {
                setChats(chats);
                render({ state, appEl });
            })
            .catch(err => {
                setError(err?.error || 'ERROR');
                render({ state, appEl });
            });
    });
}

export function addAbilityToLogout({ state, appEl, loginUserEl }) {
    appEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('controls__logout')) {
            return;
        }

        fetchLogout()
            .then(() => {
                logout();
                return fetchLoggedInUsers();
            })
            .then(loggedInUersData => {
                setLoggedInUsers(loggedInUersData.loggedUsers);
                render({ state, appEl });
                renderLoggedInUsers({ state, loginUserEl });
            })
            .catch(err => {
                setError(err?.error || 'ERROR');
                render({ state, appEl });
            });
    });
}

export function addAbilityToAddChat({ state, appEl }) {
    appEl.addEventListener('submit', (e) => {
        if (!e.target.classList.contains('add__form')) {
            return;
        }

        const author = state.username;
        const message = appEl.querySelector('.add__task').value;

        fetchAddChat(author, message)
            .then(chat => {
                addChat(chat);
                render({ state, appEl });
            })
            .catch(err => {
                setError(err?.error || 'ERROR');
                render({ state, appEl });
            });
    });
}