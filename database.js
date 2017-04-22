"use strict"

class Database {
	constructor() {
		this.users = []
	}

	findOrCreateUser(accessToken, profile, callback) {
		console.log("Looking for user " + profile.id + "with access token : " + accessToken)
		this.users.forEach((user) => {
			if (user.id == profile.id) {
				console.log("Found registered user " + user)
				callback(user)
				return
			}
		})
		let user = {
			email : "",
			name : profile.name.givenName + ' ' + profile.name.familyName,
			id : profile.id,
			token : accessToken
		}
		this.users = [user]
		console.log("Creating new user " + user)
		callback(user)
	}

	getAllUsers(callback) {
		callback(this.users)
	}
}

module.exports = Database
