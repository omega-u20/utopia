const { MongoClient } = require('mongodb');
const db_pass = process.env.DB_PASS; 

async function login(username, password) {
    const uri = `mongodb+srv://prodev:${db_pass}@clusterdev.owm1unr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDev`;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('TCC');
        const users = db.collection('Utopia');
        const user = await users.findOne({ username, password});
        return user !== null;
    } catch (error) {
        console.error('Error during login:', error);
        return user !== null;
    }finally {
        await client.close();
    }
}

async function getInfo (username, password){

}

module.exports = { login };