var Post = require('../models/postSchema');

module.exports.profile = function(req,res){
	res.render('index',{title:'Profile',linkHome:'/',nameHome:'LawyerHub'});
};
module.exports.createPost = function(req,res){
	var sess = req.session;
	//check session existed
	if(sess.emailid){
		console.log(req.body.subject+'||'+req.body.description+'||'+req.body.contactno);
		var postData = {'subject':req.body.subject,
		'description':req.body.description,
		'emailid':sess.emailid,
		'contactno':''+req.body.contactno,
		'postedDate':new Date()
		};
		for(var key in postData){
			if(!postData.hasOwnProperty(key)){
				return res.json({'status':'400','msg':'Some fields are missing. Please Fill all the fields.'});
			}
		}
		var newPost = new Post(postData);
		newPost.save(function(error){
			if(error){
				console.log(error);
				return res.json({'status':'500','msg':'Internal Server Error: your post cannot be published. Please Try again later.'});
			}
			else{
				return res.json({'status':'OK','msg':'we have received your post and it will soon be published. Thank you!'});
			}
		});
	}
	else{
		return res.json({'status':'500','msg':'Your session is out. Please login again to proceed.'});;
	}
};
module.exports.recentPosts = function(req,res){
	var sess = req.session;
	if(sess.emailid){
		var query = Post.find();
		query.limit(20);
		query.sort({'posteddate': -1});
		query.lean().exec(function(error,posts){
			if(error){
				console.log(error);
				return res.json({'status':500,'msg':'Sorry cannot load the feed for now!'});
			}
			else{
				return res.json({'status':'OK', 'posts':posts});
			}
		});
	}
	else{
		return res.json({'status':'500','msg':'Your session is out. Please login again to proceed.'});
	}
};
module.exports.myPostsFetch = function(req,res){
	var sess = req.session;
	if(sess.emailid){
		console.log("Getting Post data:::"+sess.emailid);
		var query = Post.find({'emailid':sess.emailid});
		query.limit(20);
		query.sort({'posteddate': -1});
		query.lean().exec(function(error,posts){
			if(error){
				console.log(error);
				return res.json({'status':500,'msg':'Sorry cannot load the feed for now!'});
			}
			else{
				return res.json({'status':'OK', 'posts':posts});
			}
		});
	}
	else{
		return res.json({'status':'500','msg':'Your session is out. Please login again to proceed.'});
	}
};
module.exports.myPosts = function(req,res){
	var sess = req.session;
	if(sess.emailid){
		return res.render('myposts',{title:'Dashboard',linkHome:'/',nameHome:'LawyerHub',userName:sess.emailid,apName:'Create Post',apLink:'/dashboard/'+sess.type});
	}
	else{
		return res.render('invalid',{title:'Error',linkHome:'/',nameHome:'LawyerHub','status':'500','msg':'Your session is out. Please login again to proceed.',invalidHeader:'Session expired',invalidDescription:'Your session is expired please login again to proceed.'});
	}
};
module.exports.dashboard = function(req,res){
	//res.render('dashboard',{title:'Dashboard',linkHome:'/',nameHome:'LawyerHub',userName:'Dummy'});
	var sess = req.session;
	//check session existed
	if(sess.emailid && sess.type == req.params.userType){
		//res.render('dashboard',{title:'Dashboard',linkHome:'/',nameHome:'LawyerHub',userName:sess.emailid});
		//if user is lawyer
		if(sess.type == 'lawyer'){
			res.render('dashboard',{title:'Dashboard',linkHome:'/',nameHome:'LawyerHub',userName:sess.emailid,apName:'Recent Posts',apLink:'/dashboard/lawyer'});
		}
		//if user is client
		else{
			res.render('dashboardc',{title:'Dashboard',linkHome:'/',nameHome:'LawyerHub',userName:sess.emailid,apName:'My Posts',apLink:'/dashboard/client/myposts',makePostButtonLink:'/dashboard/createPost',makePostButtonName:'Create Post'});
		}
	}
	//otherwise redirect to home
	else{
		res.redirect('/');
	}
};
