import express from 'express';
require('dotenv').config();
import bodyParser from 'body-parser';

import { connectToDB, getDB } from './config/connectDB';
import initDBUser from './route/user';
import initDBExam from './route/exam';

const app = express();

// CORS configuration
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.PORT_FONTEND_EXAM_APP);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Body parser middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Initialize routes
initDBUser(app);
initDBExam(app);

let port = process.env.PORT || 8080;

// Connect to the database
let db;
connectToDB((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
        db = getDB();
    }
});
