const persistence = require('./persistence')
const crypto = require("crypto")

async function startSession(data) {
    const uuid = crypto.randomUUID()
    const expiry = new Date(Date.now() + 5 * 60 * 1000)
    await persistence.saveSession(uuid, expiry, data)
    return uuid
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const user = persistence.getUserByEmail(email)
    return emailRegex.test(email) && !user //!user return true if this email os not already saved in the db
}

function validatePassword(password) {
    const lengthRegex = /^.{8,}$/
    const numberRegex = /[0-9]/
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/ 
    const upperCaseRegex = /[A-Z]/
    const lowerCaseRegex = /[a-z]/

    return (
        lengthRegex.test(password) &&
        numberRegex.test(password) &&
        specialCharRegex.test(password) &&
        upperCaseRegex.test(password) &&
        lowerCaseRegex.test(password)
    )
}

async function checkLogin(email, password) {
    try {
        const user = await persistence.getUserByEmail(email)
        if (!user) {
            return { success: false }
        }
        const [storedSalt, storedHash] = user.password.split(':')
        const hash = crypto.createHash('sha1')
        hash.update(storedSalt + password)
        const inputHash = hash.digest('hex')
        if (inputHash === storedHash) {
            return { success: true, userId: user._id }
        } else {
            return { success: false }
        }
    }
    catch(error) {
        console.error('Error during login check:', error)
        return { success: false }
    }
}


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

async function updatePassword(email, newPassword) {
    await persistence.updatePassword(email, newPassword)
}


module.exports = {
    startSession,
    checkLogin,
    validateUsername,
    createUser,
    updatePassword
}

