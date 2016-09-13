Scale.prototype = new Material();         
Scale.prototype.constructor=Scale;       


function Scale(name, mode, icons, bg, path){ 
	this.name = name;
    this.mode = mode;
    this.icons = icons;
    this.background = bg;
    
    this.path = path;
    
    this.labelpos = 630;
    
} 

Scale.prototype.createMaterial=function(){ 
	this.isDetached = true;
	this.groups = [];
	//console.log("create new Scale!!!!!!!");
	//start with defaults
	d3.select("#pane1g").attr("currentView", this.firstView);
	d3.select("#pane1g").attr("targetView", this.lastView);
	
	d3.select("#pane2g").attr("currentView", this.firstView);
	d3.select("#pane2g").attr("targetView", this.lastView);
	
	this.initVis(pane1g, this.firstView);
    this.initVis(pane2g, this.lastView);
    		
    document.getElementById("contain_vis2").style.display = "";
	

	document.getElementById("contain_vis1").style.backgroundImage = "url('images/scaleLeft.png')";
	document.getElementById("contain_vis1").style.backgroundSize = "100% 100%";
	document.getElementById("contain_vis2").style.backgroundImage = "url('images/scaleRight.png')";
	document.getElementById("contain_vis2").style.backgroundSize = "100% 100%";
	
	
	pane1g.attr("transform", "translate(30, 0) scale(0.85)");
	pane2g.attr("transform", "translate(20, 0) scale(0.85)");		
			
					
} 

Scale.prototype.initVis = function (thepane, theview) {
    	
    	thepane.selectAll("*").remove();
    	thepane.attr("currentView", theview);
    
    	thepane.append("rect")
    		.attr("class", "basket")
			.attr("id", "basket"+thepane.attr("id"))
			.attr("x", 50)
			.attr("y", 620)
			.attr("width", 450)
			.attr("height", 50)
			.style("fill", "url(#scalepattern)");
			
    
    	//if(thepane === pane2g){
    		
    	    var yscale = d3.scale.linear()
                    .domain([10,0])
                    .range([-10,620]);
    	
			var yaxis = d3.svg.axis()
							.scale(yscale)
							.ticks(10)
							.orient("left");
						 
			thepane.append("g")
						.attr("class", "axis yaxis")
						.attr("id", "scaleyaxis")
						.attr("transform", "translate(25, 0)")
						.style("visibility", "hidden")
						.call(yaxis);
						
						
    	//}			
}

Scale.prototype.addGroup = function (rowindex, count){
    	
    	Material.prototype.addGroup.call(this, rowindex, count);
    	this.updateMaterial();
    
    	this.compare();
    	                 
}

Scale.prototype.removeGroup = function(rowindex) {
	Material.prototype.removeGroup.call(this, rowindex);
	this.updateMaterial();
	this.compare();
}
    
Scale.prototype.updateGroup = function (groupname, count){
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

Scale.prototype.compare = function(){
	
	
	var isEqual = true;
	var totaluser = 0; 
	var total = 0;


	
	
	for(var g=0; g<this.groups.length; g++){
	    totaluser += parseInt(this.groups[g].numuserelements);
	    total += parseInt(this.groups[g].numelements);
	    
	 	if(this.groups[g].numelements != this.groups[g].numuserelements){
	 		isEqual = false;
	 	}
	}
	
	var xtrans1 = 30;
	var xtrans2 = 20;
	
	var ytranslow =  -20;
	var ytranshigh = 30;
	var ytransmid = 0;
    var ytransup = 110;	

    var globalScale = 0.85; 
	
	if(isEqual == true){
		d3.select("#pane1g")
						.transition()
						.ease("linear")
						.duration(1500)
						.attr("transform", "translate("+xtrans1+", "+ ytranshigh+") scale("+globalScale+")");
						
						
		d3.select("#pane2g")
						.transition()
						.ease("linear")
						.duration(1500)
						.attr("transform", "translate("+xtrans2+", "+ytranshigh+") scale("+globalScale+")");
		
		return true;
	}
	
	
	if(totaluser > total){
		d3.select("#pane1g")
						.transition()
						.ease("linear")
						.duration(1500)
						.attr("transform", "translate("+xtrans1+", "+ytranslow+") scale("+globalScale+")");
						
						
		d3.select("#pane2g")
						.transition()
						.ease("linear")
						.duration(1500)
						.attr("transform", "translate("+xtrans2+", "+ytransup+") scale("+globalScale+")");
		return false;
	}
	else if (totaluser == total){
	
		(function repeat() {
    		d3.select("#pane1g")
    					.transition()
						.ease("linear")
						.duration(1900)
						.attr("transform", "translate("+xtrans1+", "+ytranshigh+") scale("+globalScale+")")
						.transition()
						.ease("linear")
						.duration(1900)
						.attr("transform", "translate("+xtrans1+", "+ytranslow+") scale("+globalScale+")")
						.each("end", repeat);
 		})();
 		
 		
 		(function repeat2() {
    		d3.select("#pane2g")
    					.transition()
						.ease("linear")
						.duration(1900)
						.attr("transform", "translate("+xtrans2+", "+ytranslow+") scale("+globalScale+")")
						.transition()
						.ease("linear")
						.duration(1900)
						.attr("transform", "translate("+xtrans2+", "+ytranshigh+") scale("+globalScale+")")
						.each("end", repeat2);
 		})();
  
		return false;
	}
	
	d3.select("#pane1g")
					.transition()
					.ease("linear")
					.duration(1000)
					.attr("transform", "translate("+xtrans1+", "+ytransup+") scale("+globalScale+")");
						
						
	d3.select("#pane2g")
					.transition()
					.ease("linear")
					.duration(1000)
					.attr("transform", "translate("+xtrans2+", "+ytransmid+") scale("+globalScale+")");
	return false;
	
}


var scalepos = [ [-20, 395], [80, 440], [150, 400], [200, 430], [180, 370], [280, 390], [310, 420]]; //all origin centers predefined

Scale.prototype.xposRule = function(i){
	var centering = 480 - this.groups.length * 60;
	return centering+((elsize+25)*i);
}

Scale.prototype.yposRule = function(i){
	return height-(i*(elsize+spacing)) + 260;
}

Scale.prototype.scatterXRule = function(){
	return Math.random() * 400 + 50;
}

Scale.prototype.scatterYRule = function(){
	return Math.random()*200 + 325;
}

Scale.prototype.clusterXRule = function(i){
	return scalepos[i][0] + Math.random()*150 ;
}

Scale.prototype.clusterYRule = function(i){
	return scalepos[i][1] + Math.random()*150;
}



