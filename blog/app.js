//引入express模块，用来创建app
var express = require("express");
//引入path模块（dirname,join,resolve）
var path = require("path");
//引入serve-favicon模块，用来处理ico图标的模块
var favicon = require("serve-favicon");
//输入日志
var logger = require("morgan");
//引入cookie模块，进行cookie处理（req.cookies,res.cookie）
var cookieParser = require("cookie-parser");
//通过post请求体内容req.body
var bodyParser = require("body-parser");

//引入session
var session = require("express-session");
//引入connect-mongo模块，讲session信息保存到数据库中
var MongoStore = require("connect-mongo")(session);
//引入flash模块，引入模块后可以使用
//设置：req.flash（属性名，属性值）
//获取：req.flash（属性名）
var flash = require("connect-flash");


//创建路由容器
var index = require("./routes/index");//处理首页路由
var user = require("./routes/user");//处理用户页路由
var article = require("./routes/article");//处理文章相关的路由

//创建app 其实是一个函数，http.createServer
var app = express();

//view engine setup 设置模板引擎文件

//设置模板引擎文件根路径
app.set("views",path.join(__dirname,"views"));
//设置模板引擎文件类型
app.set("view engine","html");
//设置ejs解析html文件
app.engine("html",require("ejs").__express);

// uncomment after placing your favicon in /public
//中间件的使用
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//使用日志模块
app.use(logger("dev"));
//使用bodyparser模块,用来请求请求体是json对象 {name:"chenchao",age:18}
app.use(bodyParser.json());
//用来处理post表单提交  name=chenchao&age=18
app.use(bodyParser.urlencoded({ extended: false }));
//使用cookieparser模块
app.use(cookieParser());
//静态资源文件的处理
app.use(express.static(path.join(__dirname,'public')));

//使用session中间件
app.use(session({
	secret:"come",
	resave:true,
	saveUninitialized:true,
	store:new MongoStore({//降session与数据库进行关联，以后session在存储的时候自动保存在数据库中
		url:require("./dbUrl").dburl
	})
}));

//使用flash，放在session的后面
app.use(flash());

//将所有的路由都执行的操作放在公共中间件中执行
app.use(function(req,res,next){
	//向所有的模板引擎文件中传递user值
	res.locals.user = req.session.user;
	//取出flash值，赋值给提示面板
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.keyword = req.session.keyword;
	next();
})


//所有是/开头的路由都交给index路由处理
app.use("/",index);
//所有是user开头的路由都交给users路由处理
app.use("/user",user);
//所有article开头的路由，都交给article处理
app.use("/article",article);

// catch 404 and forward to error handler
//错误路由的处理
app.use(function(req,res,next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //向模板引擎中传递数据
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;