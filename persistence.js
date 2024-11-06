const { MongoClient } = require("mongodb")

const uri = "mongodb+srv://60300372:INFS3201@infs3201.9arv1.mongodb.net/"
const client = new MongoClient(uri)

const db = "INFS3201-Project"

async function connectToDatabase(cName) {
    await client.connect()
    console.log(`Connected to the database, accessing collection: ${cName}`)
    return client.db(db).collection(cTasks)
}

