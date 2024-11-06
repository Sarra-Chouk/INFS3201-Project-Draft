const mongodb = require('mongodb');
const { MongoClient } = require("mongodb")

let client = undefined;
let db = undefined;
let users = undefined;


async function connectDatabase() {
    if (!client) {
        client = new MongoClient("mongodb+srv://60300372:INFS3201@infs3201.9arv1.mongodb.net/");
        await client.connect();
        db = client.db("INFS3201-Project");
        users = db.collection('users');
        console.log("Sarra")
        console.log("Ranem")
        console.log("ChouK")
        console.log("maha")
    }
}