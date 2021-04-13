const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@studymern.cpgwk.mongodb.net/mern?retryWrites=true&w=majority`;
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});


app.use(bodyParser.json());


const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Express server runs on port ${port}`);
});
