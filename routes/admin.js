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
	var loginUser = req.session["loginUser"]
	db.open(function (err,db) {
	    db.collection("user", function (err,collection) {
	    	collection.find({}).toArray(function(err,user){
	    		if(user.length==0){
	    			res.render('admin/regist', {});
	    		}else if(user.length!=0 && !loginUser){
	    			res.render('admin/login', {});
	    		}else if(user.length!=0 && loginUser){
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
    var ctime = new Date()
    db.open(function (err,db) {
	    db.collection("user", function (err,collection) {
	    	collection.find({name:name}).toArray(function(err,user){
	    		if(user.length==0){
	    			collection.insert({name:name,password:password,id:id,ctime:ctime}, function (err,docs) {
		                console.log(docs);
		                res.json({
		                	code:0,
							message : "注册成功"
						})
		            });
	    		}else{
	    			if(user[0].name==name){
		    			res.json({
		    				code:1,
							message : "该用户名已经被注册"
						})
		    		}else{
		    			collection.insert({name:name,password:password,id:id,ctime:ctime}, function (err,docs) {
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
	    db.collection("user", function (err,collection) {
            collection.find({name:name}).toArray(function(err,user){
	    		if(user.length==0){
	                res.json({
	                	code:1,
						message : "该用户名不存在"
					})
	    		}else{
	    			if(user[0].password==password){
	    				req.session["loginUser"] = user[0]
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
	delete req.session["loginUser"];
	res.json({
		code:0
	})
});
/*主页图片列表*/
router.get('/loadhomepiclist', function(req, res, next) {
	var id=req.session["loginUser"].id
	db.open(function (err,db) {
	    db.collection("homepic", function (err,collection) {
            collection.find({from:id}).sort({ctime:-1}).toArray(function(err,homepiclist){
	    		db.close();
	    		res.render('admin/homepiclist', {
	    			homepiclist:homepiclist||[]
	    		});
	        });
	    });
    });
});
/*添加个人主页的图片*/
router.get('/loadaddhomepic', function(req, res, next) {
  res.render('admin/addhomepic', {});
});
/*上传个人主页的图片*/
router.post('/homepicimgupload', function(req, res, next) {
	var form = new formidable.IncomingForm(),files=[],fields=[],docs=[];  
	//console.log('start upload');  
	var date = new Date(); 
    var ms = createId();
   	var fdir=req.session["loginUser"].id;
   	if(!fs.existsSync("public/upload/"+fdir)){
   		fs.mkdirSync("public/upload/"+fdir)
   	}
   	if(!fs.existsSync("public/upload/"+fdir+"/home")){
   		fs.mkdirSync("public/upload/"+fdir+"/home")
   	}
   	var tdir=getTime(Date.now()+'');
   	if(!fs.existsSync("public/upload/"+fdir+"/home"+"/"+tdir)){
   		fs.mkdirSync("public/upload/"+fdir+"/home"+"/"+tdir)
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
//保存个人主页的图片
router.get('/savehomepic', function(req, res, next) {
    var name=req.query["imgname"]
    var describe=req.query["imgdescribe"]
    var path=req.query["imgpath"]
    var size=req.query["imgsize"]
    var ctime=req.query["imgmtime"]
    var id=createId()
    var from=req.session["loginUser"].id;
    db.open(function (err,db) {
	    db.collection("homepic", function (err,collection) {
			collection.insert({name:name,describe:describe,path:path,size:size,ctime:ctime,id:id,from:from}, function (err,docs) {
                console.log(docs);
                res.json({
                	code:0,
					message : "上传成功"
				})
				db.close();
            });
	    });
    });
});
/*删除个人主页的图片*/
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
/*个人介绍*/
router.get('/loadaboutmeintroduce', function(req, res, next) {
	var id=req.session["loginUser"].id
	db.open(function (err,db) {
	    db.collection("user", function (err,collection) {
            collection.find({id:id}).toArray(function(err,user){
	    		db.close();
	    		res.render('admin/introduce', {
	    			user:user[0]||{}
	    		});
	        });
	    });
    });
  //res.render('admin/perinfor', {});
});
/*关于我的图片上传*/
router.post('/aboutmeintroduceimgupload', function(req, res, next) {
	var form = new formidable.IncomingForm(),files=[],fields=[],docs=[];  
	//console.log('start upload');  
	var date = new Date(); 
    var ms = createId();
   	var fdir=req.session["loginUser"].id;
   	if(!fs.existsSync("public/upload/"+fdir)){
   		fs.mkdirSync("public/upload/"+fdir)
   	}
   	if(!fs.existsSync("public/upload/"+fdir+"/aboutme")){
   		fs.mkdirSync("public/upload/"+fdir+"/aboutme")
   	}
   	var tdir=getTime(Date.now()+'');
   	if(!fs.existsSync("public/upload/"+fdir+"/aboutme"+"/"+tdir)){
   		fs.mkdirSync("public/upload/"+fdir+"/aboutme"+"/"+tdir)
   	}
   	var dirname="public/upload/"+fdir+"/"+"aboutme"+"/"+tdir;
	form.uploadDir =dirname;
	form.on('field', function(field, value) {
	    fields.push([field, value]);
	}).on('file', function(field, file) { 
	    //console.log(field, file);  
	    files.push([field, file]);   
	    var types = file.name.split('.'); 
	    fs.renameSync(file.path, dirname+'/' + ms + '_'+file.name); 
	    file.path="upload/"+fdir+"/"+"aboutme"+"/"+tdir+'/' + ms + '_'+file.name 
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
/*保存关于我的个人信息*/
router.get('/saveaboutmeintroduce', function(req, res, next) {
    var photo=req.query["photo"]
    var describe=req.query["describe"]
    var id=req.session["loginUser"].id
    db.open(function (err,db) {
	    db.collection("user", function (err,collection) {
			collection.update({id:id},{"$set":{describe:describe,photo:photo}}, function (err,docs) {
				res.json({
                	code:0,
					message : "更新成功"
				})
                db.close();
            });
	    });
    });
});
//相册列表
router.get('/loadphotoslist', function(req, res, next) {
	var id=req.session["loginUser"].id
	db.open(function (err,db) {
	    db.collection("photos", function (err,collection) {
            collection.find({from:id}).sort({time:-1}).toArray(function(err,photoslist){
	    		db.close();
	    		res.render('admin/photoslist', {
	    			photoslist:photoslist||[]
	    		});
	        });
	    });
    });
});

//添加相册
router.get('/loadaddphotos', function(req, res, next) {
	res.render('admin/addphotos', {});
});
/*保存相册*/
router.get('/savephotos', function(req, res, next) {
	var name=req.query["name"]
    var id=createId()
    var from=req.session["loginUser"].id;
    var path="images/admin/photo1.png" 
    db.open(function (err,db) {
	    db.collection("photos", function (err,collection) {
			collection.insert({name:name,id:id,from:from,num:0,path:path}, function (err,docs) {
                console.log(docs);
                res.json({
                	code:0,
					message : "添加成功"
				})
            });
    		db.close();
	    });
    });
});

/*相册详情*/
router.get('/loadpicturelist', function(req, res, next) {
	var photosid=req.query["photosid"]
	db.open(function (err,db) {
	    db.collection("picture", function (err,collection) {
            collection.find({from:photosid}).sort({time:-1}).toArray(function(err,picturelist){
	    		db.close();
	    		res.render('admin/picturelist', {
	    			picturelist:picturelist||[]
	    		});
	        });
	    });
    });
});

/*相册添加图片*/
router.get('/loadaddpicture', function(req, res, next) {
	res.render('admin/addpicture', {});
});
/*相册添加图片上传*/
router.post('/pictureimgupload', function(req, res, next) {
	var form = new formidable.IncomingForm(),files=[],fields=[],docs=[];  
	//console.log('start upload');  
	var date = new Date(); 
    var ms = createId();
   	var fdir=req.session["loginUser"].id;
   	if(!fs.existsSync("public/upload/"+fdir)){
   		fs.mkdirSync("public/upload/"+fdir)
   	}
   	if(!fs.existsSync("public/upload/"+fdir+"/photos")){
   		fs.mkdirSync("public/upload/"+fdir+"/photos")
   	}
   	var tdir=getTime(Date.now()+'');
   	if(!fs.existsSync("public/upload/"+fdir+"/photos"+"/"+tdir)){
   		fs.mkdirSync("public/upload/"+fdir+"/photos"+"/"+tdir)
   	}
   	var dirname="public/upload/"+fdir+"/"+"photos"+"/"+tdir;
	form.uploadDir =dirname;
	form.on('field', function(field, value) {
	    fields.push([field, value]);
	}).on('file', function(field, file) { 
	    //console.log(field, file);  
	    files.push([field, file]);   
	    var types = file.name.split('.'); 
	    fs.renameSync(file.path, dirname+'/' + ms + '_'+file.name); 
	    file.path="upload/"+fdir+"/"+"photos"+"/"+tdir+'/' + ms + '_'+file.name 
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
//保存相册的图片
router.get('/savepicture', function(req, res, next) {
	var obj=req.query["obj"]
    var from=req.query["photosid"]
    db.open(function (err,db) {
	    db.collection("picture", function (err,collection) {
    		for(var n=0;n<obj.length;n++){
    			var path=obj[n].path;
		    	var ctime=obj[n].mtime;
		    	var imgsize=obj[n].size/1024/1024;
	    		var size =Math.round(imgsize*100)/100+"MB";
	    		var id=createId();
    			collection.insert({path:path,size:size,ctime:ctime,id:id,from:from}, function (err,docs) {
	                console.log(docs);
	            });
    		}
            res.json({
            	code:0,
				message : "上传成功"
			})
			db.close()
	    });
    });
});
/*删除个人主页的图片*/
router.get('/deletepicture', function(req, res, next) {
    var imgid=req.query["imgid"]
    db.open(function (err,db) {
	    db.collection("picture", function (err,collection) {
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

module.exports = router;
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