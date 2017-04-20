var express = require('express');
var router = express.Router();
var mongo=require("mongodb");
var fs=require("fs");
var path = require("path")
var formidable = require('formidable');
var server=mongo.Server("localhost",27017,{auto_reconnect:true});
var db=new mongo.Db("photo",server,{safe:true});
/*后台管理*/
router.get('/admin', function(req, res, next) {
	var loginAdmin = req.session["loginAdmin"]
	db.open(function (err,db) {
	    db.collection("admin", function (err,collection) {
	    	collection.find({}).toArray(function(err,admin){
	    		if(admin.length==0){
	    			res.render('admin/regist', {});
	    		}else if(admin.length!=0 && !loginAdmin){
	    			res.render('admin/login', {});
	    		}else if(admin.length!=0 && loginAdmin){
	    			res.render('admin/index', {});
	    		}
	    		db.close();
	        });
	    });
    });
});
/*注册界面*/
router.get('/loadregist', function(req, res, next) {
	res.render('admin/regist', {});	
});
/*登陆界面*/
router.get('/loadlogin', function(req, res, next) {
	res.render('admin/login', {});	
});
//注册
router.get('/regist', function(req, res, next) {
    var name=req.query["name"]
    var password=req.query["password"]
    var id=createId()
    db.open(function (err,db) {
	    db.collection("admin", function (err,collection) {
	    	collection.find({name:name}).toArray(function(err,admin){
	    		if(admin.length==0){
	    			collection.insert({name:name,password:password,id:id}, function (err,docs) {
		                console.log(docs);
		                res.json({
		                	code:0,
							message : "注册成功"
						})
		            });
	    		}else{
	    			if(admin[0].name==name){
		    			res.json({
		    				code:1,
							message : "该用户名已经被注册"
						})
		    		}else{
		    			collection.insert({name:name,password:password,id:id}, function (err,docs) {
			                console.log(docs);
			                res.json({
			                	code:0,
								message : "注册成功"
							})
			            });
		    		}
	    		}
	    		db.close();
	        });
	    });
    });
});
/*登陆*/
router.get('/login', function(req, res, next) {
    var name=req.query["name"]
    var password=req.query["password"]
    db.open(function (err,db) {
	    db.collection("admin", function (err,collection) {
            collection.find({name:name}).toArray(function(err,admin){
	    		if(admin.length==0){
	                res.json({
	                	code:1,
						message : "该用户名不存在"
					})
	    		}else{
	    			if(admin[0].password==password){
	    				req.session["loginAdmin"] = admin[0]
		    			res.json({
		    				code:0,
							message : "登陆成功"
						})
		    		}else{
		    			res.json({
		    				code:2,
							message : "密码错误"
						})
		    		}
	    		}
	    		db.close();
	        });
	    });
    });
});


/*退出*/
router.get('/admincancel', function(req, res, next) {
	delete req.session["loginAdmin"];
	res.json({
		code:0
	})
});
/*homepic*/
router.get('/loadhomepiclist', function(req, res, next) {
	db.open(function (err,db) {
	    db.collection("homepic", function (err,collection) {
            collection.find().sort({imgmtime:-1}).toArray(function(err,homepiclist){
	    		db.close();
	    		res.render('admin/homepiclist', {
	    			homepiclist:homepiclist||[]
	    		});
	        });
	    });
    });
});
/*addhomepic*/
router.get('/loadaddhomepic', function(req, res, next) {
  res.render('admin/addhomepic', {});
});
/*perinfor*/
router.get('/loadaboutmeperinfor', function(req, res, next) {
  res.render('admin/perinfor', {});
});

//相册列表
router.get('/loadcollectionlist', function(req, res, next) {
	res.render('admin/collectionlist', {});
});
  
module.exports = router;

/*上传文件*/
router.post('/homepicimgupload', function(req, res, next) {
	var form = new formidable.IncomingForm(),files=[],fields=[],docs=[];  
	//console.log('start upload');  
	//存放目录
	
	var date = new Date(); 
    var ms = Date.parse(date);
   	var fdir=req.session["loginAdmin"].name;
   	if(!fs.existsSync("public/upload/"+fdir)){
   		fs.mkdirSync("public/upload/"+fdir)
   	}
   	if(!fs.existsSync("public/upload/"+fdir+"/home")){
   		fs.mkdirSync("public/upload/"+fdir+"/home")
   	}
   	var tdir=getTime(Date.now()+'');
   	if(!fs.existsSync("public/upload/"+fdir+"/home"+"/"+tdir)){
   		fs.mkdirSync("public/upload/"+fdir+"/home"+"/"+tdir)
   		fs.mkdirSync("/public/upload/"+fdir+"/home"+"/"+tdir)
   	}
   	var dirname="public/upload/"+fdir+"/"+"home"+"/"+tdir;
	form.uploadDir =dirname;
	form.on('field', function(field, value) {
	    fields.push([field, value]);
	}).on('file', function(field, file) { 
	    //console.log(field, file);  
	    files.push([field, file]);   
	    var types = file.name.split('.'); 
	    fs.renameSync(file.path, dirname+'/' + ms + '_'+file.name); 
	    file.path="upload/"+fdir+"/"+"home"+"/"+tdir+'/' + ms + '_'+file.name 
	    docs.push(file);
	}).on('end', function() {  
	    console.log('-> upload done');  
	    res.writeHead(200, {  
	        'content-type': 'text/plain'  
	    });  
	    var out={Resopnse:{  
		        'result-code':0,  
		        timeStamp:new Date(),  
		    },  
		    files:docs  
	    };  
	    var sout=JSON.stringify(out); 
	    res.end(sout);  
	});  
	form.parse(req, function(err, fields, files) {  
	    err && console.log('formidabel error : ' + err);  
	    console.log('parsing done');  
	});
});

//savehomepic
router.get('/savehomepic', function(req, res, next) {
    var imgname=req.query["imgname"]
    var imgdescribe=req.query["imgdescribe"]
    var imgpath=req.query["imgpath"]
    var imgsize=req.query["imgsize"]
    var imgmtime=req.query["imgmtime"]
    var id=createId()
    db.open(function (err,db) {
	    db.collection("homepic", function (err,collection) {
	    	collection.find().toArray(function(err,homepic){
    			collection.insert({imgname:imgname,imgdescribe:imgdescribe,imgpath:imgpath,imgsize:imgsize,imgmtime:imgmtime,id:id}, function (err,docs) {
	                console.log(docs);
	                res.json({
	                	code:0,
						message : "上传成功"
					})
	            });
	    		db.close();
	        });
	    });
    });
});

//deletehomepic
router.get('/deletehomepic', function(req, res, next) {
    var imgid=req.query["imgid"]
    db.open(function (err,db) {
	    db.collection("homepic", function (err,collection) {
			collection.remove({id:imgid}, function (err,docs) {
                res.json({
                	code:0,
					message : "删除成功"
				})
                db.close();
            });
	    });
    });
});
function getTime(time){
    var date = new Date(parseInt(time));
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    if(month<10){
        month='0'+month;
    }
    var day = date.getDate();
    if(day<10){
        day='0'+day;
    }
    /*var hour = date.getHours();
    if(hour<10){
        hour='0'+hour;
    }
    var minute = date.getMinutes();
    if(minute<10){
        minute='0'+minute;
    }
    var second = date.getSeconds();
    if(second<10){
        second='0'+second;
    }*/
    return year+'-'+month+'-'+day;
}


function createId(){
	var endtime = 1440000000000;
    var ntime = new Date().getTime();
    ntime = ntime - endtime;
    var rand = parseInt(Math.random() * 90)+10;
    var code = parseInt(rand +"" + ntime);
    return code.toString(36);
}