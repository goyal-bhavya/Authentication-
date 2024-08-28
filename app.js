require('dotenv').config()
const express = require('express');
const PORT = process.env.PORT || 8000;
const bodyParser = require('body-parser');
const createError = require('http-errors');
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const app = express();


main().catch(e => console.log(e)).then(() => console.log("Database connected !!!"));
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/refreshT');
}



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

app.use("/api" ,auth );


app.use((err ,req , res , next) => {
    console.log(err);
    res.send({error : err.message})
})


app.listen(PORT , () => {
    console.log(`Listening on PORT : ${PORT}`)
})