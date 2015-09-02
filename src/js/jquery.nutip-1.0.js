/* Copyright (c) 2014 Michael Eisenbraun (http://jquery.michaeleisenbraun.com)
 * Licensed under the MIT License.
 *
 * Version: 1.0.0
 *
 * Requires: jQuery 1.7.2+
 */

 
if(!window.console) { var console = { log: function() { } } };   

var nutips = {}; 

(function($) {
	$.fn.nutip = function(option) {
		return this.each(function() { 
			var $el = $(this); 
						
			var data = $el.data('nutips'); 
			
			if(!data) { 
				$el.data('nutips', (data = new Nutip(this, option))); 
			}
		});		
	};

	var Nutip = function(element, options) { 
		this.$el = $(element); 
		this.$nutip = null; 
		this.nutip = null;
				
		if(options) { $.extend( this, options ); }
		
		this.init();
	};

	Nutip.prototype = {
		nutip_id: null,
		position: null,
		type: null,
		style: null,
		title: null,
		message: null,
		template: null,
		zindex: 1, 
		templates: {
			'nugget': '<div id="{{id}}" class="nutip {{type}} {{style}}"><h4 class="nutip-title">{{title}}<div class="close"></div></h4><p class="nutip-message">{{message}}</p></div>',
			'tip': '<div id="{{id}}" class="nutip {{type}} {{style}}"><h4 class="nutip-title">{{title}}<div class="close"></div></h4><p class="nutip-message">{{message}}</p></div>',
			'menu': '<div id="{{id}}" class="nutip {{type}} {{style}}"><h4 class="nutip-title">{{title}}<div class="close"></div></h4><p class="nutip-message">{{message}}</p></div>',
			'popup': '<div class="overlay" id="overlay-{{id}}"><div id="{{id}}" class="nutip {{type}} {{style}}"><h4 class="nutip-title">{{title}}<div class="close"></div></h4><p class="nutip-message">{{message}}</p></div></div>',
			'notify': '<div id="{{id}}" class="nutip {{type}} {{style}}"><h4 class="nutip-title">{{title}}<div class="close"></div></h4><p class="nutip-message">{{message}}</p></div>',
			'growl': '<div id="{{id}}" class="nutip {{type}} {{style}}"><h4 class="nutip-title">{{title}}<div class="close"></div></h4><p class="nutip-message">{{message}}</p></div>'
		},
		create: function() {
			var $this = this;
			
			//setting varibles
			$this.position = $this.$el.offset();
			$this.nutip = $this.$el.attr('data-nutip');
			$this.nutip_id = 'nutip-'+$this.nutip; 
			$this.message = $this.$el.attr('data-nutip-message'); 
			$this.title = $this.$el.attr('data-nutip-title');
			$this.type = ($this.$el.attr('data-nutip-type') ? $this.$el.attr('data-nutip-type') : 'tip');
			$this.style = ($this.$el.attr('data-nutip-style') ? $this.$el.attr('data-nutip-style') : 'canary');
			
			//highlight triggers
			$this.$el.addClass('nutip '+$this.style+' trigger');
			
			//building data 
			var data = { 
				'id': $this.nutip_id, 
				'message': $this.message, 
				'title': $this.title,
				'type': $this.type,
				'style': $this.style
			}
			
			//run template through chevron 
			$this.template = $this.chevron($this.templates[$this.type], data); 
			
			//adding nutip to DOM
			switch($this.type) {
				case 'nugget': 
					$($this.template).css({'top':$this.position.top}).appendTo('body');
					$this.$nutip = $('#'+$this.nutip_id); 

					//creating hide listener
					$('.close', $this.$nutip).click(function(){
						$this.hide();
					});
					break;

				case 'tip': 
					$($this.template).appendTo('body');
					$this.$nutip = $('#'+$this.nutip_id);
					
					$this.position = $this.$el.offset();
					
					if($this.$nutip.width() + $this.position.left > $(window).width()) { 
						var adjust = $(window).width() - ($this.$nutip.width() + 30);
						var dif = $this.position.left - adjust; 
						
						
						$this.addRule('#'+$this.nutip_id+':before', 'left:'+(15+dif)+'px'); 
						$this.addRule('#'+$this.nutip_id+':after', 'left:'+(16+dif)+'px');
						
						$this.$nutip.css({'top':$this.position.top-($this.$nutip.height()+5), 'left':adjust});
						
					} else { 
						$this.$nutip.css({'top':$this.position.top-($this.$nutip.height()+5), 'left':$this.position.left});
					}
					
					//creating hide listener
					$this.$el.mouseout(function() {
						//$this.$el.removeClass($this.style+' magnify');
						$this.timeout = setTimeout(function() { $this.hide();}, 500);
					});
					break;


				case 'menu': 
					$($this.template).appendTo('body');
					$this.$nutip = $('#'+$this.nutip_id);
					
					$this.position = $this.$el.offset();
					
					if($this.$nutip.width() + $this.position.left > $(window).width()) { 
						var adjust = $(window).width() - ($this.$nutip.width() + 30);
						var dif = $this.position.left - adjust; 
						
						
						$this.addRule('#'+$this.nutip_id+':before', 'left:'+(15+dif)+'px'); 
						$this.addRule('#'+$this.nutip_id+':after', 'left:'+(16+dif)+'px');
						
						$this.$nutip.css({'top':$this.position.top-($this.$nutip.height()+5), 'left':adjust});
						
					} else { 
						$this.$nutip.css({'top':$this.position.top-($this.$nutip.height()+5), 'left':$this.position.left});
					}
					
					$('.close', $this.$nutip).click(function(){
						$this.hide();
					});

					break;
					
				case 'popup': 
					$($this.template).appendTo('body');
					$this.$overlay = $('#overlay-'+$this.nutip_id);
					$this.$nutip = $('#'+$this.nutip_id); 

					//creating hide listener
					$('.close', $this.$nutip).click(function(){
						$this.hide();
					});
					break;
					
				case 'notify': 
					$($this.template).appendTo('body');
					$this.$nutip = $('#'+$this.nutip_id); 

					//creating hide listener
					$('.close', $this.$nutip).click(function(){
						$this.hide();
					});
					break;
					
				case 'growl': 
					$($this.template).appendTo('body');
					$this.$nutip = $('#'+$this.nutip_id); 

					//creating hide listener
					$('.close', $this.$nutip).click(function(){
						$this.hide();
					});
					break;

					
			}
					
						
			nutips[$this.nutip] = $this; 
		},
		hide: function() {
			var $this = this; 
			
			switch($this.type) { 
				case 'nugget': 
					$this.$nutip.fadeOut('fast').css({'right':-300});
					break;
				
				case 'tip': 
					$this.$nutip.fadeOut();
					break;

				case 'menu': 
					$this.$nutip.fadeOut();
					break;
					
				case 'popup': 
					$this.$overlay.hide();
					$this.$nutip.fadeOut('fast');
					break;
					
				case 'notify': 
					$this.$nutip.animate({'top':-200}, 500);
					break;
					
				case 'growl': 
					$this.$nutip.fadeOut();
					break;
			}
		},
		show: function(e) {
			var $this = this; 
			
			$.each(nutips, function(key, nutip) {
				if(nutip.nutip_id != $this.nutip_id) { 
					nutip.hide();
				}
			});
			
			switch($this.type) {
				case 'nugget': 
					$this.$nutip.show().animate({'right':100}, 500);
					//$this.position = $this.$el.offset();
					//$this.$nutip.css({'top':$this.position.top-($this.$nutip.height()+10), 'left':$this.position.left}).fadeIn();
					break; 
				
				case 'tip': 
					window.clearTimeout($this.timeout)
					$this.$nutip.fadeIn();
					
					//$this.$el.addClass($this.style+' magnify');
					break;

				case 'menu': 
					window.clearTimeout($this.timeout)
					$this.$nutip.fadeIn();
					
					//$this.$el.addClass($this.style+' magnify');
					break;
					
				case 'popup': 
					$this.$overlay.show();
					$this.$nutip.fadeIn(); 
					break;
					
				case 'notify': 
					$this.$nutip.show().animate({'top':0}, 500);	
					break; 
					
				case 'growl': 
					$this.$nutip.fadeIn();	
					break; 
					
			}
			
		},
		update: function(data) {
			$.each(data, function(key, val) {
				switch(key) {
					case 'message':
						$('.nutip-message', $this.$nutip).html(val);
						break;

					case 'title':
						$('.nutip-title', $this.$nutip).html(val);
						break;
				}
			});
		},
		addRule: function(selector, rule) {
			var stylesheets = document.styleSheets; 
			
			$.each(stylesheets, function(key, stylesheet) {
				if(stylesheet.href.indexOf('nutip.css') != -1) { 
					stylesheet.insertRule(selector + '{' + rule + '}', stylesheet.cssRules.length);	
					console.log(stylesheet.cssRules);		
				}
			});
		},
		chevron: function(template, data) {
			$.each(data, function(key, val){
				var re = new RegExp('{{'+key+'}}', 'g');
				template = template.replace(re, val)
			});
			
			return template;
		},
		init: function() {	
			var $this = this;
			
			/*$('body').on('mouseover', '.trigger', function() { 
				nutips[$(this).data('nutip')].show('hover'); 	
			});*/
			
			/*$this.$el.hover(function() { 
				$this.show('hover');	
			});
			
			//prevent clicking
			$this.$el.click(function(e){
				e.preventDefault();
				$this.show('click');
			});*/

			
			//prevent clicking
			
			
			$this.create();
		}
	};
	
})(jQuery);
$(document).ready(function() { 
	$('[data-nutip]').nutip();
	
	$('body').on('click mouseover', '.trigger', function(e) { 
		e.preventDefault(); 
		var tigger = $(this); 
		var nutip = tigger.data('nutip');
		var type = tigger.data('nutip-type'); 
		
		if(!((type == 'popup' || type == 'notify' || type == 'growl' || type == 'menu') && e.type == 'mouseover')) { 
			nutips[nutip].show();
		}
		
	}); 
});
