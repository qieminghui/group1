//检查用户登陆
function checkLogin(req,res,next){
	if(req.session.user){//用户已经登陆
		next();
	}else{//用户没有登陆
		req.flash("error","当前操作只有用户登陆后才能操作，请登陆")
		res.redirect("/user/login")
	}
}

//用户未登陆
function checkNotLogin(req,res,next){
	if(req.session.user){//用户已经登陆
		req.flash("error","当前操作只有用户未登陆才能操作，请先退出")
		res.redirect("/")
	}else{//用户没有登陆
		next();
	}
}

module.exports = {
	checkLogin:checkLogin,
	checkNotLogin:checkNotLogin
};
