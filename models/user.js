var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = mongoose.Schema({
	username: {
		type: String,
	},
	password:{
		type: String,
	},
	email:{
		type: String,
	},
	typeOfUser:{
		type: String,
	}
});

var User = module.exports = mongoose.model('User', UserSchema);
module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err,salt){
		bcrypt.hash(newUser.password, salt, function(err,hash){
			newUser.password = hash,
			newUser.save(callback);
		});
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username : username};
	User.findOne(query, callback);
}
module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}
module.exports.comparePassword = function(candidate, hash, callback){
	bcrypt.compare(candidate, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
});
}

module.exports.isNameShake = function(username, email, callback){
	User.find({ $or: [{username : username}, {email : email}] }, function(err, result){
		console.log(result.length);
		if(err) return callback(true, null);
		if(result.length > 0) {
			return callback(null, true);
		}else{
			return callback(null, false);
		}
	})
}