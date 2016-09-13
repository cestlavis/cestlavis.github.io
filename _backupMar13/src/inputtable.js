function Add(rowindex){

	var count = document.getElementById('CountButton'+rowindex).value;
	if(count>0)
		material.addGroup(rowindex, count);
	else{
		material.removeGroup(rowindex);
	}
	
	publishInputTable();
	
}



function preAddInput(rowindex, count, usercount){

	document.getElementById('CountButton'+rowindex).value = count;
	material.addGroup(rowindex, count);
	
	if(usercount > 0){
		material.addUserElements(rowindex, usercount);
	}
	
	publishInputTable();
	
}


function createInputTable(){
	var table = document.getElementById('inputtable');
	

	
	while (table.firstChild) {
 		table.removeChild(table.firstChild);
 	}
 	
 	
	for(var i=0; i< 7; i++){
	    var rowindex = i;
		var row = document.createElement('tr');
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
			
	
		var iconname = ""+material.icons+i;
		var iconlabel = names[material.icons][i];
		
		td1.innerHTML = iconlabel+'<img src="icons/'+material.icons+'/'+iconname+'.svg" alt="'+iconname+'" height="35" width="35">';
		td2.innerHTML = '<input type="number" min="0" max="10" maxlength="2" size="12"  id="CountButton'+rowindex+'" onchange="Add('+rowindex+')"/> <br>';
		
		
		row.appendChild(td1);
		row.appendChild(td2);
		
		table.appendChild(row);
		
		addIconPattern(iconname);
		
	}
	
	
}

function publishInputTable(){

	var inputtable = document.getElementById('inputtable');
	var finaltable = document.getElementById('finaltable');
   	
	/*
	if(material.isTableHidden){
		finaltable.style.visibility = "hidden";
		return;
		
   	}
   	else{*/
   		finaltable.style.visibility = "visible";
		if(material.isTableShuffle){
			$('#preview-col-vis').insertBefore('#preview-col-1');
			d3.select('#preview-col-1 .datatable').style('float', 'left');
			d3.select('#spacer').style('display', 'none');
		}
		else{
			$('#preview-col-1').insertBefore('#preview-col-vis');
			d3.select('#preview-col-1 .datatable').style('float', null);
			d3.select('#spacer').style('display', null);
		}
		
	//}
	
	// BEGIN JEREMY EDIT
	var colorAttr = finaltable['__colorAttr__'];
	// END JEREMY EDIT

	//first clear final table
	while (finaltable.firstChild) {
 		finaltable.removeChild(finaltable.firstChild);
 	}
 	
 	var initrow = document.createElement('tr');
	var inittd1 = document.createElement('td');
	inittd1.innerHTML = "Données"
	initrow.appendChild(inittd1);
	finaltable.appendChild(initrow);
 	
 	
 	for (var g=0; g<material.groups.length; g++){
 		var group = material.groups[g];
 		var indx = group.iconnum;
 		
 		var therow = inputtable.rows[indx];
 		var content = therow.cells[1].innerHTML;
 		
 		var count = group.numelements;
 		
 		var row = document.createElement('tr');
	 	var td1 = document.createElement('td');
	 	var td2 = document.createElement('td');
	 		
	 	row.appendChild(td1);
		
	 	finaltable.appendChild(row);
	 		
	 	row.cells[0].innerHTML = therow.cells[0].innerHTML; 
	 	row.cells[0].style.textAlign = "right";
	 	if(!material.isTableHidden){
	 	    row.appendChild(td2);
	 		row.cells[1].innerHTML = count;
	 	    row.cells[1].style.width = "40px";
	 	    
	 	 }
 		
 	}

 	// BEGIN JEREMY EDIT
 	if (colorAttr) {
	 	d3.selectAll('#finaltable td')
	 		.style('background-color', 'rgba(' + colorAttr.c + ', .9)')
	 		.style('border-color', 'rgb(' + colorAttr.cmp + ')')
	 		//.style('color', 'rgb(' + colorAttr.cmp + ')');
	}
 	// END JEREMY EDIT
}



function updateInputTable(){
	var table = document.getElementById('inputtable');
	
	for (var i = 0; i<table.rows.length; i++) {
		var therow = table.rows[i];
		var iconname = ""+material.icons+i;
		
		var iconlabel = names[material.icons][i];
		therow.cells[0].innerHTML =iconlabel+'<img src="icons/'+material.icons+'/'+iconname+'.svg" alt="'+iconname+'" height="35" width="35">';
	}

	publishInputTable();
}


function updateInputTableCountLimit(){
	var table = document.getElementById('inputtable');
	var maxcount = 10 * document.getElementById("elementcount").value;
	for (var i = 0; i<table.rows.length; i++) {
	    document.getElementById('CountButton'+i).max = maxcount;
	}
}









