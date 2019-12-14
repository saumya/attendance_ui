//
console.log('Application:Entry');
//
/*
$(document).ready(function(){
	console.log('Ready!');
});
*/
//
//--- jQuery:ready ----------------------------------------------------------------------
$(function(){
	console.log('Ready');
	$('#div_notification').hide();

	//const REST_URI = "http://localhost:3000";
	
	const requestURL_getBatchNames = REST_URI+'/getBatchNames/';
	const requestURL_getBatchDays = REST_URI+'/getDays/';
	const requestURL_getPresence = REST_URI+'/getPresence/';

	var selectedBatchName = '';
	var selectedBatchId = 0;
	var selectedDay = {};
	var selectedSession = '';

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
		//$('#id_all_batches').show();
	}
	//--- renderAllBatchNames / ---------------------------------------------------------------

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
		//
		var allViewLi = '<option value="0"> - Choose a Day - </option>';
		const allLi = aDays.map( day => {
			//var s = '<option value=' + day['id'] +'>' + day['name']+'-id='+day['id'] + '</option>';
			var s = '<option value=' + day['id'] + '>' + day['name'] + '</option>';
			allViewLi+= s;
		});
		//console.log(allViewLi);
		$('#id_allDaysOfBatch').html(allViewLi);
	}
	//--- renderAllDaysOfBatch / --------------------------------------------------------------------
	//
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
	//-------- Day Selection --------------------------
	$('#id_allDaysOfBatch').on('change',function(event){
		var a = $('#id_allDaysOfBatch')[0];
		var i = a.options.selectedIndex;
		console.log('app_3.js : Day Selection : id=',i);

		var theDay = {};

		// get the day from the "id"
		//console.log('allDaysObjs',allDaysObjs);
		var j = 0;
		for(j;j<allDaysObjs.length;j++){
			//console.log(allDaysObjs[j]);
			//console.log(allDaysObjs[j].id,i);
			if( i == allDaysObjs[j].id ){
				//console.log(allDaysObjs[j]);
				console.log('inside for loop, theDay=',theDay);
				theDay = allDaysObjs[j];
				break;
			}
		}
		// The Selected Day
		//console.log('theDay',theDay);
		//console.log('selectedDay',selectedDay);
		selectedDay = theDay;
		console.log('selectedDay',selectedDay);
	});
	//-------- Day Selection / ------------------------
	//-------- Session Selection ----------------------------
	$('#id_session').on('change',function(event){
		//id_session
		//var a = $('#id_session')[0];
		//var i = a.options.selectedIndex;
		var sessionName = event.currentTarget.value;
		selectedSession = sessionName;
		console.log( 'session=',selectedSession );
	});
	//-------- Session Selection / --------------------------
	//-------- Show Button Action ---------------------------
	$('#btn_show_attendance').on('click',function(event){
		event.preventDefault();
		//
		console.log('ShowAttendance : ');
		console.log('batch=',selectedBatchName,': day=',selectedDay.date,': session=',selectedSession);
		//
		// /getPresence/:groupName/:forDate/:sessionName
		//requestURL_getPresence
		var u = requestURL_getPresence + selectedBatchName + '/' + selectedDay.date + '/' + selectedSession ;
		//
		fetch(u).then(function(result){
			result.json()
		  	.then(function(rData){
		  		/*
		  		console.log('getPresence : data : ');
		  		console.log(rData);
		  		console.log('getPresence : data / : ');
		  		*/
		  		renderPresence(rData);
		  	})
		  	.catch(function(error2){
		  		console.log('getPresence : JSON Error');
		  		console.log(error2);
		  	});
		}).catch(function(error){
			console.log('getPresence : ERROR :--------------');
			console.log(error);
		});
		//
		return false;
	});
	//-------- Show Button Action / -------------------------
	// init this App
	getBatches();
});
//--- jQuery:ready / ----------------------------------------------------------------------
//-------------------------------------------------------------------------

const renderPresence = function(aData){
	console.log('renderPresence');
	console.log(aData);

	var sHTML = '';

	if( aData.length > 0 ){
		$('#id_info_present').html('Total Present - '+aData.length);
		//
		aData.map(function(aPresent){
			var presentOn = 'morning';
			if(aPresent.isOnMorning){
				presentOn = '<span class="is-size-6 has-text-info"> M </span>';
			}else if(aPresent.isOnEvening){
				presentOn = '<span class="is-size-6 has-text-danger"> E </span>';
			}else{
				presentOn = '<span class="is-size-6"> Absent </span>';
			}
			//sHTML += '<div>'+ aPresent.nameOfPerson +' : morning='+ aPresent.isOnMorning+' : evening='+ aPresent.isOnEvening +'</div>';
			sHTML += '<div> <span class="is-size-4">'+ aPresent.nameOfPerson +'</span> . present on '+ presentOn +'</div>';
		});
	}else{
		$('#id_info_present').html('');
		sHTML = 'No one is present!';
	}


	$('#id_all_present').html(sHTML);
}





//-------------------------------------------------------------------------