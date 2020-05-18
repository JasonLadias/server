const http = require('http');

const express = require('express');
const bodyParser = require('body-parser')


const app = express();

const Routes = require('./routes/routes')

app.use(bodyParser.urlencoded({extended:true}))

app.use(Routes)

app.use((req, res, next) => {
    res.send(JSON.stringify({status : "Error", type : "1", reason : "Bad Endpoint Request"}))
});


app.listen(3000)
