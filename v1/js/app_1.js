//
$(function(){
	console.log('Ready: App_1');
	
	//const REST_URI = "http://localhost:3000";

	const requestURL = REST_URI+'/createGroup/';
	var requestURL_getBatchNames = REST_URI+'/getBatchNames/';
	//
	$('#div_notification').hide();
	//
	//---------------------------------------------------------------------
	// Get Batch names to show
	const getAllBatchNames = function(){
		console.log('getAllBatchNames');
		const msg = 'Info: Please wait, getting data.';
		showInfoToUser(msg);

		//
		fetch(requestURL_getBatchNames).then(function(resultData){
			console.log('getAllBatchNames: done:');
			resultData.json()
		  	.then(function(rData){
		  		$('#div_info').hide();
		  		/*
		  		console.log('------- data');
		  		console.log(rData);
		  		console.log('------- data /');
		  		*/
		  		renderAllBatchNames(rData);
		  	})
		  	.catch(function(error2){
		  		console.log('JSON Error');
		  		console.log(error2);
		  	});
		}).catch(function(error1){
			console.log('getAllBatchNames: ERROR :--------------');
			console.log(error1);
			//
			$('#div_notification').show();
			$('#div_notification').html(error1+'<br> Please check <strong>your internet connection</strong> and try again.');

		});
	}

	const renderAllBatchNames = function(aNames){
		console.log('renderAllBatchNames');
		console.log(aNames);
		$('#div_notification').hide();

		// JSON.parse(jstring);
		//console.log('aNames.length=',aNames.length);
		//console.log('aNames[0]=',aNames[0]);
		//var allViewLi = '<option value="0"> - Choose a Batch - </option>';
		var allViewLi = '';
		const allLi = aNames.map( batch => {
			//console.log(batch);
			//var s = '<option value='+ batch['id'] +'>'+batch['id']+'-'+batch['name']+'</option>';
			//var s = '<option value=' + batch['id'] +'>' + batch['name'] + '</option>';
			var s = '<p class="subtitle is-4">' + batch['name'] + '</p>';
			allViewLi+= s;
		});
		//console.log(allViewLi);
		$('#id_all_batches').html(allViewLi);
		//
		$('#id_all_batches').show();
	}
	//---------------------------------------------------------------------
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
			$('#div_notification').html("Batch Name can not be Empty!");
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
		  	$('#div_notification').show();
		  	$('#div_notification').html("Done. Created a new Batch. You have to <strong>Refresh the page</strong> to see the updated Batch name in the list below.");
		  	console.log('+-----------------------Done /');
		  	//getAllBatchNames();
		  })
		  .fail(function( err ){
		  	console.log('+-----------------------Error');
		  	console.log(err);
		  	$('#div_notification').show();
				$('#div_notification').html("Opps! Something went wrong. <br> Please check your internet conneciton and try again. You can <strong>refresh the page</strong> to see the updated list.");

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
	//=============================================================================
	
	const showInfoToUser = function(message){
		$('#div_notification').html(message);
		$('#div_notification').show();
	}
	//=============================================================================
	//
	getAllBatchNames();
});