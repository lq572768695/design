var express = require('express');
var router = express.Router();
var mongo=require("mongodb");
var server=mongo.Server("localhost",27017,{auto_reconnect:true});
var db=new mongo.Db("photo",server,{safe:true});
/*首页*/
router.get('/', function(req, res, next) {
  res.render('index/index', {});
});
/*home*/
router.get('/loadindexhome', function(req, res, next) {
  res.render('index/home', {});
});
/*about me*/
router.get('/loadindexaboutme', function(req, res, next) {
  res.render('index/aboutme', {});
});
/*blog*/
router.get('/loadindexblog', function(req, res, next) {
  res.render('index/blog', {});
});
/*contact*/
router.get('/loadindexcontact', function(req, res, next) {
  res.render('index/contact', {});
});
module.exports = router;
