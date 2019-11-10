const mongoose = require('mongoose')

const loginSchema = mongoose.Schema({
  id: String,
  password: String
}, { collection: 'login'})
//这里mongoose.Schema要写上第二个参数，明确指定到数据库中的哪个表取数据


const Login = module.exports = mongoose.model('login',loginSchema);
