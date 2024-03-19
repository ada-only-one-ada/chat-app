import { fetchLogin, fetchLogout, fetchChats, fetchSendChat, fetchLoggedInUsers } from './services';
import { waitOnLogin, waitOnChats, waitOnLoggedInUsers, login, logout, setChats, sendChat, setLoggedInUsers, setError } from './state';
import { render, renderLoggedInUsers } from './render';

export function addAbilityToLogin({ state, appEl, loginUserEl }) {
    appEl.addEventListener('submit', (e) => {
        if (!e.target.classList.contains('login__form')) {
            return;
        }

        e.preventDefault();
        const username = appEl.querySelector('.login__username').value;

        waitOnLogin();
        render({ state, appEl });

        fetchLogin(username)
            .then(() => {
                return new Promise((resolve) => setTimeout(resolve, 1000))
            })
            .then(() => {
                login(username);
                waitOnLoggedInUsers();
                waitOnChats();

                render({ state, appEl });
                renderLoggedInUsers({ state, loginUserEl });

                return new Promise(resolve => setTimeout(resolve, 1000));
            })
            .then(() => {
                return Promise.all([
                    fetchLoggedInUsers(),
                    fetchChats()
                ]);
            })
            .then(([loggedInUersData, chatsData]) => {
                setLoggedInUsers(loggedInUersData.loggedUsers);
                setChats(chatsData)

                render({ state, appEl });
            })
            .catch(err => {
                setError(err?.error || 'ERROR');
                render({ state, appEl });
                renderLoggedInUsers({ state, loginUserEl });
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
                render({ state, appEl });
                renderLoggedInUsers({ state, loginUserEl });
            })
            .catch(err => {
                setError(err?.error || 'ERROR');
                render({ state, appEl });
                renderLoggedInUsers({ state, loginUserEl });
            });
    });
}

export function addAbilityToSendChat({ state, appEl, loginUserEl }) {
    appEl.addEventListener('submit', (e) => {
        if (!e.target.classList.contains('send__form')) {
            return;
        }

        e.preventDefault();
        const author = state.username;
        const message = appEl.querySelector('.send__message').value;

        fetchSendChat(author, message)
            .then(chat => {
                sendChat(chat);
                render({ state, appEl });
            })
            .catch(err => {
                setError(err?.error || 'ERROR');
                render({ state, appEl });
                renderLoggedInUsers({ state, loginUserEl });
            });
    });
}