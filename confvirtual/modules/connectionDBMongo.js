const { MongoClient } = require('mongodb');
const URI = "mongodb+srv://admin:admin@eventslog.oghro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const mongo = new MongoClient(URI);

mongo.connect((err) => { if(err) { console.log(err) } });

async function createlog (log) {
    try{
        const result = await mongo.db("LogActivity").collection("Log").insertOne(log);
        console.log(result.insertedId);
        return(result.insertedId);
    } catch (e) {
        console.log(e);
    }
}

async function updateLog (log) {
    try{
        const result = await mongo.db("LogActivity").collection("Log").insertOne(log);
    } catch (e) {
        console.log(e);
    }
}

module.exports = createlog, updateLog;