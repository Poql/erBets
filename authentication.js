"use strict"

const passport = require("passport")
const FacebookTokenStrategy = require("passport-facebook-token")
const config = require("./config")

class Authentication {
	constructor() {}

	initialize() {
		return passport.initialize()
	}

	use(verify) {
		passport.use(new FacebookTokenStrategy(config.facebookAuthentication, verify))
	}

	middleware(req, res, next) {
		passport.authenticate('facebook-token', { session: false }, (error, user) => {
			if (!user || error) {
				console.log("Facebook access token authentication failed")
				return res.sendStatus(401)
			} else {
				console.log("Facebook access token authentication succeed")
				req.login(user, { session: false }, (loginErr) => {
					if (loginErr) {
						console.log("Facebook login failed " + loginErr)
						return res.sendStatus(401)
					}
					console.log("Facebook login succeed")
					return next()
				})
			}
		})(req, res, next)
	}
}

module.exports = Authentication
