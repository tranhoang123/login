var express = require('express');
var router = express.Router();

router.get('/', ensureAuthenticated, function(req,res){
	console.log(req)
	res.render("userpage", {
		user : req.user.username,
	});
})

function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect('./users')
	}
}
module.exports = router;
