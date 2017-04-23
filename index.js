"use strict"
const Express = require("express") 
const FacebookTokenStrategy = require("passport-facebook-token")
const Database = require("./database")
const BodyParser = require("body-parser")
const config = require("./config")
const morgan = require("morgan")
const Authentication = require("./authentication")

const database = new Database()
const authentication = new Authentication()
const app = new Express()
const jsonParser = BodyParser.json()
const urlencodedParser = BodyParser.urlencoded({ extended: false })

app.use(morgan('combined'))
app.use(jsonParser)
app.use(urlencodedParser)
app.use(authentication.initialize())

authentication.use((accessToken, refreshToken, profile, done) => {
		console.log("Checking facebook authentication for user " + profile.id + "with access token " + accessToken)
		database.findOrCreateUser(accessToken, profile, (user, error) => {
			console.log("Facebook authentication check done")
			return done(error, user);
		})
	}
)

// MARK: - Public API

// respond with "hello world" when a GET request is made to the homepage
app.get("/", function(req, res) {
  res.send("hello world")
})

app.get("/allUsers", function(req, res) {
	database.getAllUsers((users, err) => {
		res.send({users : users})
	})
})

app.post("/facebook_token", authentication.middleware, (req, res) => {
	res.send({sucess : true})
})

// MARK: - Authenticated API

const apiRoutes = new Express.Router()

apiRoutes.use(authentication.middleware)

apiRoutes.get("/me", (req, res) => {
	console.log("Sending user profile " + req.user)
	res.send({ user : req.user })
})

app.use("/api", apiRoutes)

app.listen(8888)