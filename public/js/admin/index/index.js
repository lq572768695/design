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

	/*$("#img_upload").click(function(){
	    var files = $('#avatar').prop('files');
	    var data = new FormData();
	    for(var i=0;i<files.length;i++){
			data.append(files[i].name,files[i]);
		}
		$.ajax({
		    url: '/admin/imgupload',
		    type: 'post',
		    data:data,
		    cache: false,
		    processData: false,
		    contentType: false,
		    success:function(rs){
		    	console.log(rs)
		    }
		});
	});*/
	home.loadhomepiclist()
	$("#collectionlist").click(function(){
		admin.loadcollectionlist()
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
	}
}



var admin={
	loadcollectionlist:function(){
		$.ajax({
			url:"/loadcollectionlist",
			data:{

			},
			success:function(h){
				$(".content-wrapper").html(h)
				admin.bindcollectionlist()
			}
		})
	},
	bindcollectionlist:function(){
	}
}

