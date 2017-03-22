var express = require('express');
var router = express.Router();

//文章集合
var articleModel = require('../mongodb/db').articleModel;
//引入markdown方法
var markdown = require('mardown').markdown;
markdown.toHTML();//mardown语法转换成标签
/* GET home page. */
router.get('/', function(req, res, next) {
    var query = req.query;
    //查找数据库的条件
    var queryObj = {}
    if(query.keyword){
        req.session.keyword = query.keyword;//将keyword保存到session中
        var reg = new RegExp(query.keyword,'i');
        queryObj = {$or:[{title:reg},{content:reg}]}//搜索条件
    }

//处理分页从能
    var pageNum = parseInt(req.query.pageNum) ||1;
    var pageSize = parseInt(req.query.pageSize) ||3;
    articleModel.find(queryObj)
        .populate('user')
        .skip((pageNum-1)*pageSize)
        .limit(pageSize)
        .exec(function(err,article){
            if(!err){
                //让文章的内容支持markdown
                article.forEach(function(article,index){
                    article.content = markdown.toHTML(article.content)
                });
                articleModel.count(queryObj,functon(err,count){
                    if(!err){

                    }else{
                        req.flash('error','显示文章列表信息失败');
                        res.redirect('back')
                    }
       0         })

                req.flash('success','获取列表页信息成功');
                res.render('index',{
                    title :'首页的标题',
                    articles:articles,
                    keyword:query.keyword,
                    pageNum:pageNum,
                    pageSize:pageSize,
                    totalPage:Math.cell(count/pageSize)//总页数
                })
            }else{
                req.flash('success','获取列表页信息失败');
                res.redirect('back')
            }
        })



  res.render('index', { title: '首页文章标题',content:"首页文章内容"});
});

module.exports = router;
