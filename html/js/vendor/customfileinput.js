;(function($){
/*----------------------------------------------------------------------------------------------------*/
	$.fn.extend({
		//Plugin Code Start here
		customFileinput: function(options){
			//Set Default setting for plugin
			var defaults = {
                buttontext : 'Send',
				customboxwidth : ' 80%',
				customboxclass : 'customfile',
				fileinputclass : 'fileinput'
            };
			
			//Define Default option using extend 
            var options = $.extend(defaults, options);
			var fileinput = $(this).css({"width":"100%", "height":"100%", "position":"absolute", "left":"0", "top":"0" });
			fileinput.addClass(options.fileinputclass); //adding Class in to File input
			fileinput.css({opacity:0}); // Hide File input
			
			//create Element for custom design
			var customfile = $('<div class="'+options.customboxclass+'"><div class="innersec"></div></div>').css({"position":"relative"}); //custome file wrapper
			var cfilefield = $('<span class="cust-field"></span>'); //custome file field
			var cfilebutton = $('<span class="cust-btn"></span>').text(options.buttontext); //custome file button
			
			
			//Adding file name In Custome design
			fileinput.bind('change', function(){
				var filename = $(this).val().split(/\\/).pop();
				$(this).next().next(cfilefield).text(filename); 
			})
			
			//Implement HTML object For Custom Design
			fileinput.wrap(customfile);
			fileinput.after(cfilebutton);
			fileinput.next(cfilebutton).after(cfilefield);
			var movebox = customfile.attr('class');
			
			//Follow Mouse in custom file block area region
			$("."+movebox).bind('mousemove',function(e){ 
				var offleft = $(this).offset().left;
				var offtop = $(this).offset().top;
				var leftpos =  e.pageX - offleft - 190;
				var toppos =  e.pageY - offtop-5 ;
			});
			
			$("."+movebox).bind('mouseleave', function(e){
				$(this).find('input[type=file]').css({left: 0, top: 0});
			}).width(options.customboxwidth);
			
		}
	});
/*----------------------------------------------------------------------------------------------------*/	
})(jQuery);