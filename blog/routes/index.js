var express = require('express');
var router = express.Router();

//引入文章集合
var articleModel = require("../mongodb/db").articleModel;


//引入markdown模块
var markdown = require("markdown").markdown;
/*markdown.toHTML();*/

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var query = req.query;//获取请求url中的参数
	
	//查询数据库的条件
	var queryObj = {};
	if(query.keyword){//提交的搜索的请求
		req.session.keyword = query.keyword;//将keyword存到session
		var reg = new RegExp(query.keyword,"i");//创建搜索的正则，忽略大小写
		queryObj = {$or: [{title: reg}, {content: reg}]};//搜索的条件
	}
	
	
	//处理分页功能
	var pageNum = parseInt(req.query.pageNum) || 1;//获取url中的页码，如果没有默认一页
	var pageSize = parseInt(req.query.pageSize) || 6;//获取url中每个显示几条数据，如果没有显示5条
	
	articleModel.find(queryObj)
		.populate("user")//将外键的_id读取成为对应的对象值
		.skip((pageNum-1)*pageSize)//跳过前面的pageNum-1页数据
		.limit(pageSize)//一页显示pagesSize条
		.exec(function(err,articles){
			if(!err){
				console.log(articles);
				//让文章的内容支持markdown forEach map filter find
				articles.forEach(function(article,index){
					article.content = markdown.toHTML(article.content);
				});
				
				articleModel.count(queryObj,function(err,count){
					if(!err){
						req.flash("success","获取文章列表页信息成功");
						res.render("index",{
							title:"首页的标题",
							articles:articles,
							keyword:query.keyword,//渲染模板引擎文件
							pageNum:pageNum,//页数
							pageSize:pageSize,//一页显示多少条
							totalPage:Math.ceil(count/pageSize)//总页数
						});
					}else{
						req.flash("error","显示文章列表信息失败");
						res.redirect("back")
					}
				});
				
			}else{
				req.flash("error","获取文章列表页信息失败");
				res.redirect("back");
			}
		});
	
});

module.exports = router;
