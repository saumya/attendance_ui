//
$(function(){
	console.log('Ready: App_3');
	
	//const REST_URI = "http://localhost:3000";
	
	var requestURL_getBatchNames = REST_URI+'/getBatchNames/';
	var requestURL_getPeople = REST_URI+'/getPeople/';
	var requestURL_getDays = REST_URI+'/getDays/';
	var requestURL_markPersonPresent = REST_URI+'/markPersonPresent/';

	//---------------------------------------------------------------------
	$('#div_info').hide();
	$('#div_notification').hide();
	
	//$('#id_all_batches').hide();
	//$('#id_addPersonUI').hide();
	
	//$('#btn_add_person').hide();

	//$('#btn_markPresent').hide();

	//---------------------------------------------------------------------
	var selectedBatchName = 'nothing';
	var selectedBatchId = '0';
	var selectedGroupName = '0';
	var selectedDay = {};
	// Batch Selection
	$('#id_all_batches').on('change',function(event){
		var a = $('#id_all_batches')[0];
		var i = a.options.selectedIndex;
		if( a.options[i].value == 0 ){
			$("#id_sBName").text( 'No batch!' );
			selectedBatchName = 'nothing';
			selectedBatchId = '0';
		}else{
			selectedBatchName = a.options[i].label;
			selectedBatchId = a.options[i].value;
			// setting batch name in display
			$("#id_sBName").text( selectedBatchName );
			//
			$('#id_addPersonUI').show();
			// getting people of this batch
			getPersonsOfBatch(selectedBatchName);
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
	// Day Selection
	$('#id_allDaysOfBatch').on('change',function(event){
		var a = $('#id_allDaysOfBatch')[0];
		var i = a.options.selectedIndex;
		//console.log('app_3.js : Day Selection : id=',i);

		var theDay = {};

		// get the day from the "id"
		//console.log('allDaysObjs',allDaysObjs);
		var j = 0;
		for(j;j<allDaysObjs.length;j++){
			
			//console.log('allDaysObjs',allDaysObjs);

			// Note :
			// It is possible to have
			// allDaysObjs[j] !== undefined
			// because we have set index 0 as undefined while sorting the Days Array in last function
			//

			//console.log('i',i,':','j',j);
			//console.log('allDaysObjs[j]',allDaysObjs[j]);
			
			//console.log(allDaysObjs[j].id,i);

			//if( i == allDaysObjs[j].id ){
			if( i == j ){
				//console.log(allDaysObjs[j]);
				theDay = allDaysObjs[j];
				//console.log('inside for loop, theDay=',theDay);
				break;
			}
			
		}
		
		// The Selected Day
		console.log( theDay );
		selectedDay = theDay;
		//
		return false;
	});
	//---------------------------------------------------------------------
	//---------------------------------------------------------------------
	// Get Batch names to show
	const getAllBatchNames = function(){
		//console.log('getAllBatchNames');
		showInfoToUser('Wait. Getting all Batch names.');

		fetch(requestURL_getBatchNames).then(function(resultData){
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
	};

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
	}
	//---------------------------------------------------------------------
	

	$('#btn_markPresent').on('click',function(event){
		console.log('MarkPresent:Click:');
		console.log('aPersons=',aPersons);
		
		var batchTime = $("input[name=answer]:checked").val();
		//var markingForDate = $('#date_of_presence').val();
		//var markingForDate = selectedDay;
		var markingForDate = selectedDay.date;

		console.log('Batch = ',batchTime);
		console.log('Date = ',markingForDate);

		//
		if( selectedBatchName == 'nothing' ){
			showModalInfo('Which Batch? <strong>Select</strong> a Batch.');
		}else{
			if( aPersons.length == 0 ){
				showModalInfo('Whom to mark present? Select <strong>some people</strong>.');
			}else{
				if( batchTime==undefined ){
					showModalInfo('Which session, Morning or Evening?');
				}else{
					if( markingForDate==undefined ){
						showModalInfo('Which Date? Select a Date.');
					}else{
						showModalConfirmation('Marking for : <strong>'+ markingForDate +'</strong><br>Session : <strong>'+ batchTime +'</strong><br>Batch : <strong>'+ selectedBatchName +'</strong><br>Total present <strong>'+ aPersons.length + '</strong>.<br><br>' );
					}
				}
			}
		}
	});// Click /

	//---------------------------------------------------------------------
	const savePresentsMarking = function(){
		var batchTime = $("input[name=answer]:checked").val();
		var markingForDate = selectedDay.date;
		console.log('savePresentsMarking : Batch = ',batchTime);
		console.log('savePresentsMarking : Date = ',markingForDate);
		console.log('savePresentsMarking : aPersons = ',aPersons);
		//-------------------------------------------------------
		// getting name of the person
		aPersons.map(function(item,index){
			allPeopleObjs.map(function(item1,index1){
				if(item1.id==item){
					//console.log('------ Mark Present ------');
					//console.log(item1);
					var fetchData = JSON.stringify({
																"person": item1, 
																"batchTime":batchTime, 
																"onDate":markingForDate
															});
					//
					var fetchData = {
								method : 'POST',
								body : fetchData,
								mode : 'cors',
								headers : new Headers({
										'Content-Type': 'application/json'
									})
							};
					//		
					fetch(requestURL_markPersonPresent,fetchData).then(function(resultData){
		  			resultData.json().then(function(rData){
		  				console.log(rData);
		  				if(rData.result == 'SUCCESS'){
		  					showInfoToUser('SUCCESS! Marked Present.')
		  				}else{
		  					showInfoToUser('FAIL! Please try again.');
		  				}
		  			}).catch(function(error2){
		  				console.log('error2');
		  				console.log(error2);
		  				console.log('error2 /');
		  			});
					}).catch(function(error1){
						console.log('---------- : error1 : ------------ ');
						console.log(error1);
						console.log('---------- : error1 / : ------------ ');
					});
					//
				}else{
					// Do Nothing
				}
			});
		});
		//-------------------------------------------------------
	}
	//---------------------------------------------------------------------
	// Get all persons of the selected Batch
	const getPersonsOfBatch = function(batchName){
		console.log('getPersonsOfBatch: batchName=',batchName);

		showInfoToUser('Wait. Getting Batch <strong>Details</strong>.');

		fetch(requestURL_getPeople+batchName).then(function(resultData){
			resultData.json()
		  	.then(function(rData){
		  		$('#div_info').hide();
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
		//var allViewLi = '<option value="0"> - Choose a Batch - </option>';

		// Check for the numbers
		if(aPeople.length>0){
			var allLi = aPeople.map( person => {
				//var s = '<option value=' + batch['id'] +'>' + batch['name'] + '</option>';
				var batch = ( person.batch_is_morning ? '<span class="is-size-6 has-text-info"> M </span>' : '<span class="is-size-6 has-text-danger"> E </span>' );
				//var s = '<li><label class="checkbox"><input type="checkbox" onclick="onPersonClicked('+person.id+')">'+person.name+' | '+person.phone+' | id='+person.id+' | isMorning='+person.batch_is_morning+'</label></li>';
				var s = '<li><label class="checkbox is-size-4"><input type="checkbox" onclick="onPersonClicked('+person.id+')"> <span style="padding-left:1em;"></span>' + person.name + ' . '+batch+' . ' +'<span class="is-family-monospace is-size-6">' + person.phone +'</span>' +'</label></li>';
				allViewLi+= s;
			});
			//$('#id_all_people').html(allViewLi);
		}else{
			allViewLi = 'No one yet!';
		}
		//
		$('#id_all_people').html(allViewLi);
		//
		// getting days of this batch
		getDaysOfBatch(selectedBatchName);
	}
	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Get all persons of the selected Batch
	const getDaysOfBatch = function(batchName){
		console.log('getDaysOfBatch : batchName=',batchName);
		fetch(requestURL_getDays+batchName).then(function(resultData){
			resultData.json()
		  	.then(function(rData){
		  		renderDaysOfTheBatch(rData);
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
	const renderDaysOfTheBatch = function(aDays){
		console.log('renderDaysOfTheBatch');
		//
		const sortBatchDays = function(allDays){
			var i = 0;
			var sName = '';
			var n = 0;
			var aSorted = [];
			for(i;i<allDays.length;i++){
				sName = allDays[i].name;
				n = Number ( sName[sName.length-1] );
				aSorted[n] = allDays[i];
			}
			return aSorted;
		}
		//
		//allDaysObjs = aDays;
		allDaysObjs = sortBatchDays( aDays );

		var allViewLi = '';
		//
		var allViewLi = '<option value="0"> - Choose a Day - </option>';
		const allLi = allDaysObjs.map( day => {
			var s = '<option value=' + day['id'] +'>' + day['name'] + '</option>';
			allViewLi+= s;
		});
		$('#id_allDaysOfBatch').html(allViewLi);
		//
	}
	//---------------------------------------------------------------------

	// modal
	const showModalInfo = function(message){
		$('#id_info_modal').addClass('is-active');
		$('#id_modal_info_box').html(message);
	}
	$('#id_modal_info_close_button').on('click',function(eventData){
		$('#id_info_modal').removeClass('is-active');
	});

	const showModalConfirmation = function(message){
		$('#id_confirm_modal').addClass('is-active');
		$('#id_confirm_details').html(message);
	}
	$('#btn_confirm_yes').on('click',function(eventData){
		eventData.preventDefault();
		//
		$('#id_confirm_modal').removeClass('is-active');
		savePresentsMarking();
		//
		return false;
	});
	$('#btn_confirm_no').on('click',function(eventData){
		eventData.preventDefault();
		//
		$('#id_confirm_modal').removeClass('is-active');
		//
		return false;
	});
	// modal /

	const showInfoToUser = function(message){
		$('#div_info').html(message);
		$('#div_info').show();
	}

	//---------------------------------------------------------------------
	getAllBatchNames();
	//
}); // jQuery Init /END
//

// Global variables
var allPeopleObjs = []; // all people
var allDaysObjs = []; // all days
var aPersons = []; // selected Persons ids
//var aPersonNames = [];

const onPersonClicked = function(id){
	console.log('onPersonClicked');
	//TODO: Fix the duplicates
	addRemove(id);
}

const addRemove = function(id){
	var matchFound = false;
	aPersons.map(function(item,index){
		if(id==item){
			matchFound = true;
			aPersons.splice(index,1);
		}
	});
	if(matchFound){
		//DoNothing
	}else{
		aPersons.push(id);
	}
	console.log('Persons:',aPersons);
	//console.log('PersonNames',aPersonNames);
	// sort
	// by number instead of string, which is default
	aPersons.sort(function(a2,a1){
		console.log('a1,a2 =',a1,a2);
		return (a2-a1);
	});
	console.log('Persons:',aPersons);
}

//