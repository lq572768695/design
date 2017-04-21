$(function(){
	$("#admin_cancel").click(function(){
		$.ajax({
			url:"/admincancel",
			data:{},
			success:function(rs){
				if(rs.code==0){
					setTimeout(function(){
						location.href = "../admin"
					},500)
				}
			}
		})
	})

	home.loadhomepiclist()
	$("#photoslist").click(function(){
		photos.loadphotoslist()
	})
	$("#loadhomepiclist").click(function(){
		home.loadhomepiclist()
	})
	$("#loadintroduce").click(function(){
		aboutme.loadintroduce()
	})
})

/*个人主页图片管理*/
var home={
	loadhomepiclist:function(){
		$.ajax({
			url:"/loadhomepiclist",
			data:{},
			success:function(h){
				$(".content-wrapper").html(h)
				home.bindhomepiclist()
			}
		})
	},
	bindhomepiclist:function(){
		$("#addimage").click(function(){
			home.loadaddhomepic()
		})
		$("#delete_homepic").click(function(){
			var imgid=$(this).attr("imgid");
			$.ajax({
				url:"/deletehomepic",
				data:{
					imgid:imgid
				},
				success:function(rs){
					$.tip(rs.message)
					setTimeout(function(){
						home.loadhomepiclist()
					},1000)
				}
			})
		})
	},
	loadaddhomepic:function(){
		$.ajax({
			url:"/loadaddhomepic",
			data:{},
			success:function(h){
				$("body").append(h)
				home.bindaddhomepic()
			}
		})
	},
	bindaddhomepic:function(){
		$(".addhomepic_close").click(function(){
			$("#homepic_add").remove()
			home.loadhomepiclist()
		})
		$("#image_save").click(function(){
			var files = $('#homepic').prop('files');
		    var imgdata = new FormData();
		    for(var i=0;i<files.length;i++){
				imgdata.append(files[i].name,files[i]);
			}
			$.ajax({
			    url: '/homepicimgupload',
			    type: 'post',
			    data:imgdata,
			    cache: false,
			    processData: false,
			    contentType: false,
			    success:function(rs){
			    	var imgname=$("input[name='imgname']").val();
			    	var imgdescribe=$("input[name='imgdescribe']").val();
			    	var imgpath=$.parseJSON(rs).files[0].path;
			    	var imgmctime=$.parseJSON(rs).files[0].mtime;
			    	var size=$.parseJSON(rs).files[0].size/1024/1024;
		    		var imgsize =Math.round(size*100)/100+"MB";
		    		$.ajax({
						url : "/savehomepic",
						type : "get",
						data : {
							imgname:imgname,
							imgdescribe:imgdescribe,
							imgpath:imgpath,
							imgsize:imgsize,
							imgmctime:imgmctime
						},
						success : function(rs){
							$.tip(rs.message)
							setTimeout(function(){
								$("#homepic_add").remove()
								home.loadhomepiclist()
							},1000)
						}
					})
			    }
			}); 
		})
	}
}

/*about me*/
var aboutme={
	loadintroduce:function(){
		$.ajax({
			url:"/loadaboutmeintroduce",
			data:{},
			success:function(h){
				$(".content-wrapper").html(h)
				aboutme.bindintroduce()
			}
		})
	},
	bindintroduce:function(){
		$("#update_img_save").click(function(){
			var files = $('#update_img').prop('files');
		    var imgdata = new FormData();
		    for(var i=0;i<files.length;i++){
				imgdata.append(files[i].name,files[i]);
			}
			$.ajax({
			    url: '/aboutmeintroduceimgupload',
			    type: 'post',
			    data:imgdata,
			    cache: false,
			    processData: false,
			    contentType: false,
			    success:function(rs){
			    	var imgpath=$.parseJSON(rs).files[0].path;
			    	$("#perinfor_src").attr("src",imgpath)
			    }
			}); 
		})
		$("#aboutme_save").click(function(){
			var photo=$("#perinfor_src").attr("src")
			var describe=$("#perdescribe").val()
			$.ajax({
				url : "/saveaboutmeintroduce",
				type : "get",
				data : {
					photo:photo,
					describe:describe
				},
				success : function(rs){
					$.tip(rs.message)
					setTimeout(function(){
						aboutme.loadintroduce()
					},1000)
				}
			})
		})
	}
}

/*相册*/
var photos={
	loadphotoslist:function(){
		$.ajax({
			url:"/loadphotoslist",
			data:{},
			success:function(h){
				$(".content-wrapper").html(h)
				photos.bindphotoslist()
			}
		})
	},
	bindphotoslist:function(){
		$("#addphotos").click(function(){
			photos.loadaddphotos()
		})
		$("#loadpicturelist").click(function(){
			var photosid=$(this).attr("photosid")
			photos.loadpicturelist(photosid)
		})
	},
	loadaddphotos:function(){
		$.ajax({
			url:"/loadaddphotos",
			data:{},
			success:function(h){
				$("body").append(h)
				photos.bindaddphotos()
			}
		})
	},
	bindaddphotos:function(){
		$(".addphotos_close").click(function(){
			$("#photos_add").remove()
			photos.loadphotoslist()
		})
		$("#photos_save").click(function(){
			var name=$("input[name='photosname']").val()
			$.ajax({
				url : "/savephotos",
				type : "get",
				data : {
					name:name
				},
				success : function(rs){
					$.tip(rs.message)
					setTimeout(function(){
						$("#photos_add").remove()
						photos.loadphotoslist()
					},1000)
				}
			})
		})
	},
	loadpicturelist:function(photosid){
		$.ajax({
			url:"/loadpicturelist",
			data:{
				photosid:photosid
			},
			success:function(h){
				$(".content-wrapper").html(h)
				photos.bindpicturelist(photosid)
			}
		})
	},
	bindpicturelist:function(photosid){
		$("#addimage").click(function(){
			photos.loadaddpicture(photosid)
		})
		$("#delete_photospic").click(function(){
			var imgid=$(this).attr("imgid");
			$.ajax({
				url:"/deletepicture",
				data:{
					imgid:imgid
				},
				success:function(rs){
					$.tip(rs.message)
					setTimeout(function(){
						photos.loadpicturelist(photosid)
					},1000)
				}
			})
		})
	},
	loadaddpicture:function(photosid){
		$.ajax({
			url:"/loadaddpicture",
			data:{},
			success:function(h){
				$("body").append(h)
				photos.bindaddpicture(photosid)
			}
		})
	},
	bindaddpicture:function(photosid){
		$(".addpicture_close").click(function(){
			$("#picture_add").remove()
		})
		$("#picture_save").click(function(){
			var files = $('#homepic').prop('files');
		    var imgdata = new FormData();
		    for(var i=0;i<files.length;i++){
				imgdata.append(files[i].name,files[i]);
			}
			$.ajax({
			    url: '/pictureimgupload',
			    type: 'post',
			    data:imgdata,
			    cache: false,
			    processData: false,
			    contentType: false,
			    success:function(rs){
		    		$.ajax({
						url : "/savepicture",
						type : "get",
						data : {
							photosid:photosid,
							obj:$.parseJSON(rs).files
						},
						success : function(re){
							$.tip(re.message)
							setTimeout(function(){
								$("#picture_add").remove()
								photos.loadpicturelist(photosid)
							},1000)
						}
					})
			    }
			}); 
		})
	}
}