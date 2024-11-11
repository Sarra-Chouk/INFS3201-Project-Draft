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

async function getUserByUsername(username) {
    await connectDatabase(); 
    const user = await users.findOne({ username });
    return user;
}

 //code to insert one user at a time
async function createUser(user) {
    await connectDatabase()
    await users.insertOne(user) 

}

async function updatePassword(email, newPassword) {
    
}

module.exports = {
    connectDatabase,
    createUser,
    getUserByUsername

}