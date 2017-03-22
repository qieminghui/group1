var express = require('express');
var router = express.Router();

//引入数据库中，操作users集合
var userModel = require('../Mongodb/db').userModel
var md5 = require("../md5/md5");
var auth  = require('../middleware/auth')

/* GET users listing. */
router.get('/', function(req,res) {
    res.send('respond with a resource');
});
//注册
router.get('/reg',auth.checkNotLogin(),function(req,res) {
    res.render('./users/reg',{title:'注册页标题',content:'注册页内容'});
});
router.post('/reg',auth.checkNotLogin(),function (req,res) {
    var users = req.body;//获取表单提交的信息
    //保存user
    users.password = md5(users.password);
    // users.avator = "http://secure.gravatar.com/avatar/"+users.email+'?s=48'
    var query = {username:users.username,email:users.email}
    userModel.findOne(query,function (err,doc) {//查找数据库中有，无数据
        if(!err){ //查找到数据
            if(doc){//有值时
                console.log('当前用户已注册，请重新注册')
                res.redirect('back')
            }else{//没值时
                userModel.create(users,function (err,doc) {//注册成功或者失败
                    if(!err){//成功
                        console.log(doc);
                        res.redirect('/users/login');
                    }else{//失败
                        console.log(err)
                        res.redirect('back')
                    }
                })
            }
        }else{
            console.log(err)
            res.redirect('back')
        }
    })

})
//登录
router.get('/login',auth.checkNotLogin(),  function(req, res, next) {
    res.render('users/login',{title:'登录页标题',content:'登录页内容'});
});
router.post('/login',function (req,res) {
    var users = req.body;
    users.password = md5(users.password)
    userModel.findOne(users,function(err,doc){
        if(!err){
            if(doc){
//保存在sesssion中
            req.session.users = doc
                res.redirect("/")
            }else{
                console.log('当前用户不存在先注册');
              res.redirect("/users/reg");
            }

        }else{
            console.log(err)
            res.redirect("back")

        }
    })

})
router.get('/logout',auth.checkLogin(), function(req, res, next) {
    req,session.users = null
    res.redirect('/');
});


module.exports = router;
