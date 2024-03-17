import { MESSAGES } from './constants';

const state = {
    todos: {},
    isLoggedIn: false,
    isLoginPending: true,
    isTodoPending: false,
    username: '',
    lastAddedTodoId: '',
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
    state.lastAddedTodoId = '';
}

export function logout() {
    state.isLoggedIn = false;
    state.isLoginPending = false;
    state.username = '';
    state.error = '';
    state.todos = {};
}

export function waitOnTodos() {
    state.isTodoPending = true;
    state.error = '';
}

export function setTodos(todos) {
    state.todos = todos;
    state.isTodoPending = false;
    state.lastAddedTodoId = '';
    state.error = '';
}

export function addTodo({ id, todo }) {
    state.todos[id] = todo;
    state.lastAddedTodoId = id;
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

