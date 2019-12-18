//
$(function(){
	console.log('Ready');
	console.log('Ready: App_4');

	//const REST_URI = "http://localhost:3000";
	
	var requestURL_getBatchNames = REST_URI+'/getBatchNames/';
	var requestURL_addDates = REST_URI+'/addDates/';
	//---------------------------------------------------------------------
	//$('#div_info').hide();
	$('#div_notification').hide();

	//$('#id_all_batches').hide();
	//$('#id_addDaysUI').hide();
	//---------------------------------------------------------------------
	var selectedBatchName = 'nothing';
	var selectedBatchId = '0';
	var selectedGroupName = '0';

//---------------------------------------------------------------------
	// Get Batch names to show
	const getAllBatchNames = function(){
		//console.log('getAllBatchNames');
		showInfoToUser('Please wait, getting the Batch names from server.');

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
			
			showInfoToUser(error1+' <br> Check your internet connection!');
		});
	}

	const renderAllBatchNames = function(aNames){
		//console.log('renderAllBatchNames');
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
	}
	//---------------------------------------------------------------------
	//---------------------------------------------------------------------
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
			//
			$('#id_addDaysUI').show();
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
	// $('#dt_1').val()
	// var a = $('#dt_1').val();
	// var b = new Date(a);
	// b.setDate(b.getDate()+1);
	// $('#dt_2').val(b.getFullYear()+'-'+b.getMonth()+'-'+b.getDate());
	$('#dt_1').on('change',function(data){
		console.log( 'change' );
		var a = $('#dt_1').val();
		var b = new Date(a);

		var theMonth = b.getMonth() + 1; //since it's 0 based

		b.setDate(b.getDate()+1);
		$('#dt_2').val(b.getFullYear()+'-'+ theMonth +'-'+b.getDate());

		b.setDate(b.getDate()+1);
		$('#dt_3').val(b.getFullYear()+'-'+ theMonth +'-'+b.getDate());

		b.setDate(b.getDate()+1);
		$('#dt_4').val(b.getFullYear()+'-'+ theMonth +'-'+b.getDate());

		b.setDate(b.getDate()+1);
		$('#dt_5').val(b.getFullYear()+'-'+ theMonth +'-'+b.getDate());

		b.setDate(b.getDate()+1);
		$('#dt_6').val(b.getFullYear()+'-'+ theMonth +'-'+b.getDate());

		b.setDate(b.getDate()+1);
		$('#dt_7').val(b.getFullYear()+'-'+ theMonth +'-'+b.getDate());

		return false;
	});
	//---------------------------------------------------------------------
	//---------------------------------------------------------------------
	$('#btn_add_dates').on('click',function(evt){
		evt.preventDefault();
		//console.log('click');
		var d1 = $('#dt_1').val();
		var d2 = $('#dt_2').val();
		var d3 = $('#dt_3').val();
		var d4 = $('#dt_4').val();
		var d5 = $('#dt_5').val();
		var d6 = $('#dt_6').val();
		var d7 = $('#dt_7').val();
		//console.log(d1,d2,d3,d4,d5,d6,d7);
		//
		var jsonData = {
			batchName: selectedBatchName,
			batchId: selectedBatchId,
			days:{
				"day1": d1,
				"day2": d2,
				"day3": d3,
				"day4": d4,
				"day5": d5,
				"day6": d6,
				"day7": d7
			}
		};
		//console.log(jsonData);

		/*
		fetch(requestURL_addDates,fetchData).then(function(resultData){
			console.log('add_dates ------- RESULT --------');
			//console.log(resultData);
			resultData.json()
		  	.then(function(rData){
		  		console.log('add_dates : result');
		  		console.log(rData);
		  	})
		  	.catch(function(error1){
		  		console.log('add_dates : JSON Error');
		  		console.log(error1);
		  	});
		}).catch(function(error){
			console.log('add_dates ----- ERROR -------');
			console.log(error);
			console.log('add_dates ----- ERROR / -----');
		});
		*/
		//
		//if( selectedBatchId === '0'){
		if( selectedBatchName === 'nothing'){
			console.log('No batch selected!');
			showInfoToUser('Select a <strong>Batch</strong>.');
			showModalInfo('Select a <strong>Batch</strong> before moving forward.');
		}else{
			if( (d1 == '') || (d2=='') || (d3=='') || (d4=='') || (d5=='') || (d6=='') || (d7=='') ){
				showInfoToUser('Select the <strong>dates</strong> for <strong>all the days</strong>.');
				showModalInfo('Select the <strong>dates</strong> for <strong>all the days</strong>.');
			}else{
				// send to backend
				saveTheDatesForTheBatch( jsonData );
			}
		}
		//
		return false;
	});
	//---------------------------------------------------------------------
	const saveTheDatesForTheBatch = function(jsonData){
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
		fetch(requestURL_addDates,fetchData).then(function(resultData){
			//console.log('add_dates ------- RESULT --------');
			//console.log(resultData);
			resultData.json()
		  	.then(function(rData){
		  		console.log('add_dates : result');
		  		console.log(rData);
		  		showInfoToUser('Success. Dates are added.');
		  	})
		  	.catch(function(error1){
		  		console.log('add_dates : JSON Error');
		  		console.log(error1);
		  		showInfoToUser('Error! Adding dates failed.');
		  	});
		}).catch(function(error){
			console.log('add_dates ----- ERROR -------');
			console.log(error);
			console.log('add_dates ----- ERROR / -----');
		});
	}
	//---------------------------------------------------------------------
	const showInfoToUser = function(message){
		$('#div_info').html(message);
		$('#div_info').show();
	}
	// modal
	const showModalInfo = function(message){
		$('#id_confirm_modal').addClass('is-active');
		$('#id_modal_confirm_box').html(message);
	}
	$('#id_modal_confirm_close_button').on('click',function(eventData){
		$('#id_confirm_modal').removeClass('is-active');
	});
	// modal /
	//---------------------------------------------------------------------
	getAllBatchNames();
	//---------------------------------------------------------------------
});