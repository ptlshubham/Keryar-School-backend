const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const chat = require('./src/routes/chat');

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: "1319778",
  key: "7ccfdfbf0b0dc54aa9e6",
  secret: "30bfd19be74ca0dd945f",
  cluster: "ap2",
  useTLS: true
});



const cors = require("cors");
var corsoption={
    origin: "*",
   // origin:"https://portal.csquare.org.in"
    // origin: "http://localhost:4300"
}
app.use(cors(corsoption));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const adminRoutes = require('./src/routes/admin');
const userRoutes = require('./src/routes/user');
 const auth = require('./src/routes/authenticate');
 const msg = require('./src/routes/message');

// parse application/x-www-form-urlencoded

app.use(express.static('public'));

//Serves all the request which includes /images in the url from Images folder
app.use('/images', express.static(__dirname + '/images'));


//const DbConnectionString = 'mssql://'+ process.env.SQL_USER +':'+ process.env.SQL_PASSWORD +'@192.168.1.112:54161/'+process.env.SQL_DATABASE;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin , X-Requested-With, Content-Type, Accept, Authorization');
    if (res.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});
app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
 app.use("/authenticate",auth);
 app.use("/pusher",msg);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status(404);
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            massage: error.message
        }
    });
});

module.exports = app;