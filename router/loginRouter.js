const express = require('express');
const { getLogin, login, logout } = require('../controller/loginController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const { doLoginValidatores, doLoginValidationHandler } = require('../middlewares/login/loginValidators');
const { redirectLoggedIn } = require('../middlewares/common/checkLogin');

const router = express.Router();

const page_title = "Login"

router.get('/', decorateHtmlResponse(page_title) , redirectLoggedIn ,getLogin )

//Login to the inbox
router.post('/' , decorateHtmlResponse(page_title)  , doLoginValidatores , doLoginValidationHandler ,   login  )

router.delete('/' , logout )


module.exports = router ;