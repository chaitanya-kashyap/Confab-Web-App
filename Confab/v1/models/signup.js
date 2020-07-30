const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

let confabSchema = new mongoose.Schema({
  username: String,
  password: String
});

confabSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', confabSchema);
