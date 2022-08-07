// imports
const { query } = require('express');
const isEmpty = require('lodash.isempty');
const socket = require('socket.io');
const express = require('express');
const mongoose = require('mongoose');
const router = require('./handler/feature/seeredirect');
const dbhandler = require('./handler/db');
const { db } = require('./handler/db');
const app = express();

// port for server
const port = 80

// connect db
mongoose.connect('mongodb://localhost/url-shortener', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

// settings
app.set('view engine', 'ejs');
app.use('/linkinfo', router)
app.engine('ejs', require('ejs').__express);
app.use(express.urlencoded({ extended: false }))

// homepage
app.get('/', async (req, res) => {
	res.render('index');
})

// rules and stuff
app.get('/things', (req, res) => {
	res.render('things');
})

// about
app.get('/about', async (req, res) => {
	res.render('about', { numlink: await dbhandler.find().count() });
})


// host to 
app.post('/shorten', async (req, res) => {
	var checkernsfw;
	if (req.body.isnsfw == "on") {
		var checkernsfw = 'true';
	} else {
		var checkernsfw = 'false';
	}
	const record = new dbhandler({
		redirectto: req.body.cut,
		nsfw: checkernsfw
	});
    await record.save();
	const wool = await dbhandler.findOne({ redirectto: req.body.cut });
	res.render('yourshortlink', { thelink: wool });
})

// redirect
app.get('/:link', async (req, res) => {
	const find = await dbhandler.findOne({ url: req.params.link });
	if (!find) return res.status(404);
	find.clicks++;
    await find.save();
	if (find.nsfw == "true") {
		res.render('nsfwwarning', { hornyenable: find.redirectto });
	} else {
		res.redirect(find.redirectto);
	}
})

// see redirect to
router.get('/:linkinfo', async (req, res) => {
	const findlinkredir = await dbhandler.findOne({ url: req.params.linkinfo });
	if (findlinkredir.redirectto == null) return res.status(404);
	res.send('<pre>The shortlink will redirect to <a href="' + findlinkredir.redirectto + '">' + findlinkredir.redirectto + '</a></pre><pre>clicked: ' + findlinkredir.clicks + ' times </pre><pre>nsfw: ' + findlinkredir.nsfw + '</pre>');
})

// up and running
app.listen(port);