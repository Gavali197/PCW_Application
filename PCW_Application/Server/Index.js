const express = require("express");
const dbConnect = require("./utils/Db");
const app = express();
require("dotenv").config()
const PORT = 3030
const Session = require("express-session")

dbConnect();

// app.use("/api/v1", router)
app.use(express.json())
app.use(express.urlencoded({extended : true}));
app.use(Session({
    secret : "GameOfThrons",
    resave: false,
    saveUninitialized : true
}))

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
})
