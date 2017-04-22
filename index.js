"use strict"
const Express = require("express") 
const FacebookTokenStrategy = require("passport-facebook-token")
const Database = require("./database")
const BodyParser = require("body-parser")
const passport = require("passport")
const config = require("./config")
const morgan = require("morgan")

const database = new Database()

passport.use(new FacebookTokenStrategy(
	config.facebookAuthentication, 
	(accessToken, refreshToken, profile, done) => {
		console.log("Checking facebook authentication for user " + profile.id + "with access token " + accessToken)
		database.findOrCreateUser(accessToken, profile, (user, error) => {
			console.log("Facebook authentication check done")
			return done(error, user);
		})
	})
)

const app = new Express()

const jsonParser = BodyParser.json()
const urlencodedParser = BodyParser.urlencoded({ extended: false })

app.use(morgan('combined'))
app.use(jsonParser)
app.use(urlencodedParser)
app.use(passport.initialize())

// respond with "hello world" when a GET request is made to the homepage
app.get("/", function(req, res) {
  res.send("hello world")
})

app.post("/facebook_token", function(req, res) { 
	passport.authenticate('facebook-token', { session: false } , function(error, user, info) {
		if (error) {
			console.log("Facebook access token failed")
			res.sendStatus(401)
		} else {
			console.log("Facebook access token succeed")
			res.sendStatus(200)
		}
	})(req, res)
})

app.get("/error", (req, res) => {
	console.log("Failure redirection")
	res.sendStatus(401)
})

app.get("/me", passport.authenticate("facebook-token",  { session: false }), function(req, res) {
	res.send({ user : req.user })
})

app.get("/allUsers", function(req, res) {
	database.getAllUsers((users, err) => {
		res.send({users : users})
	})
})

app.listen(8888)