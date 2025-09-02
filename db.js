import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import e from 'express';
dotenv.config();

const db_pass = process.env.DB_PASS;

export async function login(username, password) {
    const uri = `mongodb+srv://prodev:${db_pass}@clusterdev.owm1unr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDev`;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('TCC');
        const users = db.collection('Utopia');
        const user = await users.findOne({ username, password });
        return true/* user !== null; */;
    } catch (error) {
        console.error('Error during login:', error);
        return true/* user !== null; */;
    } finally {
        await client.close();
    }
}

export async function getGovInfo(username) {

}

export async function getCitzInfo(nic) {
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

export async function citzSignup(nic, fullName, email, password, address, phone) {
    const uri = `mongodb+srv://prodev:${db_pass}@clusterdev.owm1unr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDev`;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('TCC');
        const citizens = db.collection('Citizens');
        const existingUser = await citizens.findOne({ nic });
        if (existingUser) {
            return { success: false, message: 'User already exists' };
        }else {
            await citizens.insertOne({ nic, name: fullName, email, password, address, mobilenumber: phone });
            return { success: true, message: 'User registered successfully' };
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return { success: false, message: 'Error during signup' };
    } finally {
        await client.close();
    }

}