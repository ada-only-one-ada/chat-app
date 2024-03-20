function isValidUsername(username) {
    let isValid = true;
    isValid = !!username && username.trim();
    isValid = isValid && username.match(/^[A-Za-z0-9_]+$/);
    return isValid;
}

const users = {};

function addUser(username) {
    users[username] = (users[username] || 0) + 1;
}

function deleteUser(username) {
    if (users[username]) {
        users[username] -= 1;
        if (users[username] === 0) {
            delete users[username];
        }
    }
}

function getUsers() {
    return users;
}

addUser('user1');
addUser('Alice123');
addUser('Bob_2024');
addUser('Charlie2024');
addUser('Delta_9');
addUser('Eve2024');
addUser('Frank_99');
addUser('GinaMarie');
addUser('HenryThe8th');
addUser('Isla_New');
addUser('JasperTheGhost');
addUser('Kilo_Lima');
addUser('LimaCharlie');
addUser('Mike1234');
addUser('Nina-P');
addUser('Oscar_O');
addUser('PapaBear');
addUser('QueenBee');
addUser('Romeo-Juliet');
addUser('SierraClub');
addUser('TangoDown');
addUser('Uniform_Uniform');
addUser('VictorVictory');
addUser('WhiskeyTangoFoxtrot');
addUser('XrayVision');
addUser('YankeeDoodle');
addUser('ZuluTime');

module.exports = { isValidUsername, addUser, deleteUser, getUsers };