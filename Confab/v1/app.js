let express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/Confab");

let confabSchema = new mongoose.Schema({
  email: String,
  password: String
});

let confoSchema = new mongoose.Schema({
  name: String,
  email: String,
  number: String,
  password: String
});

let confabData = mongoose.model('confabData', confabSchema);

let newUserData = mongoose.model('newUserData', confoSchema);

app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/sign', function(req, res) {
  confabData.find({}, (error, allUsers) => {
    if(error){
      console.log(error);
    }else{
      res.render('new', {sign: allUsers});
    }
  })
});

app.post('/sign', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const logUser = {email:email, password: password};

  confabData.create(logUser, (error, newlyCreated) => {
    if(error){
      console.log(error);
    }else{
      res.redirect('/sign');
    }
  })
});

app.get('/new', (req, res) => {
  newUserData.find({}, (error, newUsers) => {
    if(error){
      console.log(error);
    }else{
      res.render('user', {new: newUsers});
    }
  })
});

app.post('/new', (req, res) => {
  let name = req.body.name;
  let email = req.body.email;
  let number = req.body.number;
  let password = req.body.password;
  const newUser = {name: name, email: email, number: number, password: password};

  newUserData.create(newUser, (error, welUser) => {
    if(error){
      console.log(error);
    }else{
      res.redirect('/new');
    }
  })
});

app.get('/homepage', (req, res) => {
  res.render('home');
});

app.listen(7000, () => {
  console.log("Confab Server is started");
});
