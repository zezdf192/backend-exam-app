import { MongoClient, ServerApiVersion } from 'mongodb';
require('dotenv').config();

let dbConnection;

export const connectToDB = (cb) => {
    MongoClient.connect(process.env.MONGODB_APP, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    })
        .then((client) => {
            dbConnection = client.db('test_app');
            return cb();
        })
        .catch((err) => {
            return cb(err);
        });
};

export const getDB = () => dbConnection;
