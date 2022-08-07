/* START OF SETTINGS */

// imports
const express = require('express');
const { link } = require('fs/promises');
const mongoose = require('mongoose');
const router = require('./feature/aboutlink');
const dbhandler = require('./handler/db');
const app = express();

// port for server
const port = 80;

// connect db
mongoose.connect('mongodb://localhost/url-shortener', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use('/linkinfo', router);
app.engine('ejs', require('ejs').__express);
app.use(express.urlencoded({ extended: false }));

/* END OF SETTINGS */

/* START OF FRONT-SITE */

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

/* END OF FRONT-SITE */

// the most important things
app.post('/shorten', async (req, res) => {
	// set var value if nsfw checkbox on or off
	var checkernsfw;
	if (req.body.isnsfw == "on") {
		var checkernsfw = 'true';
	} else {
		var checkernsfw = 'false';
	}
	// because if create a second link with same url to redirect, they will go to the first link
	// fix:
	// generate random link id
	const linkidgenerate = Math.random().toString(36).slice(2, 7);
	// save the linkidgenrate because if the varible got defined it will changed
	const resultlink = linkidgenerate;
	// yeah, you know the testing stereotypes
	console.log(resultlink);
	// save to database
	const record = new dbhandler({
		redirectto: req.body.cut,
		nsfw: checkernsfw,
		url: resultlink
	});
    await record.save();
	res.render('yourshortlink', { resultlink });
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
