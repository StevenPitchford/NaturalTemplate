(function($) {

    $.fn.nativeTemplate = function( options ) {

	// TODO - parse NT context first and bind to DOM to enable context shifting of variable interpolation

        // Establish our default settings
        var settings = $.extend({
            data    : { greetee : "world" }
        }, options);	

		var listHandler = function( context,data )
		{
			if (data && data.constructor === Array)
			{
				var child = $(context).children("li:first");
				if ( child )
				{
					var template = child.clone();
					child.remove();

					data.forEach(function(element){
						var newItem = template.clone();
						newItem.text( element );
						newItem.appendTo($(context));
					});
				}
				else{
					// add items to list
					data.forEach(function(element){
						var item = $("<li>"+element+"</li>");
						item.appendTo($(context));
					});
				}
			}
			else // bit of an odd case but seems least ungreatful way of dealing with this...
			{
				// TODO - clone removed item
				console.log("Item");
				$(context).filter('li').remove();
				$(context).append("<li>"+data+"</li>");
			} 
		};

		var tagSupport = {
			SPAN : function( context,data ){
				$(context).text(data);
			},
			LI : function( context,data ){
				$(context).text(data);
			},
			OL : listHandler,
			UL : listHandler,
			SELECT : function( context,data ){
//				$(context).filter("option:selected").prop("selected",false);
//				$(context).filter('option[value="'+data+'"]').prop('selected', true);
//				$(context).change();
				
				$(context).val(data);

			},
			INPUT : function( context,data ){
				$(context).val(data);
			},
		};

		var dataFromParam = function( param, data )
		{

			if ( param.length == 0 )
			{
				throw("No Match");
			};

			var ptr = data;
			for( var i = 0; i < param.length; i++)
			{
				ptr = ptr[param[i]];
			};
			
			return ptr;
		}

        return this.each( function() {
            // We'll get back to this in a moment

			var a = $(this).attr("nt-pop");
			if ( a )
			{
				var fn = tagSupport[ this.tagName ] ;
				if ( jQuery.isFunction( fn ) )
				{
					// execute function
					var l = a.split(".");

					var val = '';
					try
					{
						val = dataFromParam(l,settings.data);
					}
					catch(err)
					{
						console.log(err);
						console.log("Cannot find var for element "+this.tagName+" in nt-pop: "+a); // todo add silent / noisy option
					}
					
					fn(this,val);	// TODO - context
				}
				else
				{
					console.log("Attempt to populate unsupported html element: "+this.tagName);
				}
			}
        });
    }

}(jQuery));
