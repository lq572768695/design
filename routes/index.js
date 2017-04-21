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
	db.open(function (err,db) {
	    db.collection("homepic", function (err,collection) {
        collection.find().sort({ctime:-1}).toArray(function(err,homepiclist){
	    		db.close();
	    		res.render('index/home', {
	    			homepiclist:homepiclist||[]
	    		});
	       });
	    });
    });
});
/*about me*/
router.get('/loadindexaboutme', function(req, res, next) {
  db.open(function (err,db) {
      db.collection("user", function (err,collection) {
        collection.find().toArray(function(err,user){
          db.close();
          res.render('index/aboutme', {
            user:user[0]||{}
          });
        });
      });
    });
 // res.render('index/aboutme', {});
});
/*blog*/
router.get('/loadindexblog', function(req, res, next) {
  res.render('index/blog', {});
});
/*contact*/
router.get('/loadindexcontact', function(req, res, next) {
  res.render('index/contact', {});
});
/*portfolioone*/
router.get('/loadindexportfolioone', function(req, res, next) {
  res.render('index/portfolioone', {});
});
/*portfoliootwo*/
router.get('/loadindexportfoliotwo', function(req, res, next) {
  res.render('index/portfoliotwo', {});
});
module.exports = router;
