const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

//const URI = "mongodb+srv://admin:admin@eventslog.oghro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const URI = process.env.URI;
const mongo = new MongoClient(URI);

mongo.connect((err) => { if(err) { console.log(err) } });

async function createLog (log) {
    try{
        const result = await mongo.db("LogActivity").collection("Log").insertOne(log);
        return(result.insertedId);
    } catch (e) {
        console.log(e);
    }
}

async function updateLog (id, log) {
    console.log(log);
    console.log(typeof id);
    console.log(typeof log);
    //console.log(ObjectId(id));
    try{
        const result = await mongo.db("LogActivity").collection("Log").updateOne({_id: ObjectId(id)}, {$push: log});
        console.log(result);
    } catch (e) {
        console.log(e);
    }
}

module.exports = {createLog, updateLog};