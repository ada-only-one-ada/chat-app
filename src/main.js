import { SERVER, CLIENT } from './constants';
import state, { login, logout, setTodos, setError, setLoggedInUsers } from './state';
import { fetchTodos, fetchSession, fetchLoggedInUsers } from './services';
import { render, renderLoggedInUsers } from './render';
import { addAbilityToLogin, addAbilityToLogout, addAbilityToRefresh, addAbilityToAddTodo } from './listeners';

const appEl = document.querySelector('#app');
const loginUserEl = document.querySelector('#users');

function checkForSession() {
    fetchSession()
        .then(session => {
            login(session.username);
            render({ state, appEl });
            return Promise.all([fetchTodos(), fetchLoggedInUsers()]);
        })
        .catch(err => {
            if (err?.error === SERVER.AUTH_MISSING) {
                return Promise.reject({ error: CLIENT.NO_SESSION })
            }
            return Promise.reject(err);
        })
        .then(([todos, loggedInUsers]) => {
            setTodos(todos);
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
/*
function periodicallyUpdateTodos() {
    setInterval(() => {
        if (state.isLoggedIn) {
            fetchTodos()
                .then(todos => {
                    setTodos(todos);
                    render({ state, appEl });
                })
                .catch(err => console.error("Error updating logged-in users: ", err));
        }
    }, 3000);
}
*/

function setupApp() {
    checkForSession();

    addAbilityToLogin({ state, appEl });
    addAbilityToLogout({ state, appEl, loginUserEl });

    addAbilityToRefresh({ state, appEl });
    addAbilityToAddTodo({ state, appEl });

    render({ state, appEl });
    periodicallyUpdateLoggedInUsers();
    //periodicallyUpdateTodos();
}

setupApp();