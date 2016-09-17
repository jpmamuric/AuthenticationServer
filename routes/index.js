var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportService = require('../services/passport');

const Authentication = require('../controllers/authentication');
// setting session to false, rejects default cookie based session creation
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

/* GET home page. */
router.get('/', requireAuth ,function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', requireLogin, Authentication.login);
router.post('/signup', Authentication.signup);


module.exports = router;
