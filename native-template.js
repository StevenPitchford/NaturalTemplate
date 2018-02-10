(function($) {

    $.fn.nativeTemplate = function( options ) {

	// TODO - parse NT context first and bind to DOM to enable context shifting of variable interpolation

        // Establish our default settings
        var settings = $.extend({
            data    : { greetee : "world" }
        }, options);

		var tagSupport = {
			SPAN : function( context,data ){
				$(context).text(data);
			},
			LI : function( context,data ){
				$(context).text(data);
			},
			TH : function( context,data ){
				$(context).text(data);
			},
			TD : function( context,data ){
				$(context).text(data);
			},
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

		var dataFromParam = function( attribute, local, data )
		{

			try{
				return dataLookup(attribute,local);
			}
			catch (err){};
			
			return dataLookup(attribute,data);

		}

		var dataLookup = function( attribute, data )
		{		
			var param = attribute.split(".");

			if ( param.length == 0 || ! data )
			{
				throw("No Match");
			};

			var ptr = data;
			loop: for( var i = 0; i < param.length; i++)
			{

				if ( param[i] in ptr )
				{
					ptr = ptr[param[i]];
					continue loop;
				}

				throw("No Match");
				return;					
			};

			return ptr;
		}

		var processIf = function( context,attribute,local,data )
		{
			try
			{
				var val = dataFromParam(attribute,local,data);
				if ( ! val )
				{
					context.remove();
				};
			}
			catch(err)
			{
				console.log(err);
				console.log("Cannot find var for element "+context.tagName+" in nt-if: "+attribute); // todo add silent / noisy option
				$(this).removeAttr("nt-if");
			}
		};

		var eachHeap = [];

		var buildLocal = function(){
			var local = {};
			eachHeap.forEach(function (element){
				local[element.name] = element.scope;					
			});
			return local;
		}

		var processEach = function( context,attribute,local,data )
		{

			$(context).removeAttr("nt-each");
			var list = attribute.split(/\s+/);

			if ( list.length != 3 || list[1] !== 'IN' )
			{
				console.log("Illegal Expression in "+context.tagName+" in nt-each: '"+attribute+"'"); // todo add silent / noisy option
			}

			var localName = list[0];
			var param = list[2];
			var val;

			try
			{
				val = dataFromParam(param,local,data);
//				console.log(param);				
//				console.log(val);				
//				console.log(JSON.stringify(local));
//				console.log(JSON.stringify(data));
				
			}
			catch(err)
			{
				console.log(err);
				console.log("Cannot find var for element "+context.tagName+" in nt-each: "+attribute); // todo add silent / noisy option
				return;
			}

			// val HAS to be Array
			if ( ! $.isArray( val ))
			{
				console.log("Val not list for element "+context.tagName+" in nt-each: "+attribute); // todo add silent / noisy option
				return;				
			}

			var template = $(context).clone();
			var parent = $(context).parent();
			$(context).remove();

			val.forEach(function(el)
			{
				// TODO - avoid rebuiding heap every time?
				var t = { name : localName, scope : el };

				eachHeap.push(t);
				var l = buildLocal();

				var newItem = template.clone();
				newItem.removeAttr("nt-each");
				newItem.removeAttr("id");
//				newItem.data("ntLocalScope",local);
				processElement( newItem,l,data );
				newItem.appendTo($(parent));

				eachHeap.pop();
			});
		};

		var processPop = function( context,attribute,local,data )
		{

			var fn = tagSupport[ context.tagName ] ;
			if ( jQuery.isFunction( fn ) )
			{
				// execute function
				var val;
				try
				{
					val = dataFromParam(attribute,local,data);
					fn(context,val);	// TODO - context
				}
				catch(err)
				{
					console.log(err);
					console.log("Cannot find var for element "+context.tagName+" in nt-pop: "+attribute); // todo add silent / noisy option
				}

			}
			else
			{
				console.log("Attempt to populate unsupported html element: "+context.tagName);
			}

			$(this).removeAttr("nt-pop");

		};

		var processElement = function( element,local,data )
		{
			var a = $(element).attr("nt-if");
			if ( a )
			{
				processIf( element,a,local,data );
			}

			var b = $(element).attr("nt-each");
			if ( b )
			{
				processEach( element,b,local,data );
			}

			var c = $(element).attr("nt-pop");
			if ( c )
			{
				processPop( element,c,local,data );
			}
		};

        return this.each( function() {
			processElement(this,{},settings.data);
        });
    }

}(jQuery));
