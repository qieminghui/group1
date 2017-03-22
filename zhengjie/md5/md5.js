/**
 * Created by zjLUliuxiaoliu on 2017/3/17.
 */
module.exports = function (input) {
    var cryto = require("crypto");
    var md5 = crypto.createHash('md5');
    md5.update(input);

    return md5.digest('hex')
}