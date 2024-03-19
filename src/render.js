function render({ state, appEl }) {
  const html = `
     ${generateLoginHtml(state)}
     
     ${generateContentHtml(state)}
     ${generateStatusHtml(state)}
  `;
  appEl.innerHTML = html;
  scrollToBottom();
}

function renderLoggedInUsers({ state, loginUserEl }) {
  if (!state.isLoggedIn) {
    loginUserEl.innerHTML = '';
    return;
  }

  const html = generateLogginInUsers(state);
  loginUserEl.innerHTML = html;
}

function renderChats({ state, chatsEl }) {
  if (!state.isLoggedIn) {
    return;
  }

  const html = generateChatsHtml(state);
  chatsEl.innerHTML = html;
  scrollToBottom();
}

function generateLogginInUsers(state) {
  if (state.isLoggedInUsersPending || !state.loggedInUsers) {
    return `
    <i class="gg-spinner"></i>
    <div class="users__waiting">Loading online users...</div>
    `;
  }

  const logginInUsersHtml = Object.values(state.loggedInUsers).map(user => {
    return `
    <li class="user"> ${user}</li>
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
      <i class="gg-spinner"></i>
      <div class="login__waiting">Loading user...</div>
    `
  }
  if (state.isLoggedIn) {
    return ``;
  }

  return `
      <div class="login">
        <form class="login__form">
          <label><span>Username</span><input class="login__username" value=""></label>
          <button class="login__button" type="submit">Login</button>
        </form>
      </div>
  `;
}

function generateContentHtml(state) {
  if (!state.isLoggedIn) {
    return ``;
  }

  return `
      <div class="content">
        <button class="controls__logout">Logout</button>
        <div class="messages__container">
           <ul class="chats">${generateChatsHtml(state)}</ul>
        </div>
        ${generateSendChatHtml(state)}
      </div>
  `;
}

function generateChatsHtml(state) {
  if (state.isChatPending) {
    return `
    <i class="gg-spinner"></i>
    <p>Loading chats...</p>
    `;
  }

  const chatsHtml = Object.values(state.chats).map(chat => {
    return `
      <li class="chat"><span class="chat__author">${chat.author}</span>: ${chat.message}</li>
    `;
  }).join('');
  return chatsHtml;
}

function generateSendChatHtml(state) {
  return `
        <form class="send__form">
          <input class="send__message">
          <button type="submit" class="send__button">Send</button>
        </form>
  `;
}

module.exports = {
  render,
  renderLoggedInUsers,
  renderChats
};


function scrollToBottom() {
  const chatsContainer = document.querySelector('.messages__container');
  if (chatsContainer) {
    chatsContainer.scrollTop = chatsContainer.scrollHeight;
  }
}