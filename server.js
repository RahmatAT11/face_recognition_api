import express from "express";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import knex from "knex";
import register from "./controllers/register.js";
import signin from "./controllers/signin.js";
import profile from "./controllers/profile.js";
import image from "./controllers/image.js";

const postgres = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: '341256',
        database: 'smart-brain'
    }
});

// const knex = require('knex')({
//     client: 'mysql',
//     connection: {
//       host : '127.0.0.1',
//       port : 3306,
//       user : 'your_database_user',
//       password : 'your_database_password',
//       database : 'myapp_test'
//     }
// });

const app = express();
app.use(express.json());
app.use(cors());

app.post('/signin', 
(req, res) => {signin(req, res, postgres, bcrypt)});

app.post('/register', 
(req, res) => {register(req, res, bcrypt, postgres)});

app.get('/profile/:id', 
(req, res) => {profile(req, res, postgres)});

app.put('/image', 
(req, res) => {image(req, res, postgres)});


app.listen(process.env.PORT || 3001, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});