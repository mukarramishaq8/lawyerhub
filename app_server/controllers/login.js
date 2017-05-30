var User = require('../models/userSchema');
module.exports.login = function(req,res){
	var userType = req.params.userType;
	//console.log(req.params.userType);
	if(userType == 'lawyer'){
		//console.log('-----> ut:'+userType);
		res.render('login',{title:'Login | LawyerHub',linkHome:'/',userType:'lawyer',inverseUserType:'client'});
	}
	else{
		//console.log('!!!!!!!-----> ut:'+userType);
		res.render('login',{title:'Login | LawyerHub',linkHome:'/',userType:'client',inverseUserType:'lawyer'});
	}
};
module.exports.loginVerifier = function(req,res){
	//first check the all fields have data and then take measures for sql injection, for the time being it is not implemented yet
	User.findOne({'emailid':req.query.email,'type':req.query.type},function(err,user){
		if(err) throw err;
		if(!user){
			res.json({'status':'400','msg':'This email is registered as '+user.type+'. So change login type to get access.'});
		}
		else{
			user.comparePassword(req.query.password,function(err,isMatch){
				if(err){
					res.json({'status':'500','msg':'Error during verification. Please try again later'});
				}
				else{
					if(isMatch){
						console.log('successfull login');
						//set a cookie with the user information
						//req.session.user = user;
						res.json({'status':'OK','msg':'Login Successful'});
					}
					else{
						res.json({'status':'400', 'msg':'Incorrect password!'});
					}
				}
			});
		}
	});
};
