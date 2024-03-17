const uuid = require('uuid').v4;

function makeTodoList() {
    const todoList = {};
    const todos = {};

    todoList.contains = function contains(id) {
        return !!todos[id];
    };

    todoList.getTodos = function getTodos() {
        return todos;
    };

    todoList.addTodo = function addTodo(task) {
        const id = uuid();
        todos[id] = {
            id,
            task,
            done: false,
        };
        return id;
    };

    todoList.getTodo = function getTodo(id) {
        return todos[id];
    };

    return todoList;
};

module.exports = {
    makeTodoList,
};
