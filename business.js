const persistence = require("./persistence.js")

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const user = persistence.getUserByEmail(email)
    return emailRegex.test(email) && !user
}