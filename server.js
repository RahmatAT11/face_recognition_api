import express from "express";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import knex from "knex";
import register from "./controllers/register.js";
import signin from "./controllers/signin.js";
import profile from "./controllers/profile.js";
import image from "./controllers/image.js";

const port = process.env.PORT || 3000

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const domainsFromEnv = process.env.CORS_DOMAINS || ""

const whitelist = domainsFromEnv.split(",").map(item => item.trim())

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

const postgres = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
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
app.use(cors(corsOptions));

app.get('/', 
(req, res) => {res.send('app is working')});

app.post('/signin', 
(req, res) => {signin(req, res, postgres, bcrypt)});

app.post('/register', 
(req, res) => {register(req, res, bcrypt, postgres)});

app.get('/profile/:id', 
(req, res) => {profile(req, res, postgres)});

app.put('/image', 
(req, res) => {image(req, res, postgres)});


app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});