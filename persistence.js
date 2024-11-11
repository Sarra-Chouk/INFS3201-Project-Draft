async function saveSession(uuid, expiry, data) {
    try {
        const collection = await connectToDatabase("SessionData")
        const session = {
            sessionKey: uuid,
            expiry: expiry,
            data: data
        }
        await collection.insertOne(session)
        console.log("Session saved successfully.")
    } catch (error) {
        console.error("Error saving session:", error)
    }
}

async function getSession() {

}

async function deleteSession() {

}