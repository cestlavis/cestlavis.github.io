var material; 
window['material'] = material;


var panels = [outerGroup1, outerGroup2];


function setAxisBegin(){
	material.begincount = document.getElementById("tickbegins").value;
	
	adjustCount();

}

function setTickCount(){
	material.tickcount = document.getElementById("tickoptions").value;
	setTickMarks();
}

function float2int (value) {
    return value | 0;
}


function setTickMarks(){
	var elcount = parseInt(material.elcount);
	var tickcnt = parseInt(material.tickcount);
	var begin = parseInt(material.begincount);
	
	var tickvals = [];
	
	//console.log(elcount, tickcnt, begin);
	
	for(var ind=begin; ind<=(elcount*10 + begin); ind++){
		if(tickcnt == 1){
		    //console.log(ind);
			tickvals.push(float2int(ind));
		}	
		else{
			if((ind % tickcnt) == 0)
				tickvals.push(float2int(ind));
		}
	}


    var rangex = 15; 
	var rangey = 645;
	
	
	if(material.mode == "cat"){
		rangex = -20;
		rangey = 610;
	}
	else if(material.mode == "scale"){
		rangex = -10;
		rangey = 620;
	}
	
	var yScale = d3.scale.linear()
                    .domain([(10*elcount + begin), begin])
                    .range([rangex,rangey]);
                         
	var yAxis = d3.svg.axis()
					.scale(yScale)
					.tickValues(tickvals) //.ticks(realtickcount)
					.orient("left");
					
    var newaxis = d3.selectAll(".yaxis")
    				.call(yAxis);
}

function adjustCount(){

	var elcount = document.getElementById("elementcount").value; 
    material.elcount = elcount;
    
    
	var rangex = 15; 
	var rangey = 645;
	
	
	if(material.mode == "cat"){
		rangex = -20;
		rangey = 610;
	}
	else if(material.mode == "scale"){
		rangex = 0;
		rangey = 605;
	}
    
   if(elcount > 1){
   		document.getElementById("legend").style.visibility = "visible";
   		document.getElementById("legend").innerHTML = 'Each shape represents '+ material.elcount + ' items.';
   	}
   	else
   		document.getElementById("legend").style.visibility = "hidden";
    
    
	
	for(var g=0; g<material.groups.length; g++){
	
		material.groups[g].updateCount();
		
	}
	
	updateInputTableCountLimit();
	material.updateMaterial();
	setTickMarks();
	
	
	
}

function setScale(sc){
	var svgps = [svg_pane1, svg_pane2]; 
	var rt = sc/width; //desired width to original width ratio
	//console.log("scale ratio: "+rt);
	var ht = rt*height;   
    for(var p = 0; p<panels.length; p++){
    	panels[p].attr("transform", "scale("+rt+")");
    	
    	svgps[p].attr("width", sc);
    	svgps[p].attr("height", ht);
    }
    
    var clist = document.getElementsByClassName("container");
    
	for(var c=0; c<clist.length; c++){
    	clist[c].style.width = sc+"px";
    }
}


function createNameBox(){
	
	var input = document.createElement('input'); 
	input.type = "text"; 
	input.id = "nameinput";
	document.getElementById("entername").appendChild(input);
	
	var but = document.createElement("input");
	but.type = 'button';
	but.id = 'namebutton';
	but.value = 'Enter Name';
	document.getElementById("entername").appendChild(but);
	
	document.getElementById("entername").innerHTML = document.getElementById("entername").innerHTML + "&nbsp; &nbsp;";
	
	
	document.getElementById("namebutton").onclick = function(){
	  studentname = document.getElementById("nameinput").value;
	  document.getElementById("entername").innerHTML = document.getElementById("nameinput").value + "&nbsp; &nbsp;";
	  
	  //set up the new URL
	  rewriteURL();
	  
	}
	
}

function publishViews(){

	if(isPub == true)
		return;
    
	setScale(width);
    
    console.log("called publish");
    
	document.getElementById("intro").style.display = "none";
	document.getElementById("viewselection").style.display = "none";
	
	
	document.getElementById("publish").style.display = "none";
	document.getElementById("record").style.display = "none";

   
	var desc = document.getElementById("textinput").value;
	
	if(desc != "Enter your textual description here."){
		document.getElementById("description").style.display = "";
		document.getElementById("description").innerHTML = desc;
		
	}	
	
	material.published = true;
	
    isPub = true;

	if(studentname === " "){
		createNameBox();
	}
	
	rewriteURL();
	
}

function unPublish(){
	setScale(300);
	
	if(document.getElementById("showtable").checked){
    	document.getElementById("contain_finaltable").style.visibility = "";
    	publishInputTable();
    }
    else
     	document.getElementById("contain_finaltable").style.visibility = "hidden";
    
	document.getElementById("intro").style.display = "";
	document.getElementById("viewselection").style.display = "";
	
	document.getElementById("description").style.display = "none";
	
	document.getElementById("publish").style.display = "";
    
	//document.getElementById("contain_vis1").style.marginLeft = "150px";
   
	
	isPub = false;
	//rewriteURL();
	
	
}




function adaptCSS(){
	var urlString = 'url(images/'+material.background+'.jpg)';
	//var urltopString = 'url(images/'+material.background+'top.png)';
	/*document.getElementById("header").style.backgroundImage =  urlString;
	document.getElementById("maindiv").style.backgroundImage =  urlString;*/
	d3.select('body').style('background-image', urlString);

	// START JEREMY EDIT: ADDING COLOR THIEF HERE
	d3.select('#ref-steps').style('visibility', 'hidden');

	var img = d3.select('body')
		.append('div')
		.attr('class', 'temp-img hide')
	.append('img')
		.attr('src', 'images/' + material.background + '_low.jpg')
		.on('load', function () {
			var colorthief = new ColorThief(),
				color = colorthief.getColor(img.node()),
				complementary = [255 - color[0], 255 - color[1], 255 - color[2]];

			if (material.name !== 'material5' && material.name !== 'material6') {
				d3.selectAll('.pane')
					.style('background-color', 'rgba(' + color + ', .9)')
				d3.selectAll('.container')
					.style('border-color', 'rgb(' + complementary + ')')
					.style('border-top-width', '5px');
					//.style('box-shadow', '0px 0px 100px rgba(' + color + ',.75)');
				/*d3.select("#contain_finaltable")
					.style('background-color', 'rgba(' + color + ', .9)');
					//.style('box-shadow', '0px 0px 100px rgba(' + color + ',.75)');
				d3.select('#preview-col-1')
					.style('border-top-color', 'rgb(' + complementary + ')');*/
			} else {
				d3.selectAll('.pane')
					.style('background-color', 'transparent');
				d3.selectAll('.container')
					.style('border-color', 'transparent')
					.style('border-top-width', '0px');
			}
			
			d3.selectAll('#finaltable td')
				.style('background-color', 'rgba(' + color + ', .9)')
				.style('border-color', 'rgb(' + complementary + ')')
				//.style('color', 'rgb(' + complementary + ')');
			// STORE THE COLOR INFO IN THE TABLE
			d3.select('#finaltable').node()['__colorAttr__'] = { c: color, cmp: complementary };


			d3.selectAll('.descriptions-container')
				.style('background-color', 'rgba(' + color + ', .9)')
				//.style('color', 'rgb(' + complementary + ')');

			d3.selectAll('#tridwnpattern')
				.style('fill', 'rgb(' + complementary + ')');
			d3.selectAll('#tripattern')
				.style('fill', 'rgb(' + complementary + ')');

			d3.selectAll('.axis > .tick > text')
				.style('fill', 'rgb(' + complementary + ')');
			d3.selectAll('.axis > .tick > line')
				.style('stroke', 'rgb(' + complementary + ')');
			d3.selectAll('.axis > path')
				.style('stroke', 'rgb(' + complementary + ')');

			//console.log(color)
				
				
			d3.selectAll('.meetaxisline').style('stroke', 'rgb(' + color + ')');

			/*d3.selectAll('.round-btn')
				.style('background-color', 'rgb(' + complementary + ')');*/

			var col1w = document.getElementById('contain_finaltable').getBoundingClientRect();
			document.getElementById("spacer").style.width = (col1w.right) + "px";
			d3.select('#ref-steps').style('visibility', null);

			d3.select('#legend')
				.style('background-color', 'rgba(' + color + ', .9)')
				//.style('color', 'rgb(' + complementary + ')');

			return d3.select(this).remove();
		})
	// END JEREMY EDIT
	
	var header = document.getElementById("header");
	header.style.color =  colors[material.icons][8];
	
	var texts = document.querySelectorAll(".whitetext");
	
	
	if(material.mode == 'coordination')
		document.getElementById("checkdetach").style.display = "";
	else
		document.getElementById("checkdetach").style.display = "none";
	
	
	for (var i = 0; i < texts.length; i++) {
    	texts[i].style.color = colors[material.icons][8];
    	texts[i].style.fontFamily = fonts[material.name][0];
    	texts[i].style.fontSize = fonts[material.name][1];
    }
		
    header.style.fontFamily = fonts[material.name][0];
    header.style.fontSize = fonts[material.name][2];



    // FOR DARK vs. LIGHT BACKGROUNDS
     if((themelevel == 2 ) && (material.name == "material3" || material.name == "material5")) {
		document.getElementById("scatter_state").src = "images/smallicons/scatter_w.png"
		document.getElementById("scatter_state").style.borderColor = "#FFF"
		document.getElementById("cluster_state").src = "images/smallicons/cluster_w.png"
		document.getElementById("stack_state").src = "images/smallicons/stack_w.png"
		document.getElementById("tally_state").src = "images/smallicons/tally_w.png"
		document.getElementById("bar_state").src = "images/smallicons/bar_w.png"
	 	document.getElementById("bar_state").style.borderColor = "white"
	 	document.body.style.color = 'white';
	 	document.getElementById("intro").style.backgroundColor = "#111";

	 	// START JEREMY EDIT
	 	d3.select('#legend')
	 		.style('color', '#FFF');
	 	d3.selectAll('.descriptions-container')
	 		.style('color', '#FFF');
	 	d3.selectAll('#finaltable td')
	 		.style('color', '#FFF');

	 	d3.select('#options-settings').selectAll('input[type="checkbox"] + label span')
	 		.style('background-image', 'url(icons/checked_not_white.png)')
	 		.classed('ticked', false)
	 	.on('click', function () {
	 		var node = d3.select(this);
	 		if (!node.classed('ticked')) return node.style('background-image', 'url(icons/checked_white.png)').classed('ticked', true);
	 		return node.style('background-image', 'url(icons/checked_not_white.png)').classed('ticked', false);
	 	});
	 	d3.select('#options-settings').selectAll('input[type="checkbox"]:checked + label span')
	 		.style('background-image', 'url(icons/checked_white.png)')
	 		.classed('ticked', true)
	 	.on('click', function () {
	 		var node = d3.select(this);
	 		if (!node.classed('ticked')) return node.style('background-image', 'url(icons/checked_white.png)').classed('ticked', true);
	 		return node.style('background-image', 'url(icons/checked_not_white.png)').classed('ticked', false);
	 	});
	 	// END JEREMY EDIT

   	}
    else {
		document.getElementById("scatter_state").src = "images/smallicons/scatter.png"
		document.getElementById("scatter_state").style.borderColor = "#111"
		document.getElementById("cluster_state").src = "images/smallicons/cluster.png"
		document.getElementById("stack_state").src = "images/smallicons/stack.png"
		document.getElementById("tally_state").src = "images/smallicons/tally.png"
		document.getElementById("bar_state").src = "images/smallicons/bar.png"
		document.getElementById("bar_state").style.borderColor = "#111"
		document.body.style.color = '#111';
		document.getElementById("intro").style.backgroundColor = "white"

		// START JEREMY EDIT
		d3.select('#legend')
			.style('color', null);
		d3.selectAll('.descriptions-container')
			.style('color', null);
		d3.selectAll('#finaltable td')
			.style('color', null);

		d3.select('#options-settings').selectAll('input[type="checkbox"] + label span')
			.style('background-image', null)
			.classed('ticked', false);
		// END JEREMY EDIT
   }
    ///////////////

    
	// START JEREMY EDIT
 	//if(material.name == "material1" || material.name == "material2")
	/*var col1w = document.getElementById('contain_finaltable').getBoundingClientRect();
	console.log(col1w)
	document.getElementById("spacer").style.width = (col1w.right) + "px";*/
	//else
    	    //document.getElementById("spacer").style.width = "390px";
   	// END JEREMY EDIT
   
    	
	
    
	
}

function initViews(matname, view1, view2, isPublished, isDetached, isTab, isShuf, elcount, tkcount, isAdd, text, tabledata){
	
	var matmode = materials[matname][0];
	var maticon = materials[matname][1];
	var matbg = materials[matname][2];
	
	
	
	 
	if(matmode == "cat")
		material = new Cat(matname, "cat", maticon, matbg);
	else if(matmode == "scale")
		material = new Scale(matname, "scale", maticon, matbg);
	else
		material = new Material(matname, matmode, maticon, matbg);
	
	
	
	
	
	
	adaptCSS();
	
	material.isDetached = isDetached;
	
	material.isTableHidden = isTab;
	material.isTableShuffle = isShuf;
	material.isAddRemove = isAdd;
	
	
	
	
	
	
	
	material.setFirstView (view1);
	material.setLastView (view2);
	
	material.setText(text);
		
	material.createMaterial();

	document.getElementById("elementcount").value = elcount;
	document.getElementById("tickoptions").value = tkcount;
	
	material.tickcount = tkcount; 
	material.elcount = elcount; 
	
	adjustCount();
	
	createInputTable();
	
	for(var d=0; d<tabledata.length; d++){
		
		preAddInput(tabledata[d].rowindex, tabledata[d].count, tabledata[d].usercount);
	}
	
	
	hideAddRemoveButtons();
	
	if(isPub == true || isPub == 'true')
	    publishViews();
	else
		unPublish();
	
	
	
}

function detachViews(cb){
	/*if(cb.checked)
		material.isDetached = true;
	else
		material.isDetached = false;
	*/	
	
	updateSelections(material.name);

}

function adaptOptions(){
	
	material.isDetached = document.getElementById("detach").checked;
	material.isTableShuffle = document.getElementById("shuffle").checked;
	material.isTableHidden = ! document.getElementById("showtable").checked;
	
	material.isAddRemove = document.getElementById("enableedits").checked;
	
		
	
}


function updateSelections(matname){

	console.log("update selections");
	
	var mode = materials[matname][0];
	var icon = materials[matname][1];
	var bg = materials[matname][2];
	
	haltAnimations();
	
	//first copy existing groups
	var currentGroups = material.groups;
	
	//copy existing views
	var view1 = material.firstView;
	var view2 = material.lastView;
	
	pane1g.selectAll("*").remove();
	pane2g.selectAll("*").remove();
	
	//create new material
	if(mode == "cat")
		material = new Cat(matname, "cat", icon, bg);
	else if (mode == "scale")
		material = new Scale(matname, "scale", icon, bg);
	else
		material = new Material(matname, mode, icon, bg);
	
	
	
	adaptOptions();
	adaptCSS();
	
	
	material.setFirstView (view1);
	material.setLastView (view2);
	
	
	
	material.createMaterial();
	
	
	for(var c=0; c<currentGroups.length; c++){
		material.addGroup(currentGroups[c].iconnum, currentGroups[c].numelements);
	}

	adjustCount();
	
	hideAddRemoveButtons(); 
	
	updateInputTable();

}



function switchView(view1, view2){
	
	//var view1 = getRadioValue('checkView1');
	//var view2 = getRadioValue('checkView2');
	
	for(var v=0; v<views.length; v++){
		var viewicon = views[v]+'_state';
		if(views[v] == view1 || views[v] == view2 )
		  
		    document.getElementById(viewicon).style.borderColor = (material.name == "material3"?"white":"#111");
		else
		    document.getElementById(viewicon).style.borderColor = "transparent";
	}
	
	if((views.indexOf(view1) > views.indexOf(view2)) && material.mode == "animation"){
		material.setFirstView (view2);
		material.setLastView (view1);
	}
	else{
		material.setFirstView (view1);
		material.setLastView (view2);
	}
	
	haltAnimations();
	
	material.updateMaterial(); //also updates timeline inside this function
	
	
			        
}



function adjustBg(cb){
	
	// BEGIN JEREMY EDIT
	//var selection = d3.select("#maindiv")[0][0];
	var selection = d3.select('body').node();
	// END JEREMY EDIT
	if(cb.checked){
		var urlString = 'url(images/'+material.background+'.jpg)';
		selection.style.backgroundImage =  urlString;
	}
	
	else{
		selection.style.backgroundImage =  "none";
	}
}





function enableAddRemove(cb){
	
	material.isAddRemove = cb.checked; 
	hideAddRemoveButtons();
	
}

function hideAddRemoveButtons(){

    if(material.isDetached || material.mode == "cat" || material.mode == "scale")
		return;

	for(var g=0; g<material.groups.length; g++){
	    
	    
	    
	    var classname = material.groups[g].classname;
	    
		pane1g.selectAll('.'+classname + '_button')
			.style("visibility", function(d) {
					return material.isAddRemove ? "visible" : "hidden";
			 });
			 
		pane2g.selectAll('.'+classname + '_button')
			.style("visibility", function(d) {
					return material.isAddRemove ? "visible" : "hidden";
			 });
	}

}

function ifShowTable(cb){
	var finaltable = document.getElementById('finaltable');
	if(cb.checked){
	    material.isTableHidden = false;
    	finaltable.style.visibility = "visible";
    	
    }
    else{
     	material.isTableHidden = true;
     	finaltable.style.visibility = "hidden";
	}
    	 
}

function shuffleTable(cb){

	if(cb.checked){
		/*$('#contain_vis1').insertBefore('#contain_finaltable');
		$('#contain_vis2').insertBefore('#contain_finaltable');*/
		
		material.isTableShuffle = true;
		$('#preview-col-vis').insertBefore('#preview-col-1');
		d3.select('#preview-col-1 .datatable').style('float', 'left');
		d3.select('#spacer').style('display', 'none');
	}
	else{
		//$('#contain_finaltable').insertBefore('#contain_vis1');
		
		material.isTableShuffle = false;
		$('#preview-col-1').insertBefore('#preview-col-vis');
		d3.select('#preview-col-1 .datatable').style('float', null);
		d3.select('#spacer').style('display', null);
	}


}



