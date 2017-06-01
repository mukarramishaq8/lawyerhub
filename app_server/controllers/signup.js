var User = require('../models/userSchema');
var emailController = require('./emailController');
module.exports.signup = function(req,res){
	var userType = req.params.userType;
	//console.log('sh'+req.params['userType']);
	if(userType == 'lawyer'){
		//console.log('-----> ut:'+userType);
		res.render('signup',{title:'Signup',linkHome:'/',nameHome:'LawyerHub',userType:'lawyer',inverseUserType:'client'});
	}
	else{
		//console.log('!!!!!-----> ut:');
		res.render('signup',{title:'Signup',linkHome:'/',nameHome:'LawyerHub',userType:'client',inverseUserType:'lawyer'});
	}
};
module.exports.action = function(req,res){
	var user = {firstname:req.query.firstname,lastname:req.query.lastname,
				emailid:req.query.email,password:req.query.password,type:req.query.userType
			};
	//resData = {};
	//console.log(req.query.email);
	User.findOne({'emailid':user.emailid},function(err,usr){
		if(err) res.json({'status':'300','msg':'Internal Server error. Please try again later'});
		else if(!usr){
			console.log(';;;;;;DOES nOT exists!!!!!');
			var flag = false;
			for(var x in user){
				if(!user.hasOwnProperty(x)){
					//resData = {'status':'400','message':'Invalid data'};
					flag = true;
					break;
				}
				console.log(x+':'+user[x]);
			}
			if(!flag){
				var newUser = new User(user);
				var sess = req.session;
				sess.user = newUser;
				//first send verifcation email
				if(emailController.sendEmail(req,res)){
					return res.json({'status':'OK','msg':'We have sent a verification link to your email address. Please check your email to confirm the sign up.'});
				}
				else{
					req.session = null;
					return res.json({'status':'300','msg':'Internal Server error: Please try again later'});
				}
				/*newUser.save(function(err){
					if(err){
						console.log('internal server error: '+err);
						res.json({'status':'300','msg':'Internal Server error: Error during saving your details!'});
					}
					else{
						console.log('successfull');
						res.json({'status': 'OK','isSuccessful':true,'msg':'Sign up successful!'});
						//return res.redirect('/login/'+user.type);
					}
			
				});*/
			}
			else{
				console.log('invalid data');
				res.json({'status':'400','msg':'Invalid data'});
			}
		}
		else{
			console.log(';;;;;;Already exists!!!!!');
			res.json({'status':'500','msg':'User with this email address already exists'});
		}
	});
	
	//console.log('hahaha');
};
