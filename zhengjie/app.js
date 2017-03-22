//引入expess模块
var express = require('express');
//路径拼接
var path = require('path');
//标题头像
var favicon = require('serve-favicon');
//编写日志
var logger = require('morgan');
//cookie模块
var cookieParser = require('cookie-parser');
//表单提交模块
var bodyParser = require('body-parser');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session)
// 路由容器
var index = require('./routes/index');//首页
var users = require('./routes/users');//用户
var article = require('./routes/article');//文章
//使用express方法
var app = express();

// view engine setup
//模板引擎文件，，，根目录，名字
app.set('views', path.join(__dirname, 'views'));
//文件类型
app.set('view engine', 'html');
//解析HTML文件
app.engine('html',require('ejs').__express);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//用来请求  请求提是json对象
app.use(bodyParser.json());
//用来处理post表单提交
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//设置静态资源文件根路径
app.use(express.static(path.join(__dirname, 'public')));

 app.use(session({
     secret:'come',
     resave:true,
     saveUninitialized:true,
     store:new MongoStore({
       url:require('./dbUrl').dbUrl
     })
 }));
 app.use(flash())
 app.use(function(req,res,next){
   // 将session保存的user登录信息渲染到模板引擎文件中
    res.locals.users=req.session.users
     //页面信息提示
     res.locals.success = req.flash('success');
     res.locals.error = req.flash('error');
//保存搜索关键字
     res.locals.keyword = req.session.keyword;
     next()
 })
//中间件
//所有/开头的路由交给index路由容器处理
app.use('/', index);
//所有users开头的路由交给index路由容器处理
app.use('/users', users);
//所有article开头的路由交给index路由容器处理
app.use('/article',article);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {//错误处理中间件
  // set locals, only providing error in development
    //给模板引擎文件传递数据的第二种方式
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
