const router = require("express").Router();
const bcrypt = require('bcryptjs')

const { checkUsernameExists, validateRoleName } = require('./auth-middleware');
const { JWT_SECRET, BCRYPT_ROUNDS } = require("../secrets"); // use this secret!
const Helper = require('../Helpers/helpers')
const Users = require('../users/users-model')
const db = require('../../data/db-config.js');

router.post("/register", validateRoleName, async (req, res, next) => {
  const { username, password, role_name } = req.body
  // hash password 
  const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS)
  const newPassword = hash
  const newUserInfo = await Users.add({username, password: newPassword, role_name: req.role_name})
  const findNewUser = await Users.findByUsername(username)
  res.status(201).json(findNewUser)
  /**
    [POST] /api/auth/register { "username": "anna", "password": "1234", "role_name": "angel" }

    response:
    status 201
    {
      "user"_id: 3,
      "username": "anna",
      "role_name": "angel"
    }
   */
});


router.post("/login", checkUsernameExists, (req, res, next) => {
  let { username, password } = req.body

  Users.findBy(username)
    .then( (user) => {
      console.log('user', user)
      if (user && bcrypt.compareSync( password, user.password ) ) {
        const token = Helper.buildToken(user)
        res.status(200).json({message: `${user.username} is back!`, token})
      } else {
        res.status(401).json({message: 'Invalid Credentials!'})
      }
    })


  /**
    [POST] /api/auth/login { "username": "sue", "password": "1234" }

    response:
    status 200
    {
      "message": "sue is back!",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ETC.ETC"
    }

    The token must expire in one day, and must provide the following information
    in its payload:

    {
      "subject"  : 1       // the user_id of the authenticated user
      "username" : "bob"   // the username of the authenticated user
      "role_name": "admin" // the role of the authenticated user
    }
   */
});

module.exports = router;
