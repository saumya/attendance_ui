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
	
	$('#id_all_batches').hide();
	$('#id_addPersonUI').hide();
	//$('#btn_add_person').hide();

	$('#btn_markPresent').hide();

	//---------------------------------------------------------------------
	var selectedBatchName = 'nothing';
	var selectedBatchId = '0';
	var selectedGroupName = '0';
	var selectedDay = {};
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
			//console.log( a.options[i].value+':'+a.options[i].label );
			
			selectedBatchName = a.options[i].label;
			selectedBatchId = a.options[i].value;

			// setting batch name in display
			$("#id_sBName").text( selectedBatchName );
			//
			$('#id_addPersonUI').show();
			
			// getting people of this batch
			getPersonsOfBatch(selectedBatchName);
		}

		/*
		//console.log('onChange:',selectedBatchName,',',selectedBatchId);
		if(selectedBatchId == 0){
			//console.warn('Disable the AddPersonUI');
			$('#id_addPersonUI').hide();
		}else{
			$('#id_addPersonUI').show();
		}	
		*/

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

		/*
		// AddPerson Button
		if(selectedGroupName==0){
			$('#btn_add_person').hide();
		}else{
			$('#btn_add_person').show();
		}
		*/
	});
	//---------------------------------------------------------------------
	// Day Selection
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
		//
		$('#btn_markPresent').show();
		//
		return false;
	});
	//---------------------------------------------------------------------
	//---------------------------------------------------------------------
	// Get Batch names to show
	$('#btn_show_allBatchNames').on('click',function(){
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
	});

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

		// getting name of the person
		aPersons.map(function(item,index){
			//console.log('person id=',item);
			/*
			var i = 0;
			for( i; i<allPeopleObjs.length; i++ ){
				if (allPeopleObjs[i].id == item) {
					console.log(allPeopleObjs[i]);
				}
				//console.log( allPeopleObjs[i] );
			}
			*/

			allPeopleObjs.map(function(item1,index1){
				if(item1.id==item){
					console.log('------ Mark Present ------');
					console.log(item1);
					//
					// requestURL_markPersonPresent;
					var fetchData = {
								method:'POST',
								body:JSON.stringify({"person": item1, "batchTime":batchTime, "onDate":markingForDate}),
								mode: 'cors',
								headers:new Headers({
									'Content-Type': 'application/json'
								})
							};
					//		
					fetch(requestURL_markPersonPresent,fetchData).then(function(resultData){
						console.log('------- RESULT --------');
		  			//console.log(resultData);
		  			resultData.json().then(function(rData){
		  				console.log(rData);
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
				}
			});

		});
	});

	//---------------------------------------------------------------------
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
		  		/*
		  		console.log('------- getPersonsOfBatch:data ---------');
		  		console.log(rData);
		  		console.log('------- getPersonsOfBatch:data / -------');
		  		*/
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
		//console.log(aDays);
		//allPeopleObjs = aPeople;
		allDaysObjs = aDays;
		var allViewLi = '';
		//
		var allViewLi = '<option value="0"> - Choose a Day - </option>';
		const allLi = aDays.map( day => {
			//console.log(batch);
			//var s = '<option value='+ batch['id'] +'>'+batch['id']+'-'+batch['name']+'</option>';
			
			//var s = '<option value=' + day['id'] +'>' + day['name']+'-id='+day['id'] + '</option>';
			var s = '<option value=' + day['id'] +'>' + day['name'] + '</option>';
			allViewLi+= s;
		});
		//console.log(allViewLi);
		$('#id_allDaysOfBatch').html(allViewLi);
		//
	}
	//---------------------------------------------------------------------

	//---------------------------------------------------------------------


}); // jQuery Init /END
//

// Global variables
var allPeopleObjs = []; // all people
var allDaysObjs = []; // all days
var aPersons = []; // selected Persons ids
//var aPersonNames = [];

const onPersonClicked = function(id){
	//const onPersonClicked = function(id,name){
	console.log('onPersonClicked');
	//console.log('person id=',id);
	//aPersons.push(id);
	//console.log('aPersons=',aPersons);
	//TODO: Fix the duplicates

	addRemove(id);
}

const addRemove = function(id){
	//console.log('addRemove : id=',id);
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