const persistence = require('./persistence')
const crypto = require("crypto")

async function startSession(data) {
    const uuid = crypto.randomUUID()
    const expiry = new Date(Date.now() + 5 * 60 * 1000)
    await persistence.saveSession(uuid, expiry, data)
    return uuid
}

async function checkLogin(email, password) {
    try {
        const user = await persistence.getUserByEmail(email)
        if (!user) {
            return false
        }
        const [storedSalt, storedHash] = user.password.split(':')
        const hash = crypto.createHash('sha1')
        hash.update(storedSalt + password)
        const inputHash = hash.digest('hex')
        if (inputHash === storedHash) {
            return true
        } else {
            return false
        }
    }
    catch(error) {
        console.error('Error during login check:', error)
        return false
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const user = persistence.getUserByEmail(email)
    return emailRegex.test(email) && !user //!user return true if this email doesn't exist = uniqe
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

async function validateUsername(username) {
    const user = await persistence.getUserByUsername(username);
    return !user //!user return true if this username doesn't exist = uniqe
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

function createSaltedHash(password) {
    const salt = crypto.randomBytes(4).toString('hex');
    const hash = crypto.createHash('sha1')
    hash.update(password)
    const saltedHash = salt + ":" + hash.digest('hex')
    return saltedHash
}

async function updatePassword(email, newPassword) {
    const user = await persistence.getUserByEmail(email)
    if (!user) {
        return false
    }
    const saltedHash = createSaltedHash(newPassword)
    await persistence.updatePassword(email, saltedHash)
}


module.exports = {
    startSession,
    checkLogin,
    validateEmail,
    validatePassword,
    validateUsername,
    createUser,
    updatePassword
}

