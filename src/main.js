import { SERVER, CLIENT } from './constants';
import state, { login, logout, setChats, setError, setLoggedInUsers } from './state';
import { fetchChats, fetchSession, fetchLoggedInUsers } from './services';
import { render, renderLoggedInUsers } from './render';
import { addAbilityToLogin, addAbilityToLogout, addAbilityToAddChat } from './listeners';

const appEl = document.querySelector('#app');
const loginUserEl = document.querySelector('#users');

function checkForSession() {
    fetchSession()
        .then(session => {
            login(session.username);
            render({ state, appEl });
            return Promise.all([fetchChats(), fetchLoggedInUsers()]);
        })
        .catch(err => {
            if (err?.error === SERVER.AUTH_MISSING) {
                return Promise.reject({ error: CLIENT.NO_SESSION })
            }
            return Promise.reject(err);
        })
        .then(([chats, loggedInUsers]) => {
            setChats(chats);
            setLoggedInUsers(loggedInUsers.loggedInUsers);
            render({ state, appEl });
            renderLoggedInUsers({ state, loginUserEl });
        })
        .catch(err => {
            if (err?.error == CLIENT.NO_SESSION) {
                logout();
                render({ state, appEl });
                return;
            }
            setError(err?.error || 'ERROR');
            render({ state, appEl });
        });
}

function periodicallyUpdateLoggedInUsers() {
    setInterval(() => {
        if (state.isLoggedIn) {
            fetchLoggedInUsers()
                .then(loggedInUsersData => {
                    setLoggedInUsers(loggedInUsersData.loggedInUsers);
                    renderLoggedInUsers({ state, loginUserEl });
                })
                .catch(err => console.error("Error updating logged-in users: ", err));
        }
    }, 3000);
}

function periodicallyUpdateChats() {
    setInterval(() => {
        if (state.isLoggedIn) {
            fetchChats()
                .then(chats => {
                    setChats(chats);
                    render({ state, appEl });
                })
                .catch(err => console.error("Error updating logged-in users: ", err));
        }
    }, 3000);
}


function setupApp() {
    checkForSession();

    addAbilityToLogin({ state, appEl });
    addAbilityToLogout({ state, appEl, loginUserEl });

    addAbilityToAddChat({ state, appEl });

    render({ state, appEl });
    periodicallyUpdateLoggedInUsers();
    periodicallyUpdateChats();
}

setupApp();