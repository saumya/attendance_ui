//
$(function(){
	console.log('View : 2');

	$('#div_notification').hide();
	
	const requestURL_getBatchNames = REST_URI+'/getBatchNames/';
	const requestURL_getPeople = REST_URI+'/getPeople/';

	// -------- Get Batches --------------------------------
	const getBatches = function(){
		showInfoToUser('Wait! Getting data from Server . . .');
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
	//--- renderAllBatchNames --------------------------
	const renderAllBatchNames = function(aNames){
		console.log('renderAllBatchNames');
		$('#div_notification').hide();
		var allViewLi = '<option value="0"> - Choose a Batch - </option>';
		const allLi = aNames.map( batch => {
			var s = '<option value='+ batch['id'] +'>'+batch['name']+'</option>';
			allViewLi+= s;
		});
		$('#id_all_batches').html(allViewLi);
	}
	//--- renderAllBatchNames / ------------------------
	// -------- Get Batches / -------------------------------------------

	// -------- Get People --------------------------------
	// Get all persons of the selected Batch
	const getPersonsOfBatch = function(batchName){
		console.log('getPersonsOfBatch: batchName=',batchName);
		fetch(requestURL_getPeople+batchName).then(function(resultData){
			resultData.json()
		  	.then(function(rData){
		  		/*
		  		console.log('------- getPersonsOfBatch:data ---------');
		  		console.log(rData);
		  		console.log('------- getPersonsOfBatch:data / -------');
		  		*/
		  		renderPeopleOfTheBatch(rData);
		  	})
		  	.catch(function(error2){
		  		console.log('JSON Error');
		  		console.log(error2);
		  	});
		}).catch(function(error1){
			console.log('getPersonsOfBatch: ERROR :--------------');
			console.log(error1);
		});
	}
	const renderPeopleOfTheBatch = function(aPeople){
		console.log('renderPeopleOfTheBatch');
		allPeopleObjs = aPeople;

		var allViewLi = '';
		// Check for the numbers
		if(aPeople.length>0){
			var allLi = aPeople.map( person => {
				var bType = (person.batch_is_morning ? '<span class="is-size-6 has-text-info has-text-weight-bold"> M </span>' : '<span class="is-size-6 has-text-danger has-text-weight-bold"> E </span>');
				//var s = '<li><label class="checkbox"><input type="checkbox" onclick="onPersonClicked('+person.id+')">'+person.name+' | '+person.phone+' | id='+person.id+' | isMorning='+person.batch_is_morning+'</label></li>';
				var s = '<div class="" style="margin-bottom:1em;"><span class="is-size-4">' + person['name'] + ' '+bType + '</span><div class="is-family-monospace is-size-6">'+ person.phone +'</div>' + '</div>';
				allViewLi+= s;
			});
			//$('#id_all_people').html(allViewLi);
		}else{
			allViewLi = 'No one yet!';
		}
		//
		$('#id_all_people_of_batch').html(allViewLi);
		//
		// getting days of this batch
		//getDaysOfBatch(selectedBatchName);
	}
	// -------- Get People / --------------------------------
	//-------- Batch Selection ----------------------
	$('#id_all_batches').on('change',function(event){
		var a = $('#id_all_batches')[0];
		var i = a.options.selectedIndex;
		if( a.options[i].value == 0 ){
			//console.log('---- Nothing Selected --------');
			//$("#id_info_persons").text( 'No batch selected!' );
			showInfoToUser('No Batch!')
			$("#id_info_persons").text('');

			selectedBatchName = 'nothing';
			selectedBatchId = '0';
		}else{
			console.log( a.options[i].value+':'+a.options[i].label );

			$('#div_notification').hide();
			$("#id_info_persons").text( a.options[i].label );
			
			selectedBatchName = a.options[i].label;
			selectedBatchId = a.options[i].value;

			// setting batch name in display
			//$("#id_sBName").text( selectedBatchName );
			//
			//$('#id_addPersonUI').show();
			
			// getting people of this batch
			getPersonsOfBatch(selectedBatchName);
			//getDaysOfBatch(selectedBatchName);
		}
	});
	//-------- Batch Selection / ----------------------
	//
	const showInfoToUser = function(message){
		$('#div_notification').html(message);
		$('#div_notification').show();
	}
	//
	getBatches();
	//
});// jQuery init / ---------------------------------