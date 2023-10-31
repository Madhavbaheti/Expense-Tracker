const mongoose = require('mongoose');
const express = require("express");
const session = require('express-session');
const app = express();
const cors = require('cors');
const port = 5000;
const MongoDb = async() => {
    await mongoose.connect('mongodb://localhost:27017/admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then( ()=> {
        console.log("Database Connected")
    }
    )
    .catch((err)=> {
        console.log(err)
    })
}
MongoDb();
app.use(cors());
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

app.use(express.json());
app.use("/", require("./Routes/createuser"));
app.use("/",require("./Routes/dataFetch"))
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  }))