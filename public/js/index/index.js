var pageTimer = {} ; //定义计时器全局变量
$(function(){
	index.loadhome()
	$("#loadhome").click(function(){
		$(".top_nav").removeClass("selected")
		$(this).addClass("selected")
		index.loadhome()
	})
	$("#loadaboutme").click(function(){
		$(".top_nav").removeClass("selected")
		$(this).addClass("selected")
		index.loadaboutme()
	})
	$("#loadblog").click(function(){
		$(".top_nav").removeClass("selected")
		$(this).addClass("selected")
		index.loadblog()
	})
	$("#loadcontact").click(function(){
		$(".top_nav").removeClass("selected")
		$(this).addClass("selected")
		index.loadcontact()
	})
	$("#loadportfolio_one").click(function(){
		$(".top_nav").removeClass("selected")
		$(".my_portfolio").addClass("selected")
		index.loadportfolioone()
	})
	$("#loadportfolio_two").click(function(){
		$(".top_nav").removeClass("selected")
		$(".my_portfolio").addClass("selected")
		index.loadportfoliotwo()
	})
})

var index={
	loadhome:function(){
		$.ajax({
			url:"/loadindexhome",
			data:{

			},
			success:function(h){
				$("#site_content").html(h)
				index.bindhome()
			}
		})
	},
	bindhome:function(){

	},
	loadaboutme:function(){
		$.ajax({
			url:"/loadindexaboutme",
			data:{

			},
			success:function(h){
				$("#site_content").html(h)
				index.bindaboutme()
			}
		})
	},
	bindaboutme:function(){

	},
	loadblog:function(){
		$.ajax({
			url:"/loadindexblog",
			data:{

			},
			success:function(h){
				$("#site_content").html(h)
				index.bindblog()
			}
		})
	},
	bindblog:function(){

	},
	loadcontact:function(){
		$.ajax({
			url:"/loadindexcontact",
			data:{

			},
			success:function(h){
				$("#site_content").html(h)
				index.bindcontact()
			}
		})
	},
	bindcontact:function(){

	},
	loadportfolioone:function(){
		$.ajax({
			url:"/loadindexportfolioone",
			data:{

			},
			success:function(h){
				$("#site_content").html(h)
				index.bindportfolioone()
			}
		})
	},
	bindportfolioone:function(){

	},
	loadportfoliotwo:function(){
		$.ajax({
			url:"/loadindexportfoliotwo",
			data:{

			},
			success:function(h){
				$("#site_content").html(h)
				index.bindportfoliotwo()
			}
		})
	},
	bindportfoliotwo:function(){
		
	}
}




function slideShow(speed) {
  // append an 'li' item to the 'ul' list for displaying the caption
  $('ul.slideshow').append('<li id="slideshow-caption" class="caption"><div class="slideshow-caption-container"><p></p></div></li>');

  // set the opacity of all images to 0
  $('ul.slideshow li').css({opacity: 0.0});
  
  // get the first image and display it
  $('ul.slideshow li:first').css({opacity: 1.0}).addClass('show');
  
  // get the caption of the first image from the 'rel' attribute and display it
  $('#slideshow-caption p').html($('ul.slideshow li.show').find('img').attr('alt'));
    
  // display the caption
  $('#slideshow-caption').css({opacity: 0.6, bottom:0});
  
  // call the gallery function to run the slideshow 
  pageTimer["timer1"] = setInterval('gallery()',speed);
  // pause the slideshow on mouse over
  $('ul.slideshow').hover(
    function () {
      clearInterval(pageTimer["timer1"]); 
    },  
    function () {
      pageTimer["timer1"] = setInterval('gallery()',speed);    
    }
  );  
}

function gallery() {
  //if no images have the show class, grab the first image
  var current = ($('ul.slideshow li.show')?  $('ul.slideshow li.show') : $('#ul.slideshow li:first'));

  // trying to avoid speed issue
  if(current.queue('fx').length == 0) {

    // get the next image, if it reached the end of the slideshow, rotate it back to the first image
    var next = ((current.next().length) ? ((current.next().attr('id') == 'slideshow-caption')? $('ul.slideshow li:first') :current.next()) : $('ul.slideshow li:first'));
      
    // get the next image caption
    var desc = next.find('img').attr('alt');  
  
    // set the fade in effect for the next image, show class has higher z-index
    next.css({opacity: 0.0}).addClass('show').animate({opacity: 1.0}, 1000);
    
    // hide the caption first, and then set and display the caption
    $('#slideshow-caption').slideToggle(300, function () { 
      $('#slideshow-caption p').html(desc); 
      $('#slideshow-caption').slideToggle(500); 
    });   
  
    // hide the current image
    current.animate({opacity: 0.0}, 1000).removeClass('show');
  }
}