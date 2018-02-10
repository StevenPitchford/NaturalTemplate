// Javascript controller for example
$(document).ready(function() {

	// We could do more here - AJAX calls, form processing, etc...

	// apologies to OO purists for use of word model here 
	
	var model = {
			greetee : "Planet Earth",
			car : "audi",
			person : "dave",
			form : {
				car : "bmw",
				person : "frank"
				},
			lists : {
				example1 : "This is an item",
				example2 : [ "First Item", "Second Item", "Third Item", "Fourth Item", "Fifth Item" ],
			},
	};

	$("*").nativeTemplate({data: model });
	
	// something else by way of demonstration...
	$( ".simple" ).css( "border", "3px solid red" );

});
