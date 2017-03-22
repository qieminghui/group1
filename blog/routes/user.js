var express = require('express');
var router = express.Router();


//引入数据库中操作用户的集合
var userModel = require("../mongodb/db").userModel;

var md5 = require("../md5/md5");//引入md5加密

var auth = require("../middleware/auth")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//未登陆才能进行操作
router.get('/reg',auth.checkNotLogin,function(req, res, next) {
  res.render('user/reg',{title:"用户注册页面标题",content:"用户注册页面内容"});
});

router.post("/reg",auth.checkNotLogin,function(req,res,next){
	var user = req.body;//获取表单提交的注册信息
	//保存user??怎么存
	//user
	//用户名，密码，邮箱只要有一个不相同就可以注册成功
	user.password = md5(user.password);//对用户的密码进行加密
	
	user.avatar = "https://secure.gravatar.com/avatar/"+user.email+"?s=48"
	
	var query = {username:user.username}
	userModel.findOne(query,function(err,doc){
		if(!err){
			if(doc){//表示找到了这个用户
				req.flash("error","当前用户已经注册，请重新输入")
				//console.log("当前用户已经注册，请重新输入");
				res.redirect("back");
			}else{//没有找到用户
				userModel.create(user,function(err,doc){
					if(!err){
						req.flash("success","注册成功");
						//console.log(doc);
						res.redirect("/user/login");
					}else{
						req.flash("error","注册失败");
						//console.log(err);
						res.redirect("back")
					}
				});
			}
		}else{
			req.flash("error","注册失败");
			//console.log(err);
			res.redirect("back")
		}
	});
})

router.get('/login',auth.checkNotLogin,function(req, res, next) {
  res.render('user/login',{title:"用户登陆页面标题",content:"用户登陆页面内容"});
});

router.post("/login",auth.checkNotLogin,function(req,res,next){
	var user = req.body;//获取登陆信息
	
	user.password = md5(user.password);//对用户的密码进行加密
	//数据库中查找该用户的注册信息
	userModel.findOne(user,function(err,doc){
		if(!err){//成功
			if(doc){//用户已经注册过
				req.flash("success","用户登陆成功")
				//用户已经登陆了，但是我们需要用户登陆的信息保存起来
				req.session.user = doc;//将用户登陆信息保存到session中
				res.redirect("/");
			}else{
				req.flash("error","当前用户信息不存在，请先注册")
				//console.log("当前用户信息不存在，请先注册");
				res.redirect("/user/reg");//跳转到注册页面
			}
		}else{//失败
			req.flash("error","登陆失败")
			//console.log("登陆失败："+err)
			res.redirect("back")
		}
	});
});

router.get('/logout',auth.checkLogin,function(req, res, next) {
	req.flash("success","退出成功")
	//将session的信息清空
	req.session.user = null;
 	res.redirect("/");
 	
});


module.exports = router;
