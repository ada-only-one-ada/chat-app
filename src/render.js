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
  if (state.isChatPending) {
    return `
      <div class="content">
        ${generateControlsHtml(state)}
        <div class="chats__waiting">Loading Chats...</div>
      </div>
    `;
  }
  return `
      <div class="content">
        ${generateControlsHtml(state)}
        <ul class="chats">${generateChatsHtml(state)}</ul>
        ${generateAddChatHtml(state)}
      </div>
  `;
}

function generateControlsHtml(state) {
  return `
        <div class="controls">
          <button class="controls__logout">Logout</button>
        </div>
  `;
}

function generateChatsHtml(state) {
  const chatsHtml = Object.values(state.chats).map(chat => {
    return `
      <li class="chat">
        <span class="chat__text">
          ${chat.author}: ${chat.message} 
        </span>
      </li>
    `;
  }).join('') || `<p>No chat yet, send one!</p>`;
  return chatsHtml;
}

function generateAddChatHtml(state) {
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
