Cat.prototype = new Material();         
Cat.prototype.constructor=Cat;      

function Cat(name, mode, icons, bg, path){ 
	this.name = name;
    this.mode = mode;
    this.icons = icons;
    this.background = bg;
    
    this.path = path;
    
    this.labelpos = 620;
    
    this.vis1bg; 
    this.vis2bg;
    
    this.vis2correctbg;
    this.vis2incorrectbg; 
} 

Cat.prototype.createMaterial=function(){ 

    this.isDetached = true;
    
    this.groups = [];
	//console.log("cat createMaterial: is this ever called???");
	//start with defaults
	d3.select("#pane1g").attr("currentView", this.firstView);
	d3.select("#pane1g").attr("targetView", this.lastView);
	
	d3.select("#pane2g").attr("currentView", this.firstView);
	d3.select("#pane2g").attr("targetView", this.lastView);
	
	this.initVis(pane1g, this.firstView);
    this.initVis(pane2g, this.lastView);
    		
    document.getElementById("contain_vis2").style.display = "";
    
    if(themelevel == 1){
    	this.vis1bg = "url('images/cloud.png')";
    	this.vis2bg = "url('images/cat_neutral.png')";
    	this.vis2correctbg = "url('images/cat_happy1.gif')";
    	this.vis2incorrectbg = "url('images/cat_unhappy1.gif')"; 
    	
    }
    else if(themelevel == 2){
    	this.vis1bg = "url('images/hands-01.png')";
    	this.vis2bg = "url('images/cauldron_neutral-01.png')";
    	this.vis2correctbg = "url('images/cauldron_happy1.gif')";
    	this.vis2incorrectbg = "url('images/cauldron_unhappy1.gif')";  //change this only!!!
    }
	
	// START JEREMY EDIT
	//document.getElementById("contain_vis1").style.backgroundImage = "url('images/cloud.png')";
	//document.getElementById("contain_vis1").style.backgroundImage = "url('images/hands-01.png')";
	
	document.getElementById("contain_vis1").style.backgroundImage = this.vis1bg;
	document.getElementById("contain_vis1").style.backgroundSize = "100% 100%";
	
	// START JEREMY EDIT
	//document.getElementById("contain_vis2").style.backgroundImage = "url('images/cat_neutral.png')";
	//document.getElementById("contain_vis2").style.backgroundImage = "url('images/cauldron_neutral-01.png')";
	
	document.getElementById("contain_vis2").style.backgroundImage = this.vis2bg;
	document.getElementById("contain_vis2").style.backgroundSize = "100% 100%";
	
	document.getElementById("vis1").style.borderStyle = "none";
	document.getElementById("vis2").style.borderStyle = "none";
	
   		
	pane1g.attr("transform", "translate(50, 240) scale(0.7)");
	pane2g.attr("transform", "translate(60, 240) scale(0.7)");
			
} 

Cat.prototype.initVis = function (thepane, theview) {
    	//console.log("cat initVis: is this ever called???");
    	//first clear everything
    	thepane.selectAll("*").remove();
    	thepane.attr("currentView", theview);
    
    	
     //if(thepane === pane2g){
    		var yscale = d3.scale.linear()
                         .domain([10,0])
                         .range([-20,610]);

			var yaxis = d3.svg.axis()
							.scale(yscale)
							.ticks(10)
							.orient("left");
						 
			thepane.append("g")
						.attr("class", "axis yaxis")
						.attr("id", "catyaxis")
						.attr("transform", "translate(25, 0)")
						.style("visibility", function(d) {
							return (theview == "bar" || theview == "tally") ? "visible" : "hidden";
						})
						.call(yaxis);
    				
    	//}
    
    	
}

Cat.prototype.addGroup = function (rowindex, count){
	
        Material.prototype.addGroup.call(this, rowindex, count);
    	
    	this.updateMaterial();
    	this.compare();
    	                   
}
    
Cat.prototype.updateGroup = function (groupname, count){
    	//make sure the group exists
    	//console.log("cat updateGroup: is called!);
    	var groupIndex = this.groupIndx(groupName);
    	if(groupIndex > -1 ){
    		var thegroup = this.groups[groupIndex];
    		thegroup.updateCount(count);
    		thegroup.updateGroupOnPane(pane1g);
    		thegroup.updateGroupOnPane(pane2g); 
    	}
}


Cat.prototype.removeGroup = function (rowindex) {
	Material.prototype.removeGroup.call(this, rowindex);
	this.compare();
	
}



Cat.prototype.compare = function(){
	
	var isEqual = true;
	var totaluser = 0; 
	var total = 0;

	
	for(var g=0; g<this.groups.length; g++){
	    totaluser += this.groups[g].numuserelements;
	    total += parseInt(this.groups[g].numelements);
	    //console.log("total: ", total);
	 	if(this.groups[g].numelements != this.groups[g].numuserelements){
	 		isEqual = false;
	 	}
	}
	
	//console.log("comparison: ", totaluser, total, isEqual);
	
	if(isEqual === true){
		// START JEREMY EDIT
		//document.getElementById("contain_vis2").style.backgroundImage = "url('images/cauldron_happy1.gif')";
		//document.getElementById("contain_vis2").style.backgroundImage = "url('images/cat_happy1.gif')";
		document.getElementById("contain_vis2").style.backgroundImage = this.vis2correctbg;
		
		return true;
	}
	if(totaluser > total){
		//document.getElementById("contain_vis2").style.backgroundImage = "url('images/cat_unhappy1.gif')";
		document.getElementById("contain_vis2").style.backgroundImage = this.vis2incorrectbg;
		return false;
	}
	
	// START JEREMY EDIT
	//document.getElementById("contain_vis2").style.backgroundImage = "url('images/cat_neutral.png')";
	//document.getElementById("contain_vis2").style.backgroundImage = "url('images/cauldron_neutral-01.png')";
	document.getElementById("contain_vis2").style.backgroundImage = this.vis2bg;
	// END JEREMY EDIT
	return false;
	
}

Cat.prototype.xposRule = function(i){
	var centering = 480 - this.groups.length * 60;
	return centering+((elsize+40)*i);
}

Cat.prototype.yposRule = function(i){
	return height-(i*(elsize+spacing)) + 250;
}

Cat.prototype.scatterXRule = function(){
	return Math.random()*450;
}

Cat.prototype.scatterYRule = function(){
	return Math.random()*520 + 130;
}

Cat.prototype.clusterXRule = function(i){
	return origins[i][0] + Math.random()*80 -40;
}

Cat.prototype.clusterYRule = function(i){
	return origins[i][1] + Math.random()*80 -40;
}




