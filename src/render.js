function render({ state, appEl }) {
    const html = `
     <main class="">
       ${generateStatusHtml(state)}
       ${generateLoginHtml(state)}
       ${generateContentHtml(state)}
     </main>
    `;
    appEl.innerHTML = html;
}

function renderLoggedInUsers({ state, loginUserEl }) {
    if (!state.isLoggedIn) {
        loginUserEl.innerHTML = '';
        return;
    }

    const html = `
    <h3>Loggin Users</h3>
    ${generateLogginInUsers(state)}
    `
    loginUserEl.innerHTML = html;
}

function generateLogginInUsers(state) {
    const logginInUsersHtml = Object.values(state.loggedInUsers).map(user => {
        return `
      <li class="user">${user}</li>
      `
    }).join('');
    return logginInUsersHtml;
}

function generateStatusHtml(state) {
    return `
        <div class="status">${state.error}</div>
    `;
}

function generateLoginHtml(state) {
    if (state.isLoginPending) {
        return `
        <div class="login__waiting">Loading user...</div>
      `
    }
    if (state.isLoggedIn) {
        return ``;
    }

    return `
        <div class="login">
          <form class="login__form" action="#/login">
            <label>
              <span>Username:</span>
              <input class="login__username" value="">
            </label>
            <button class="login__button" type="submit">Login</button>
          </form>
        </div>
    `;
}

function generateContentHtml(state) {
    if (!state.isLoggedIn) {
        return ``;
    }
    if (state.isTodoPending) {
        return `
        <div class="content">
          ${generateControlsHtml(state)}
          <div class="todos__waiting">Loading Todos...</div>
        </div>
      `;
    }
    return `
        <div class="content">
          ${generateControlsHtml(state)}
          <ul class="todos">${generateTodosHtml(state)}</ul>
          ${generateAddTodoHtml(state)}
        </div>
    `;
}

function generateControlsHtml(state) {
    return `
          <div class="controls">
            <button class="controls__refresh">Refresh</button>
            <button class="controls__logout">Logout</button>
          </div>
    `;
}

function generateTodosHtml(state) {
    const username = state.username;
    const todosHtml = Object.values(state.todos).map(todo => {
        return `
        <li class="todo">
          <span class="todo__text">
            ${username}: ${todo.task} 
          </span>
        </li>
      `;
    }).join('') || `<p>No Todo Items yet, add one!</p>`;
    return todosHtml;
}

function generateAddTodoHtml(state) {
    return `
          <form class="add__form" action="#/add">
            <input class="add__task">
            <button type="submit" class="add__button">Send</button>
          </form>
    `;
}

module.exports = {
    render,
    renderLoggedInUsers
};
