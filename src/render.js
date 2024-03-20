function renderChats({ state, chatsEl }) {
    if (!state.isLoggedIn) {
        chatsEl.innerHTML = '';
        return;
    }
    const html = generateChatsHtml(state);
    chatsEl.innerHTML = html;
    scrollToBottom()
}

function renderUsers({ state, usersEl }) {
    if (!state.isLoggedIn) {
        usersEl.innerHTML = '';
        return;
    }
    const html = generateUsersHtml(state);
    usersEl.innerHTML = html;
}

function render({ state, mainEl }) {
    if (state.isLoggedIn) {
        const html = `
        <div class="wrapper">
            <div class="chats__section">
                ${generateLogoutButtonHtml(state)}
                
                <ol id="chats">
                    ${generateChatsHtml(state)}
                </ol>
                ${generateSendChatFormHtml(state)}
                ${generateErrorMessageHtml(state)}
            </div>

            <div class="users__section">
                <h2 class="users__title">Online Users</h2>
                <ol id="users">
                    ${generateUsersHtml(state)}
                </ol>
            </div>
        </div>
        `
        mainEl.innerHTML = html;
    }

    if (!state.isLoggedIn) {
        const html = `
        ${generateLoginFormHtml(state)}
        ${generateErrorMessageHtml(state)}
        `
        mainEl.innerHTML = html;
    }
    scrollToBottom();
}

function generateLoginFormHtml(state) {
    if (state.loginLoading) {
        return `
        <i class="gg-spinner"></i>
        <div class="login__waiting">Loading your chatroom...</div>
        `
    }

    if (state.isLoggedIn) {
        return ``;
    }

    return `
    <div class="login">
        <form class="login__form">
            <label>Username
                <input class="login__username" value="">
            </label>
            <button class="login__button" type="submit">Login</button>
        </form>
    </div>
    `
}

function generateLogoutButtonHtml(state) {
    return `
    <button class="logout">Logout</button>
    `
}

function generateSendChatFormHtml(state) {
    return `
    <div class="send">
        <form class="send__form">
            <input class="send__message">
            <button class="send__button" type="submit">Send</button>
        </form>
    </div>
    `;
}

function generateErrorMessageHtml(state) {
    return `
    <div class="error">${state.error}</div>
    `
}

function generateChatsHtml(state) {
    if (state.chatsLoading) {
        return `
        <i class="gg-spinner"></i>
        <div class="chats__waiting">Loading chats...</div>
        `
    }

    if (!state.isLoggedIn) {
        return ``;
    }

    const chatsHtml = Object.values(state.chats).map(chat => {
        return `
        <li class="chat"><span class="author">${chat.author}</span>: ${chat.message}</li>
        `
    }).join('');

    return chatsHtml;
}

function generateUsersHtml(state) {
    if (state.usersLoading) {
        return `
        <i class="gg-spinner"></i>
        <div class="users__waiting">Loading online users...</div>
        `
    }

    if (!state.isLoggedIn) {
        return ``;
    }

    const usersHtml = Object.keys(state.users).map(user => {
        return `
        <li class="user"><span class="user__username">${user}</span></li>
        `
    }).join('');

    return usersHtml;
}

function scrollToBottom() {
    const chatsEl = document.querySelector('#chats');
    if (chatsEl) {
        chatsEl.scrollTop = chatsEl.scrollHeight;
    }
}

module.exports = {
    render,
    renderUsers,
    renderChats
};