const express = require('express');
const { getUsers, addUser, deleteUser } = require('../controller/usersController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const avatarUpload = require('../middlewares/users/avatarUpload');
const { addValidators, addValidationHandler } = require('../middlewares/users/userValidators');
const { checkLogin, requireRole } = require('../middlewares/common/checkLogin');

const router = express.Router();
const page_title = "User"



router.get('/', decorateHtmlResponse(page_title) , checkLogin  , requireRole(['admin'])  , getUsers )

//create users
router.post('/' ,avatarUpload , addValidators , addValidationHandler , addUser  )

//delete user

router.delete('/:id', deleteUser )

// hey bthere whats auu
module.exports = router ;