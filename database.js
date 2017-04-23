"use strict"

class Database {
	constructor() {
		this.users = []
	}

	findOrCreateUser(accessToken, profile, callback) {
		console.log("Looking for user " + profile.id + "with access token : " + accessToken)
		for (var i = 0; i < this.users.length; i++) {
			var user = this.users[i]
			if (user.id == profile.id) {
				console.log("Found registered user " + user)
				// we refresh the token
				user.token = accessToken
				this.users[i] = user
				callback(user)
				return
			}
		}
		let newUser = {
			email : "",
			name : profile.name.givenName + ' ' + profile.name.familyName,
			id : profile.id,
			token : accessToken
		}
		this.users.push(newUser)
		console.log("Creating new user " + newUser)
		callback(newUser)
	}

	getAllUsers(callback) {
		callback(this.users)
	}
}

module.exports = Database
