const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config({ path: "./config.env" });
const port = process.env.PORT 

//use middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());

//mongodb connection
const con = require('./db/connection.js');

//using routes
app.use(require('./routes/route.js'));

//----------------DEPLOYMENT-------------------//
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

//----------------DEPLOYMENT-------------------//

con.then(db => {
    if (!db) return process.exit(1);

    //listen to the http server
    app.listen(port, () => {
        console.log(`Server is running on port: http://localhost:${port}`);
    })

    app.on('error', err => console.log(`Failed to Connect with HTTP Server: ${err}`));
    //error in mongo connection
}).catch(error => {
    console.log(`Connection failed...! ${error}`)
})
