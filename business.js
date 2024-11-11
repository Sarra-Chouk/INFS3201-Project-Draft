const persistence = require('./persistence.js')

async function validateUsername(username) {
    const existingUser = await persistence.getUserByUsername(username);
    if (existingUser) {
        return false;
    } else {
        return true;
    }
}


async function createUser(username, email, password, languagesKnown, languageLearning, profilePicture) {
    const user = {
        username,
        email,
        password,
        languagesKnown,
        languageLearning,
        profilePicture,
    }
    await persistence.createUser(user) 
}

module.exports = {
    validateUsername,
    createUser
}