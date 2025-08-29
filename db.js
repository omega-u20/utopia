const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
require('dotenv');
const key = process.env.KEY;
const db_password = process.env.DB_PASS;

// MongoDB connection
mongoose.connect(`mongodb+srv://prodev:${db_password}@clusterdev.owm1unr.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDev`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String, // 'gov' or 'citz'
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: key,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoose.connection._connectionString }),
}));

exports.User = User;   