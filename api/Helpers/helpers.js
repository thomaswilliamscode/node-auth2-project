const { JWT_SECRET } = require('../secrets/index')
const jwt = require('jsonwebtoken')

const buildToken = (user) => {
	const payload = {
		subject: user.id,
		username: user.username,
		role_name: user.role
	}
	const options = {
		expiresIn: '1d'
	}
	return jwt.sign( payload, JWT_SECRET, options)
}

module.exports = {
	buildToken
}