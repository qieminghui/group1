/**
 * Created by zjLUliuxiaoliu on 2017/3/20.
 */
function checkLogin(req,res,next){
    if(req.session.users){
        next()
    }else{
        req.flash('error','当前操作只有用户才能进行操作，请先登录')
        res.redirect('/user/login')
    }
}
/**
 * Created by zjLUliuxiaoliu on 2017/3/20.
 */
function checkNotLogin(req,res,next){
    if(req.session.users){
        req.flash('error','当前操作只有用户才能进行操作，请先登录')
        res.redirect('/')

    }else{
        next()
    }
}
module.exports ={
    checkLogin:checkLogin,
    checkNotLogin:checkNotLogin
}