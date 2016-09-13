/*function supports_history_api() {
  return !!(window.history && history.pushState);
}

console.log(supports_history_api());
*/

var states = new Array();
var isPub = false;

var studentname = " ";
var currentState = 'ex0';

//the state object stores everything that we need to create the material from scratch


function stateObj(thematerial){
	this.mat = thematerial.name;
	this.view1 = thematerial.firstView;
	this.view2 = thematerial.lastView;
	this.det = thematerial.isDetached;
	this.tbl = thematerial.isTableHidden;
	this.shfl = thematerial.isTableShuffle;
	this.elcount = thematerial.elcount; 
	this.tkcount = thematerial.tickcount;
	this.add = thematerial.isAddRemove;
	this.text = encodeURIComponent(thematerial.text);
	this.data = [];

	
	//this.content = this.mat+' : '+this.mode+' '+this.icon+' '+this.background+' '+this.view1+' '+this.view2+'<br> data: '+thematerial.groups.length;
	
	for(var g=0; g<thematerial.groups.length; g++){
		this.data.push({ rowindex: thematerial.groups[g].iconnum, count: thematerial.groups[g].numelements, usercount: thematerial.groups[g].numuserelements});
	}

}




/*function getDataFromState(stateObject){
		var str = '';
		
		for(var d=0; d<stateObject.data.length; d++ ){
				str += stateObject.data[d].rowindex+'-'+stateObject.data[d].count+',';
		}
		
		return str;
}*/



function getDataFromArray(array){	
	
	var res = [];
	for (var key in array) {
		if (array.hasOwnProperty(key)) {
			var isrow = key.slice(0, -1);
			
			if(isrow == 'row'){
				var rowindx = key.slice(-1);
				var both = array[key].split("-");
				res.push({ rowindex: rowindx, count: both[0], usercount: both[1]});
			}
		}
	}
	
	return res;
}



function updateContent(stateObj){
	console.log("updateContent ??");
	
	/*
	if(stateObj){
		document.mat='Cest La Vis: '+stateObj.mat;
		
		initViews(	stateObj.mat, 
					stateObj.view1, 
					stateObj.view2,
					isPub,
					stateObj.det,
					stateObj.elcount,
					stateObj.tkcount,
					stateObj.data);	
					
					
		$("#slider-range").slider('values',0, views.indexOf(stateObj.view1)); 
		$("#slider-range").slider('values',1,views.indexOf(stateObj.view2)); 
		
		for(var v=0; v<views.length; v++){
			var viewicon = views[v]+'_state';
			if(views[v] == stateObj.view1 || views[v] == stateObj.view2 )
				document.getElementById(viewicon).style.borderColor = "black";
			else
				document.getElementById(viewicon).style.borderColor = "transparent";
		}
		
		
		$('.load-content').each(function() {
			$(this).prop("checked", false);
			
			//console.log($(this).val(),stateObj.mat );
			
			if( $(this).val() == stateObj.mat ){
				
				$(this).prop("checked", true);
			}
		});

	}
	*/
}

window.history.length = 10;

window.addEventListener('popstate',function(event){
    //console.log("go back");
    console.log("popstate fired: ", location.href);
    location.reload();
	updateContent(event.state);
	
});


var serialize = function(obj, re) {

	var result ='';

	$.each(obj, function(i, val) {
	
		//console.log(i);

		if ((re && re.test(i)) || !re){

			if(i == 'data'){
				for(var v=0; v<val.length; v++)
					result = result.concat('&row'+ val[v].rowindex + '=' + val[v].count +'-'+val[v].usercount); 
			}
			else{
				if(i == 'mat'){
					result = result.concat('?');
				}
				else{
					result = result.concat('&');
				}
			
				result = result.concat( i + '=' + (typeof val == 'object' ? val.join  ? val.join('')  : serialize(val) :  val ));
			}
		}

	});

	return result;

};

	



var record = function () {
	
    var desc = document.getElementById("textinput").value;
    if(desc != "Enter your textual description here.")
    	material.text = desc;
    else
    	material.text = " ";
    
   

	var thestate = new stateObj(material);
	states.push(thestate);
	
	
	if(states.length > 1)
		document.getElementById("nxtbtn").style.visibility = "visible";

	
	rewriteURL();
	
	//create button
	var element = document.createElement("input");
	element.type = 'button';
	element.className = 'round-btn';
	//element.value = 'Exercise '+ states.length; 
	var param = 'ex'+ (states.length -1);
	element.id = param;
	
	element.name = serialize(thestate, /mat|view1|view2|det|tbl|shfl|elcount|tkcount|add|text|data|/);
	                                  
	
	document.getElementById('exercises').appendChild(element);
	document.getElementById('exercises').innerHTML = document.getElementById('exercises').innerHTML  + ' &nbsp;';
	
	currentState = param;
	
	for(var s=0; s<states.length; s++)
	{
		var butid = 'ex'+ s;
	
		$(document).on('click','#'+butid, function(){
			onClickButton(this.name, this.id, false);   
		});
	}
	
	
	$( '.round-btn' ).css( "background-color", "#aaa" );
	$( '#'+param ).css( "background-color", "#333" );
	
	//below causes page refresh 
	/*var untilhash = '';
	var loc = window.location.href;
	if (loc.indexOf("#") >= 0)
    	untilhash = loc.substr(0, loc.indexOf("#"));
    else
    	untilhash = loc;
    	
    console.log("until hash: ", untilhash);
    
	window.location.href = untilhash +'#'+ add;
	*/
}


function parseEx(exampleurl){
	//returns and associative array
	var decoded = decodeURIComponent(exampleurl); 
	var parts  = decoded.split('&');
	
	//console.log('parts: ', parts);
	
	var results = {};
	
	for(var p=0; p<parts.length; p++){
		var pair = parts[p].split('='); 
		//console.log(pair[0]);
		results[pair[0]] = pair[1];

	}
	
	return results;

}






function stateObjFromString(decoded){
	this.mat = decoded['?mat'];
	this.view1 = decoded['view1'];
	this.view2 = decoded['view2'];
	this.elcount = decoded['elcount']; 
	this.det = (decoded['det'] == "true");
	this.text = decodeURIComponent(decoded['text']);
	this.data = getDataFromArray(decoded);
}

function rewriteURL(){
	var thestate = new stateObj(material);
	
	var add = '?pub='+isPub +'&name='+studentname;
	//var print = "";
	for(var s=0; s<states.length; s++)
	{
	    var st = states[s];
		var res = serialize(st, /mat|view1|view2|det|tbl|shfl|elcount|tkcount|add|text|data|/);
		
		/*var butid = 'ex'+ s;
		
		document.getElementById(butid).name = res;
		
		
		$(butid).unbind().click(function() {
				onClickButton(this.name, this.id, false);
		});*/
		
		//print += "&ex"+s+"="+res;
		add += "&ex"+s+"="+encodeURIComponent(res);
	}
	
	//console.log("rewrite: ", print);
	history.pushState(thestate, null, '#'+add);
}

function replaceState(stateid){
	
	var thestate = new stateObj(material);
	
	var stateIndx = parseInt(stateid.slice(2)); 
	
	if(states.length > stateIndx){
		states[stateIndx] = thestate;
		
		
		var res = serialize(thestate, /mat|view1|view2|det|tbl|shfl|elcount|tkcount|add|text|data|/);
	
		var butid = stateid;
        //console.log("here: ", butid,  document.getElementById(butid));
	    document.getElementById(butid).name = res;
	    document.getElementById(butid).onclick = function() { onClickButton(this.name, this.id, false); }
		
        
	}	
	rewriteURL();

}


function onClickButton(param, id, boolmode){
	
	if((isPub == true || isPub == 'true') && (typeof material !== "undefined")){
		//console.log("save current state at id: ", currentState);
		replaceState(currentState);
	}
	
	var decoded = '';

	if(boolmode)
		decoded = parseEx($.address.parameter(param));	
	else
		decoded = parseEx(param);
		
		
	
	
	
	var isdetach = (decoded['det'] == "true");
	var istabhide = (decoded['tbl'] == "true");
	var istabshuffle = (decoded['shfl'] == "true");
	var isAdd = (decoded['add'] == "true");
	
	initViews(	decoded['?mat'], 
				decoded['view1'], 
				decoded['view2'],
				isPub,
				isdetach,
				istabhide,
				istabshuffle,
				decoded['elcount'],
				decoded['tkcount'],
				isAdd,
				decodeURIComponent(decoded['text']),
				getDataFromArray(decoded)
				);
		
	
	//$( '.round-btn' ).css( "background", "url(images/buttonBg2.png) center center no-repeat" );
	//$( '#'+id ).css( "background", "url(images/buttonBg.png) center center no-repeat" );
	
	$( '.round-btn' ).css( "background-color", "#aaa" );
	$( '#'+id ).css( "background-color", "#333" );
	
	currentState = id;

	$("#slider-range").slider('values',0, views.indexOf(decoded['view1'])); 
	$("#slider-range").slider('values',1, views.indexOf(decoded['view2'])); 

	for(var v=0; v<views.length; v++){
		var viewicon = views[v]+'_state';
		if(views[v] == decoded['view1'] || views[v] == decoded['view2'] )
			document.getElementById(viewicon).style.borderColor = "black";
		else
			document.getElementById(viewicon).style.borderColor = "transparent";
	}

	

	$('.load-content').each(function() {
		$(this).prop("checked", false);

		//console.log($(this).val(),stateObj.mat );

		if( $(this).val() == decoded['?mat'] ){
	
			$(this).prop("checked", true);
		}
	});	
}

function clickNext(){
	console.log(currentState);
	
	var stateIndx = parseInt(currentState.slice(2)); 
	stateIndx ++;
	
	if(states.length > stateIndx){
		var nextid = 'ex'+stateIndx;
		onClickButton(document.getElementById(nextid).name, nextid, false);
	}
}

////////ADDRESS API////////

// Init and change handlers

$.address.init(

	function(event) {
		var params  = $.address.parameterNames(); 
		//console.log("params: ", params);
		
		
		if(params.length > 1){
			isPub = $.address.parameter('pub');
			studentname = $.address.parameter('name');
			
			if(studentname !== " ")
				document.getElementById("entername").innerHTML = studentname + "&nbsp; &nbsp;";
			
			for(var p=2; p<params.length; p++){
				var element = document.createElement("input");
				//Assign different attributes to the element. 
				element.type = 'button';
				element.className = 'round-btn'; 
				element.id = params[p];
				element.name = $.address.parameter(params[p]);
				document.getElementById('exercises').appendChild(element);
				document.getElementById('exercises').innerHTML = document.getElementById('exercises').innerHTML  + ' &nbsp;';
			}
			
			params.forEach(function(entry) {
			    if(entry !== 'pub' && entry !== 'name' ){
			    
			    	var st = parseEx($.address.parameter(entry));
					var state = new stateObjFromString(st);
					
					
					//console.log("state", state);
					
					states.push(state);
						
					document.getElementById(entry).onclick = function(){
						onClickButton(entry, entry, true);			
					};
				}
			});
			
			if(states.length > 1)
				document.getElementById("nxtbtn").style.visibility = "visible";
			
			onClickButton('ex0', 'ex0', true);
			
			
		}
		else{
		
			console.log("start with default material");
			
			var defaultdata = [];
			defaultdata.push({ rowindex: 0, count: 2});
			defaultdata.push({ rowindex: 1, count: 5});
			defaultdata.push({ rowindex: 3, count: 3});
			
			initViews(	"material1", 
						"scatter", 
						"bar",
						"false",  // isPub, isdetach, istabhide, istabshuffle,
						false,
						false,
						false,
						1,
						1,
						true,
						"Enter your textual description here.",
						defaultdata
						);
		}
		
}).bind('change', function(event) {

	//console.log('adress change event fired: ', $.address.path());
	

});




	
