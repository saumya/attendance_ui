//
$(function(){
	console.log('Ready: App_1');
	
	//const REST_URI = "http://localhost:3000";

	const requestURL = REST_URI+'/createGroup/';
	//
	$('#div_notification').hide();
	//
	$('#btn_create').on('click',function(){
		var newName = $('#txt_batch_name').val();
		var tNow = new Date();
		var sTimeNow = tNow.getHours()+':'+tNow.getMinutes()+':'+tNow.getSeconds()+':'+tNow.getMilliseconds();
		console.log('Create: newName=',newName);
		var jsonData = JSON.stringify({
			"calledAt" : sTimeNow,
			"groupName": newName
		});
		//var requestURL = REST_URI+'/createGroup/';
		//check
		if(newName===''){
			console.log('empty');
			$('#div_notification').show();
			$('#div_notification').html("Can not be Empty!");
		}else{
			//
			// Working Fine
			// jQuery AJAX call
			$.ajax({
			  method: "POST",
			  url: requestURL,
			  contentType: "application/json",
			  dataType: "json",
			  data: jsonData,
			  cache: false
			})
			.always(function( data ){
				console.log(data);
				console.log('+-----------------------ALways /');
			})
		  .done(function( msg ) {
		  	console.log('+-----------------------Done');
		  	console.log(msg);
		  	console.log('+-----------------------Done /');
		  })
		  .fail(function( err ){
		  	console.log('+-----------------------Error');
		  	console.log(err);
		  	console.log('+-----------------------Error /');
		  });
		  

		  /*
		  // using Fetch API
		  // working fine
		  var fetchData = {
		  	method:'POST',
		  	body:JSON.stringify({"one":"test","two":"testTwo","fromUI":"Yay!"}),
		  	mode: 'cors',
		  	headers:new Headers({
		  		'Content-Type': 'application/json'
		  	})
		  };
		  fetch(requestURL,fetchData).then(function(resultData){
		  	console.log('------- RESULT --------');
		  	console.log(resultData);
		  	//var jResult = resultData.json();
		  	resultData.json()
		  	.then(function(rData){
		  		console.log(rData);
		  	})
		  	.catch(function(error1){
		  		console.log('JSON Error');
		  		console.log(error1);
		  	});
		  	console.log('------- RESULT /-------');
		  }).catch(function(error){
		  	console.log('------ ERROR ----------');
		  	console.log(error);
		  	console.log('------ ERROR -------- /');
		  });
		  */
			//
		}
	});
});