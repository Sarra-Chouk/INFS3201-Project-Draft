const mongodb = require('mongodb')

let client = undefined
let db = undefined
let users = undefined
let sessions = undefined
let messages = undefined
let badges = undefined

async function connectDatabase() {
    if (!client) {
        client = new mongodb.MongoClient('mongodb+srv://60300372:INFS3201@infs3201.9arv1.mongodb.net/')
        await client.connect()
        db = client.db('INFS3201-Project')
        users = db.collection('users')
        sessions = db.collection('sessions')
        messages = db.collection('messages')
        badges = db.collection('badges')
    }
}

<<<<<<< HEAD
async function saveSession(session) {
=======

async function saveSession(uuid, expiry, data) {
>>>>>>> e7c7e1af1671e6298f14e2835a3a7f283a5442c1
    try {
        await connectDatabase()
        await sessions.insertOne(session)
        console.log("Session saved successfully.")
    } catch (error) {
        console.error("Error saving session:", error)
    }
}

async function getSession(key) {
    try {
        await connectDatabase()
        return await sessions.findOne({ sessionKey: key });
    } catch (error) {
        console.error("Error finding session data:", error)
    }
}

async function deleteSession(key) {
    try {
        await connectDatabase()
        const result = await sessions.deleteOne({ sessionKey: key });
        if (result.deletedCount === 1) {
            console.log("Session deleted successfully.");
        } else {
            console.log("No session found with the given key.");
        }
    } catch (error) {
        console.error("Error deleting session:", error)
    }
}

async function getUserByEmail(email){
    await connectDatabase()
    const user = await users.findOne({ email });
    return user
}

async function getUserByUsername(username) {
    await connectDatabase(); 
    const user = await users.findOne({ username });
    return user;
}

async function createUser(user) {
    await connectDatabase()
    await users.insertOne(user) 

}

async function updatePassword(email, newPassword) {
    await connectDatabase(); 
    await users.updateOne(
        { email: email }, 
        { $set: { password: newPassword } } 
    );

}
module.exports = {
    saveSession,
    getSession,
    deleteSession,
    connectDatabase,
    getUserByUsername,
    getUserByEmail,
    createUser,
    updatePassword
}