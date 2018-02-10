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
			bool : {
				"true"  : 1,
				"false" : 0
			},
			people : [
				{
					name: "Sue",
					age : 32,
					shoesize : 6
				},
				{
					name: "Helen",
					age : 27,
					shoesize : 8
				},
				{
					name: "Dan",
					age : 14,
					shoesize : 11
				},
				{
					name: "Frank",
					age : 55,
					shoesize : 9
				},
			]
	};

	$("*").nativeTemplate({data: model });
	
	// something else by way of demonstration...
	$( ".simple" ).css( "border", "3px solid red" );

});
