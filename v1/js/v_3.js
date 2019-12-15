//
//$(function(){});
$(function(){
	console.log('View : 3');

	$('#div_notification').hide();

	var requestURL_getBatchNames = REST_URI+'/getBatchNames/';
	const requestURL_getBatchDays = REST_URI+'/getDays/';

	//--- getBatches ----------------------------------------------------------------------
	const getBatches = function(){
		//console.log('TODO: getAllBatchNames');
		fetch(requestURL_getBatchNames).then(function(resultData){
			//console.log('getAllBatchNames: done:');
			resultData.json()
		  	.then(function(rData){
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
		});
	}
	//--- getBatches / ----------------------------------------------------------------------
	//--- renderAllBatchNames ---------------------------------------------------------------
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
	}
	//--- renderAllBatchNames / ---------------------------------------------------------------
	//-------- Batch Selection ----------------------
	$('#id_all_batches').on('change',function(event){
		var a = $('#id_all_batches')[0];
		var i = a.options.selectedIndex;
		if( a.options[i].value == 0 ){
			console.log('---- Nothing Selected --------');
			$("#id_sBName").text( 'No batch!' );
			selectedBatchName = 'nothing';
			selectedBatchId = '0';
		}else{
			console.log( a.options[i].value+':'+a.options[i].label );
			
			selectedBatchName = a.options[i].label;
			selectedBatchId = a.options[i].value;

			// setting batch name in display
			//$("#id_sBName").text( selectedBatchName );
			//
			//$('#id_addPersonUI').show();
			
			// getting people of this batch
			//getPersonsOfBatch(selectedBatchName);
			getDaysOfBatch(selectedBatchName);
		}
	});
	//-------- Batch Selection / ----------------------
	//--- getDaysOfBatch ----------------------------------------------------------------------
	const getDaysOfBatch = function(batchName){
		//console.log('TODO: getAllBatchNames');
		fetch( requestURL_getBatchDays+batchName ).then(function(resultData){
			//console.log('getAllBatchNames: done:');
			resultData.json()
		  	.then(function(rData){
		  		/*
		  		console.log('------- data');
		  		console.log(rData);
		  		console.log('------- data /');
		  		*/
		  		renderAllDaysOfBatch(rData);
		  	})
		  	.catch(function(error2){
		  		console.log('JSON Error');
		  		console.log(error2);
		  	});
		}).catch(function(error1){
			console.log('getAllDaysOfBatch: ERROR :--------------');
			console.log(error1);
		});
	}
	//--- getDaysOfBatch / ----------------------------------------------------------------------
	//--- renderAllDaysOfBatch ----------------------------------------------------------------------

	const renderAllDaysOfBatch = function(aDays){
		console.log('renderAllDaysOfBatch : ');
		//console.log(aDays);
		
		allDaysObjs = aDays;
		var allViewLi = '';

		var i = 0;
		var sName = '';
		var n = 0;
		var aSorted = [];
		for(i;i<allDaysObjs.length;i++){
			//console.log( allDaysObjs[i] );
			sName = allDaysObjs[i].name;
			n = Number ( sName[sName.length-1] );
			aSorted[n] = allDaysObjs[i];
		}

		const allLi = aSorted.map( day => {
		//const allLi = aDays.map( day => {
			//console.log( day );
			//var s = '<option value=' + day['id'] +'>' + day['name']+'-id='+day['id'] + '</option>';
			var s = '<div><span class="is-size-4">' + day['name'] + '</span> . ' + day['date'] + '</div>';
			allViewLi+= s;
		});
		//console.log(allViewLi);
		$('#id_allDaysOfBatch').html(allViewLi);
	}
	//--- renderAllDaysOfBatch / --------------------------------------------------------------------
	// init this App
	getBatches();
});