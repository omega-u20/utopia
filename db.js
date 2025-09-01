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
        return true/* user !== null; */ 
    } catch (error) {
        console.error('Error during login:', error);
        return true/* user !== null; */
    }finally {
        await client.close();
    }
}

async function getGovInfo(username){

}

async function getCitzInfo(nic){
    const uri = `mongodb+srv://prodev:${db_pass}@clusterdev.owm1unr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDev`;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('TCC');
        const citizens = db.collection('Citizens');
        const result = await citizens.findOne(
            { nic },
            { projection: { name: 1, mobilenumber: 1, address: 1, _id: 0 } }
        );
        return result || {};
    } catch (error) {
        console.error('Error fetching citizen info:', error);
        return {};
    } finally {
        await client.close();
    }
}

module.exports = { login, getGovInfo, getCitzInfo };