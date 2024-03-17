import { fetchLogin, fetchLogout, fetchTodos, fetchAddTodo, fetchLoggedInUsers } from './services';
import { waitOnTodos, waitOnLogin, setTodos, setError, login, logout, addTodo, setLoggedInUsers } from './state';
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
                return fetchTodos();
            })
            .then(todos => {
                setTodos(todos);
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

export function addAbilityToRefresh({ state, appEl }) {
    appEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('controls__refresh')) {
            return;
        }

        waitOnTodos();
        fetchTodos()
            .then(todos => {
                setTodos(todos);
                render({ state, appEl });
            })
            .catch(err => {
                setError(err?.error || 'ERROR');
                render({ state, appEl });
            });
    });
}

export function addAbilityToAddTodo({ state, appEl }) {
    appEl.addEventListener('submit', (e) => {
        if (!e.target.classList.contains('add__form')) {
            return;
        }

        const task = appEl.querySelector('.add__task').value;
        fetchAddTodo(task)
            .then(todo => {
                addTodo({ id: todo.id, todo });
                render({ state, appEl });
            })
            .catch(err => {
                setError(err?.error || 'ERROR');
                render({ state, appEl });
            });
    });
}