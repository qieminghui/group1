/**
 * Created by zjLUliuxiaoliu on 2017/3/17.
 */
var express = require('express');
//调用express模块下的Router方法，，简历路由容器
var router = express.Router();
var auth  = require('../middleware/auth');
var articleModel = require('../mongodb/db').articleModel;
var multer = require('multer');

//对上传的文件进行一些配置
var storage = multer.disstorage({
    distination:function(req,file,cb){
        cb(null,'../public/uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);// 使用之前的名字
    }

});
//配置  upload是一个中间键处理函数
var upload = multer({storage:storage});

router.get("/add",auth.checkLogin(),function(req,res,next){
    res.render("article/add",{title:'发表文章业标题',content:'发表文章业内容'})
});

  module.exports = router

router.post('/add',checkLogin,upload.single('poster'),function(req,res,doc){
    var article = req.body;
    if(req.file){
        //=保存上传的图片路径
        article.poster = '/uploads/' + req.file.filename;
    }

    article.user = req.session.users._id;
    articleModel.create(article,function(err,doc){
        if(!err){
            req.flash('success','发表文章信息成功')
            res,redirect('/')
        }else{
            req.flash('error','发表文章信息失败')
            res,redirect('back');
        }
    })

});
  module.exports = router;