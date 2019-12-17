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
	//$('#id_addPersonUI').hide();
	//$('#btn_add_person').hide();


	//---------------------------------------------------------------------
	var selectedBatchName = 'nothing';
	var selectedBatchId = '0';
	var selectedGroupName = '0';
	//
	var newPersonToBeAdded = {}; //JSON Obj

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
	});
	//---------------------------------------------------------------------
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
	const addPersonToBatch = function(){
		console.log('addPersonToBatch',newPersonToBeAdded);
		showInfoModalToUser('Please wait.');

		var jData = JSON.stringify(newPersonToBeAdded);
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
		  		//addButtonIsDisabled = false;
		  		//$('#div_info').hide();
		  		showInfoToUser(rData.result);
		  		//
		  		hideInfoModalFromTheUser();
		  		$('#id_info_modal_close_button').show();
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
		
	}
	//---------------------------------------------------------------------
	//---------------------------------------------------------------------
	// Add Person to Batch
	$('#btn_add_person').on('click',function(){
		//console.log('Add Person');
		//console.log('AddPerson',selectedBatchName,',',selectedBatchId);

			var sName = $('#txt_person_name').val();
			var sNumber = $('#txt_person_phone').val();
			var tNow = new Date();
			var sTimeNow = tNow.getHours()+':'+tNow.getMinutes()+':'+tNow.getSeconds()+':'+tNow.getMilliseconds();

			//console.log('addPerson:click: ',sTimeNow+': '+sName+' / '+sNumber);
			//console.log(selectedBatchName,selectedBatchId);
			// Check for empty
			if(sName != '' && sNumber != ''){
				if(selectedGroupName != '0'){
					if(selectedBatchName != 'nothing'){
						newPersonToBeAdded = {
																		"calledOnTime": sTimeNow,
																		"personName": sName,
																		"phone":sNumber,
																		"batch":selectedBatchName,
																		"batchId":selectedBatchId,
																		"group":selectedGroupName
																	};
						$('#id_confirm_modal').addClass('is-active');
						$('#id_confirm_details').html('name- <strong>'+sName+'</strong><br> phone- <strong>'+sNumber+'</strong><br> batch- <strong>'+ selectedBatchName +'</strong><br> Preference- <strong>'+selectedGroupName+'</strong> <br><br>');
					}else{
						showInfoToUser('Which Batch?');
						showInfoModalToUser('Which Batch?');
					}
				}else{
					showInfoToUser('Morning or Evening? Select a Group.');
					showInfoModalToUser('Morning or Evening? Select a Group.');
				}
			}else{
				const msg = 'Name or Phone <strong>can not</strong> be empty!';
				showInfoToUser(msg);
				showInfoModalToUser(msg);
			}

		return false;
	});// Click Handler /END
	//
	//
	$('#btn_confirm_yes').on('click',function(eventData){
		eventData.preventDefault();
		//
		$('#id_confirm_modal').removeClass('is-active');
		//console.log('newPersonToBeAdded',newPersonToBeAdded);
		addPersonToBatch();
		//
		return false;
	});
	$('#btn_confirm_no').on('click',function(eventData){
		eventData.preventDefault;
		//
		$('#id_confirm_modal').removeClass('is-active');
		//
		return false;
	});
	//
	$('#id_info_modal_close_button').on('click',function(eventData){
		$('#id_info_modal').removeClass('is-active');
	});
	const showInfoToUser = function(message){
		$('#div_info').html(message);
		$('#div_info').show();
	}
	const showInfoModalToUser = function(message){
		$('#id_info_modal').addClass('is-active');
		$('#id_modal_message_box').html(message);
	}
	const hideInfoModalFromTheUser = function(){
		$('#id_info_modal').removeClass('is-active');
	}
	//
	getBatches();
});