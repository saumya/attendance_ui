//
$(function(){
	console.log('Ready: App_2');
	
	//const REST_URI = "http://localhost:3000";

	var requestURL_getBatchNames = REST_URI+'/getBatchNames/';
	var requestURL_addPerson = REST_URI+'/addPerson/';
	//
	var addButtonIsDisabled = false;
	//---------------------------------------------------------------------
	$('#div_info').hide();
	$('#div_notification').hide();
	
	$('#id_all_batches').hide();
	$('#id_addPersonUI').hide();
	$('#btn_add_person').hide();

	//---------------------------------------------------------------------
	var selectedBatchName = 'nothing';
	var selectedBatchId = '0';
	var selectedGroupName = '0';
	// Batch Selection
	$('#id_all_batches').on('change',function(event){
		//console.log('onChange');
		//console.log( $('#id_all_batches').val() );

		var a = $('#id_all_batches')[0];
		var i = a.options.selectedIndex;

		if( a.options[i].value == 0 ){
			//console.log('---- Nothing Selected --------');
			$("#id_sBName").text( 'No batch!' );
			selectedBatchName = 'nothing';
			selectedBatchId = '0';
		}else{
			console.log( a.options[i].value+':'+a.options[i].label );
			
			selectedBatchName = a.options[i].label;
			selectedBatchId = a.options[i].value;

			// setting batch name in display
			$("#id_sBName").text( selectedBatchName );
			
		}

		//console.log('onChange:',selectedBatchName,',',selectedBatchId);
		if(selectedBatchId == 0){
			//console.warn('Disable the AddPersonUI');
			$('#id_addPersonUI').hide();
		}else{
			$('#id_addPersonUI').show();
		}		
	});

	// Group Selection. Morning/Evening
	$('#id_group').on('change',function(event){
		var a = $('#id_group')[0];
		var i = a.options.selectedIndex;
		if( a.options[i].value == 0 ){
			selectedGroupName = '0';
		}else{
			//console.log( a.options[i].value+':'+a.options[i].label );
			selectedGroupName = a.options[i].value;
		}

		// AddPerson Button
		if(selectedGroupName==0){
			$('#btn_add_person').hide();
		}else{
			$('#btn_add_person').show();
		}
	});
	//---------------------------------------------------------------------
	/*
	// Get Batch names to show
	$('#btn_show_allBatchNames').on('click',function(event){
		console.log('getAllBatchNames');
		event.preventDefault();
		const msg = 'Info: Please wait, getting data.';
		showInfoToUser(msg);
		//
		fetch(requestURL_getBatchNames).then(function(resultData){
			console.log('getAllBatchNames: done:');
			resultData.json()
		  	.then(function(rData){
		  		$('#div_info').hide();
		  		renderAllBatchNames(rData);
		  	})
		  	.catch(function(error2){
		  		console.log('JSON Error');
		  		console.log(error2);
		  	});
		}).catch(function(error1){
			console.log('getAllBatchNames: ERROR :--------------');
			console.log(error1);
		});
	});
	*/
	//--- getBatches ----------------------------------------------------------------------
	const getBatches = function(){
		//console.log('getBatches ');
		
		const msg = 'Info: Please wait, getting data.';
		showInfoToUser(msg);

		fetch(requestURL_getBatchNames).then(function(resultData){
			resultData.json()
		  	.then(function(rData){
		  		renderAllBatchNames(rData);
		  	})
		  	.catch(function(error2){
		  		console.log('JSON Error');
		  		console.log(error2);
		  	});
		}).catch(function(error1){
			console.log('getAllBatchNames: ERROR :--------------');
			console.log(error1);
		});
	}
	//--- getBatches / ----------------------------------------------------------------------

	const renderAllBatchNames = function(aNames){
		console.log('renderAllBatchNames');
		//console.log(aNames);
		// JSON.parse(jstring);
		//console.log('aNames.length=',aNames.length);
		//console.log('aNames[0]=',aNames[0]);
		var allViewLi = '<option value="0"> - Choose a Batch - </option>';
		const allLi = aNames.map( batch => {
			//console.log(batch);
			//var s = '<option value='+ batch['id'] +'>'+batch['id']+'-'+batch['name']+'</option>';
			var s = '<option value=' + batch['id'] +'>' + batch['name'] + '</option>';
			allViewLi+= s;
		});
		//console.log(allViewLi);
		$('#id_all_batches').html(allViewLi);
		//
		$('#id_all_batches').show();
		//
		$('#div_info').hide();
	}
	//---------------------------------------------------------------------
	// Add Person to Batch
	$('#btn_add_person').on('click',function(){
		//console.log('Add Person');
		//console.log('AddPerson',selectedBatchName,',',selectedBatchId);

		if(addButtonIsDisabled){
			// Do Nothing
			console.log('AddPerson : Disabled');

			showInfoToUser('Info: You <strong>can not</strong> just, keep on adding. You have to wait.');

		}else{
			// Act
			console.log('Add Person');
			addButtonIsDisabled = true;
			
			
			var sName = $('#txt_person_name').val();
			var sNumber = $('#txt_person_phone').val();
			var tNow = new Date();
			var sTimeNow = tNow.getHours()+':'+tNow.getMinutes()+':'+tNow.getSeconds()+':'+tNow.getMilliseconds();

			console.log(sTimeNow+': '+sName+' / '+sNumber);
			//console.log(selectedBatchName,selectedBatchId);
			// Check for empty
			if(sName != '' && sNumber != ''){
				// show info. Processing.
				showInfoToUser('Please wait. The person is getting added to the Batch.');
				//
				var jsonData = {
							"calledOnTime": sTimeNow,
							"personName": sName,
							"phone":sNumber,
							"batch":selectedBatchName,
							"batchId":selectedBatchId,
							"group":selectedGroupName
						};
				var jData = JSON.stringify(jsonData);
				var fetchData = {
					  	method:'POST',
					  	body: jData,
					  	mode: 'cors',
					  	headers:new Headers({
					  		'Content-Type': 'application/json'
					  	})
						};
				//
				fetch(requestURL_addPerson,fetchData).then(function(resultData){
					console.log('------- RESULT --------');
				  console.log(resultData);
				  resultData.json()
				  	.then(function(rData){
				  		console.log(rData);
				  		//
				  		addButtonIsDisabled = false;
				  		//$('#div_info').hide();
				  		showInfoToUser(rData.result);
				  	})
				  	.catch(function(error1){
				  		console.log('JSON Error');
				  		console.log(error1);
				  	});
				}).catch(function(){
					console.log('------ ERROR ----------');
			  	console.log(error);
			  	console.log('------ ERROR -------- /');
				});
				//
			}else{
				// Show info. Can not be empty
				showInfoToUser('Name or Phone <strong>can not</strong> be empty!')
			}
		}// if /END

		return false;
	});// Click Handler /END
	//

	const showInfoToUser = function(message){
		$('#div_info').html(message);
		$('#div_info').show();
	}
	//
	getBatches();
});