
const express = require("express");
const cors = require("cors");

const app= express();  

app.use(cors());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*"); //Autorizo recibir solicitudes de este dominio
    res.header('Access-Control-Allow-Credentials', true); //Autorizo recibir solicitudes que incluyan el encabezado con credenciales
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); //Autorizo recibir solicitudes con dichos hedears
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE'); //Autorizo las solicitudes tipo GET, POST, OPTIONS, PUT y DELETE.
    next();
});

// server.use(morgan("dev"));

app.use(express.json());

// app.use(mainRouter); // te permite modularizar tus routes.

module.exports = {app,express}; 