(function($) {

    $.fn.nativeTemplate = function( options ) {

		var Store = function ( r )
		{
			var root = r;
			var local = {};
			var heap = [];

			this.valueFromAddress = function( address )
			{

				var param = address.split(".");

				if ( param.length == 0 )
				{
					throw("No Match");
				};

				try{
					return dataLookup(param,local);
				}
				catch (err){};

				return dataLookup(param,root);

			}

			// thought - this should be a constructor???
			this.pushScope = function( localName,el )
			{
				var t = { name : localName, scope : el };

				heap.push(t);
				// optios here include remove by constructor or taint variable refresh... 
				buildLocal();
			}

			this.popScope = function( localName,address )
			{
				heap.pop();
			}

			function buildLocal()
			{
				local = {};
				heap.forEach(function (element){
					local[element.name] = element.scope;					
				});
			}

			function dataLookup( param, data )
			{

				if ( ! data )
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

		}
	
		var Parser = function( store )
		{
			this.store = store;
			
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


			function processIf( context,attribute )
			{
				try
				{
					var val = store.valueFromAddress(attribute);
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

			function processEach ( context,attribute )
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
					val = store.valueFromAddress(param);
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
					store.pushScope( localName,el );
				
					var newItem = template.clone();
					newItem.removeAttr("nt-each");
					newItem.removeAttr("id");
	//				newItem.data("ntLocalScope",local);

					var p = new Parser(store);
					p.parse( newItem );

					newItem.appendTo($(parent));					
					store.popScope();
				});
			};

			function processPop ( context,attribute )
			{

				var fn = tagSupport[ context.tagName ] ;
				if ( jQuery.isFunction( fn ) )
				{
					// execute function
					try
					{
						var val = store.valueFromAddress(attribute);
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
			};

			function processElement ( element )
			{
				var a = $(element).attr("nt-if");
				if ( a )
				{
					$(this).removeAttr("nt-if");
					processIf( element,a );
				}

				var b = $(element).attr("nt-each");
				if ( b )
				{
					processEach( element,b );
				}

				var c = $(element).attr("nt-pop");
				if ( c )
				{
					$(this).removeAttr("nt-pop");
					processPop( element,c );
				}
			};

			this.parse = function( element )
			{		
				element.each( function() {
					processElement(this);
				});
			};
		};

        // Establish our default settings
        var settings = $.extend({
            data    : { greetee : "world" }
        }, options);

		// build store
		var store = new Store( settings.data );
		// create parser
		var parser = new Parser(store);
		parser.parse( this );
    }

}(jQuery));
