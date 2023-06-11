require('dotenv').config({
    path: `.env`
});
const express = require('express')
const bodyParser = require('body-parser')
const API = require('./src/api/Routers')
const cors = require('cors');
const session = require('express-session');

const app = express()
app.set("trust proxy", 1);
// Koristi cors za dev
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    preflightContinue: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({
    extended: true,
    limit: '25mb'
}));

app.use(session({
    name: 'sid', // cookie se salje s vrijednosti sid(session id)
    secret: 'moj tajni password je najbolji',
    resave: false, // uvijek ponovno spremi session iako se nije promjenil nijedan podatak
    saveUninitialized: false, // spremi session iako jos nije nista promjenjeno na njoj, primjer korisnik se jos nije logiral, a i dalje ga pratimo prije
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // cookie is valid for 24h
        secure: false, // secure mora biti https konekcija (bilo bi true, ali se koristi prod za spajanje s vanjskom bazom)
        httpOnly: process.env.NODE_ENV === 'production', // don't allow cookies to be read with javascript on the client
    }
}));

API(app)

app.listen(5000, () => { console.log("Server started on port 5000") })