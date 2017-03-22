var mongoose = require("mongoose");

//连接数据路
mongoose.connect(require("../dburl").dburl);

//创建schema
var userSchema = new mongoose.Schema({
    username : String,
    password : String,
    email : String,
    //头像
    avatar : String
});

//创建model
var userModel = mongoose.model("user",userSchema);


var articleSchema = new mongoose.Schema({
	//标题
    title : String,
    //内容
    content : String,
    //图片上传
    poster : String,
    //创建时间
    createAt : {
        type : Date,
        default : Date.now()
    },
    //作者
    user : {
        type : mongoose.Schema.Types.Object,
        ref : "user"
    }
});

//创建文章集合
var articleModel = mongoose.model("article",articleSchema);

//用户相关的集合导出
module.exports.userModel = userModel;//导出userModel
module.exports.articleModel = articleModel;//导出articleModel