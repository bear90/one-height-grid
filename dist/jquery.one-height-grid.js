(function($){
	
	var _OneHeightGrid = function (el, options) {
		
		var self = this;
        
        this.render = function() {
        	return this.element.each(function () {
        		self.el = this;
        		self.$el = $(this);
        		
        		setGridSize();
        	});
        };
        
		this.element = el;
		
		this.el = el;
		
		this.$el = $(el);

		this.options = {
			rowSelector: '.one-height-grid-row',
            cellSelector: '.one-height-grid-cell',
            cellMargin: 0,
            parentWidth: 0,
            regenerateFlag: false
		};
		
		var initialize = function() {
            self.options.cellMargin = self.$el.data('margin'); 

            // On / off resize 
            if (self.$el.data('resize') != 'off') {
                $(window).on('resize', function() {
                    setGridSize();
                });
            }            
        };
        
        var setGridSize = function() {
            self.options.parentWidth = self.$el.width();
            
            $(self.options.rowSelector).each(function() {
               
                if (self.$el.width() != self.options.parentWidth && self.options.regenerateFlag === false) {
                	self.options.regenerateFlag = true;
                    setGridSize();
                    
                    return true;
                }

                var cells = $(this).find(self.options.cellSelector);

                // Step 1 get sizes
                var width = new Array();
                var height = new Array();
                var rate = new Array();
                var minH = 100000;

                $(cells).each(function() {
                    var w = parseInt($(this).data('width'));
                    var h = parseInt($(this).data('height'));

                    if (h < minH) 
                        minH = h;
                        
                    width.push(w);
                    height.push(h);
                    rate.push(w / h);                    
                });

                // Step 2 calculate temp width
                var tmpWidth = 0;
                for (var i = 0; i < width.length; i++) {
                    width[i] = minH * rate[i];
                    tmpWidth = tmpWidth + width[i];
                }
                // Step 3 calculate rate 
                rate = (self.options.parentWidth - ((width.length - 1) * self.options.cellMargin)) / tmpWidth;
                
                minH = Math.round(minH* rate);
                tmpWidth = 0;
                
                for (var i = 0; i < width.length; i++) {
                    width[i] = Math.round(width[i] * rate);
                    tmpWidth = tmpWidth + width[i];
                    
                    $(cells).eq(i).css({
                		'height': minH+'px', 
                		'width':width[i]+'px', 
                		'marginBottom': self.options.cellMargin+'px' });
                    if (i != width.length - 1) {
                        $(cells).eq(i).css({'marginRight': self.options.cellMargin+'px' });
                        tmpWidth = tmpWidth + self.options.cellMargin;
                    }
                    else {
                        if (self.options.parentWidth < tmpWidth) {
                            width[i] = width[i] - (tmpWidth - self.options.parentWidth);
                            $(cells).eq(i).css({'width':width[i]+'px'});
                        }
                    }
                    $(cells).eq(i).trigger('render:finish');
                }
            });    
            self.options.regenerateFlag = false;            
        };
		
		initialize();
	};
	
	// static
    $.OneHeightGrid = {
        version: 1.00,
        author: "Copyright 2014 (C) Inspirativ",
        counter:0
    };
    $.fn.extend({
    	OneHeightGrid: function(options)
        {
            return new _OneHeightGrid(this, options);
        }
    });
})(jQuery);