require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const expressLayout = require('express-ejs-layouts');
const web = require('./routes/web');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');

// Database connection
const url = 'mongodb://localhost:27017/pizza';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection
	.once('open', () => {
		console.log('Database Connected');
	})
	.catch((error) => console.log('connection failed'));

// Initilise app
const app = express();

// Session Config
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoDbStore.create({
			mongoUrl: url
		}),
		cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
	})
);

// Express flash
app.use(flash());

// Public Directory
app.use(express.static('public'));

// Set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// All the Routes
require('./routes/web')(app);

// Port selection
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
