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
	$("#collectionlist").click(function(){
		collection.loadcollectionlist()
	})
	$("#loadhomepiclist").click(function(){
		home.loadhomepiclist()
	})
	$("#loadperinfor").click(function(){
		aboutme.loadperinfor()
	})
})

/*home*/
var home={
	loadhomepiclist:function(){
		$.ajax({
			url:"/loadhomepiclist",
			data:{

			},
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
			data:{

			},
			success:function(h){
				$(".content-wrapper").html(h)
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
			    	var imgmtime=$.parseJSON(rs).files[0].mtime;
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
							imgmtime:imgmtime
						},
						success : function(rs){
							$.tip(rs.message)
							setTimeout(function(){
								home.loadhomepiclist()
							},1000)
						}
					})
			    }
			}); 
		})
	}
}

/*相册*/
var collection={
	loadcollectionlist:function(){
		$.ajax({
			url:"/loadcollectionlist",
			data:{

			},
			success:function(h){
				$(".content-wrapper").html(h)
				collection.bindcollectionlist()
			}
		})
	},
	bindcollectionlist:function(){
	}
}

/*about me*/
var aboutme={
	loadperinfor:function(){
		$.ajax({
			url:"/loadaboutmeperinfor",
			data:{

			},
			success:function(h){
				$(".content-wrapper").html(h)
				aboutme.bindperinfor()
			}
		})
	},
	bindperinfor:function(){
		$("#aboutme_save").click(function(){
			var imgpath=$("#perinfor_src").attr("src")
			var perdescribe=$("#perdescribe").val()
			$.ajax({
				url : "/saveperinfor",
				type : "get",
				data : {
					imgpath:imgpath,
					perdescribe:perdescribe
				},
				success : function(rs){
					$.tip(rs.message)
					setTimeout(function(){
						aboutme.loadperinfor()
					},1000)
				}
			})
		})
		$("#update_img_save").click(function(){
			var files = $('#update_img').prop('files');
		    var imgdata = new FormData();
		    for(var i=0;i<files.length;i++){
				imgdata.append(files[i].name,files[i]);
			}
			$.ajax({
			    url: '/perinforpicimgupload',
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
	}
}