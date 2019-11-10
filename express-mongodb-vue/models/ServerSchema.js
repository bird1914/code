const mongoose = require('mongoose')

const serverSchema = mongoose.Schema({
  name: String,
  ipv4: String,
  apiUrl: String,
  createTime: String
}, { collection: 'myserver'})
//这里mongoose.Schema要写上第二个参数，明确指定到数据库中的哪个表取数据


const Server = module.exports = mongoose.model('server',serverSchema);
