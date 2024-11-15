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
        hash.update(storedSalt + password) //Raneem there is no need to add the ":" here explanation in next comment
        const inputHash = hash.digest('hex')
        if (inputHash === storedHash) { //we are comparing between the storedHash which is a hexadecimal number of the salt and the password and the inputHash which we did the same exact thing to
            return true
        } else {
            return false
        }
    }
    catch (error) {
        console.error('Error during login check:', error)
        return false
    }
}

async function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const user = persistence.getUserByEmail(email)
    return emailRegex.test(email) && !user //!user return true if this email doesn't exist = unique
}

async function validatePassword(password) {
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

async function createSaltedHash(password) {
    const salt = crypto.randomBytes(4).toString('hex');
    const hash = crypto.createHash('sha1')
    hash.update(salt + password) //you forgot the salt here
    const saltedHash = salt + ":" + hash.digest('hex')
    return saltedHash
}

async function createUser(username, email, password, languagesKnown, languagesLearning, profilePicture) {
    const hashedPassword = createSaltedHash(password) 
    if (await validateEmail && await validateUsername && await validatePassword) {
        const user = {
            username: username,
            email: email,
            password: hashedPassword,
            languagesKnown: languagesKnown,
            languagesLerning: languagesLearning,
            profilePicture: profilePicture,
        }
        await persistence.createUser(user)
    } 
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

