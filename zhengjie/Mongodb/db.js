/**
 * Created by zjLUliuxiaoliu on 2017/3/17.
 */
var　mongoose= require('mongoose');
mongoose.connect(require('../dbUrl').dbUrl);

var userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    avatar:String,
    poster:String
})
var userModel = mongoose.model('users',userSchema);
module.exports.userModel = userModel//导出usermodel