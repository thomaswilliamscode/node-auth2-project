const { JWT_SECRET } = require("../secrets"); // use this secret!
const Helper = require('../Helpers/helpers')
const User = require('../users/users-model')

const restricted = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    
  }
  /*
    If the user does not provide a token in the Authorization header:
    status 401
    {
      "message": "Token required"
    }

    If the provided token does not verify:
    status 401
    {
      "message": "Token invalid"
    }

    Put the decoded token in the req object, to make life easier for middlewares downstream!
  */
    console.log('in resrticted auth middleware')
    next()
}

const only = role_name => (req, res, next) => {
  /*
    If the user does not provide a token in the Authorization header with a role_name
    inside its payload matching the role_name passed to this function as its argument:
    status 403
    {
      "message": "This is not for you"
    }

    Pull the decoded token from the req object, to avoid verifying it again!
  */
  next()
}


const checkUsernameExists = async (req, res, next) => {
  /*
    If the username in req.body does NOT exist in the database
    status 401
    {
      "message": "Invalid credentials"
    }
  */
 const { username } = req.body
 if(username) {
  const answer = await User.findBy({ username });
  req.user = answer;
  next()
 } else {
  res.status(401).json({message: 'Invalid credentials'})
 }
}


const validateRoleName = (req, res, next) => {
  const {role_name} = req.body
  // If the role_name in the body is valid, set req.role_name to be the trimmed string and proceed.
  if (role_name && req.role_name.trim()) {
    req.role_name = req.role_name.trim()

    // If role_name is 'admin' after trimming the string:
    // status 422
    // {
    //   "message": "Role name can not be admin"
    // }
    if (req.role_name === 'admin') {
      res.status(422).json({message: 'Role name can not be admin'})

    //   If role_name is over 32 characters after trimming the string:
    // status 422
    // {
    //   "message": "Role name can not be longer than 32 chars"
    // }
    } else if (req.role_name.length > 32) {
      res.status(422).json({message: 'Role name can not be longer than 32 chars'})
    }
  } else {
    // If role_name is missing from req.body, or if after trimming it is just an empty string,
    // set req.role_name to be 'student' and allow the request to proceed.
    req.role_name = 'student'
  }

  next()
  /*
  */
}

module.exports = {
  restricted,
  checkUsernameExists,
  validateRoleName,
  only,
}
