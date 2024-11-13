const persistence = require('./persistence')
const crypto = require("crypto")

async function startSession() {
    const uuid = crypto.randomUUID()
    const expiry = new Date(Date.now() + 5 * 60 * 1000)
    const session = {
        sessionKey: uuid,
        expiry: expiry
    }
    await persistence.saveSession(session)
    return uuid
}

async function getSession(key) {
    return await persistence.getSession(key)
}

async function deleteSession(key) {
    return await persistence.deleteSession(key)
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

function createSaltedHash(password) {
    const salt = crypto.randomBytes(4).toString('hex');
    const hash = crypto.createHash('sha1')
    hash.update(salt+password) //you forgot the salt here
    const saltedHash = salt + ":" + hash.digest('hex')
    return saltedHash
}

async function createUser(username, email, password, languagesKnown, languageLearning, profilePicture) {
    const hashedPassword = createSaltedHash(password) //you forgot to hash the password here before you create the user
    const user = {
        username,
        email,
        hashedPassword,
        languagesKnown,
        languageLearning,
        profilePicture,
    }
    await persistence.createUser(user) 
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
    getSession,
    deleteSession,
    checkLogin,
    validateEmail,
    validatePassword,
    validateUsername,
    createUser,
    updatePassword
}

