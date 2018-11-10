
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

router.get('/', function(req,res){
	res.render("homepage");
})
router.get('/register' ,  function(req,res){
	res.render("register");
})
//router.get()
router.post('/register', function(req,res){
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password1 = req.body.password1;
	var typeOfUser;
	if(req.body.personal){
		typeOfUser = 'personal';
	}else{
		typeOfUser = 'company';
	}
	//console.log(req.body);
	req.checkBody('username', 'Yêu cầu tên').notEmpty();
	req.checkBody('email', 'Yêu cầu email').notEmpty();
	req.checkBody('password', 'Yêu cầu password').notEmpty();
	req.checkBody('password1', 'Yêu cầu password').notEmpty();
	req.checkBody('password1', 'Password không trùng').equals(req.body.password);

	var errors = req.validationErrors();
	console.log(errors);
	if(errors){
		res.render('register',{
			errors : errors,
		})
		console.log(req.body);
	}else{
		User.isNameShake(username, email, function(err, isShake){
			if(err) throw error;
			console.log("isShake la "+isShake);
			if(isShake) {
				console.log("chay den day 1");
				req.flash("error_msg", "Trùng tên hoặc email!");
				res.redirect('/users/register');
			}else{
				console.log("chay dehn day2")
				var newUser = new User({
					username: username,
					email: email,
					password: password,
					typeOfUser: typeOfUser,
				});
				User.createUser(newUser, function(err, user){
					if(err) throw err;
					console.log(user);
				});
				req.flash('success_msg', "Đăng ký thành công, bạn có thể đăng nhập");
				res.redirect('./');
			}
		})
	}

})

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username, function(err, user){
    	if(err) throw err;
    	if(!user){
    		return done(null, false, {message:"Tài Khoản không tồn tại"});		
    	}else
    	User.comparePassword(password, user.password,function(err,isMatch){
    		if(err) throw err;
    		if(isMatch){
    			return done(null,user);
    		}else{
    			return done(null, false, {message:"Sai mật khẩu"});
    		}
    	})
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.get('/login', function(req,res){
	res.render("login");
})

router.post('/login', passport.authenticate('local', {successRedirect:"/",failureRedirect:"/users/login"}),
	function(req,res){
		//req.flash("")
		res.redirect('/');
	}
)
router.get('/logout', function(req,res){
	req.logout();
	req.flash('success_msg','Bạn đã đăng xuất');
	res.redirect('/users/login');
})
module.exports = router;
