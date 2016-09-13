function GoNext(pane){

	var currentView = pane.attr("currentView");
	var targetView = pane.attr("targetView");
	
	if(currentView == targetView)
		return;

	//set current view to next
	var viewind = views.indexOf(currentView);
	viewind++;
	
	currentView = views[viewind];
	pane.attr("currentView", currentView);
	

	var movemark = d3.select("#playpos")
						.transition()
						//.delay(50)
						.ease("linear")
						.duration(animspeed*material.groups.length)
						.attr("cx", viewind*65);


	d3.select("#mat_yaxis").style("visibility", function(d){
			return (currentView == "scatter" || currentView =="cluster") ? "hidden" : "visible";
	});

	d3.select("#mat_xaxis").style("visibility", function(d){
			return (currentView == "scatter" || currentView =="cluster") ? "hidden" : "visible";
	});
	
	

}

function NextView(pane, group){ 

	var currentView = pane.attr("currentView");
	var targetView = pane.attr("targetView");
	
	var theclass = group.classname;
	var theicon = ''+group.icongroup+group.iconnum;
	
	var vieworder = material.groupIndx(theclass);
	var labelx = material.xposRule(vieworder); 
	
	pane.selectAll('.'+theclass+'_button').attr("x", labelx+15);
	pane.selectAll('.'+theclass+'_label').attr("x", labelx);
	
	
	   
	var iconref = 'url(#'+theicon+'_pat)';
	var tick = 0;
	
	
	var newpos = pane.selectAll('.'+theclass)
		.each(function() {
			tick++;
		})
		.transition()
		//.delay(50)
		.duration(animspeed)
		.style("opacity", function(d){
			if(currentView == "tally")
				return 0.1; 
			else 
				return 1.0;
		})
 		.attr("x", function(d){
			if(currentView == "scatter")
				return d3.select(this).attr("scatterx"); 
			else if(currentView == "cluster")
				return d3.select(this).attr("clusterx"); 
			else 
				return labelx;
			})
		.attr("y", function(d, i){
			
			
			var elcount = document.getElementById("elementcount").value;
		    var remainder = group.numelements % elcount;
		    
		    var topitem = Math.ceil(group.numelements / elcount) - 1;
		    
		    if(elcount == 1 || remainder == 0)
		    	topitem = -1;
		    	
		    var height = elsize;
    		if(pane.attr("currentView") == "bar")
    			height = elsize + spacing + 1;
    		
    		var ratioheight = height * (remainder/elcount);
		    	
		    if(currentView == "scatter")
				return d3.select(this).attr("scattery");  
			else if(currentView == "cluster")
				return d3.select(this).attr("clustery"); 
			else{
				if(i == topitem)
					return  material.yposRule(i) - ratioheight + height;
				else
					return material.yposRule(i); 
			}
		})
		.attr("transform", function(d) { 
			if(currentView == "scatter")
				return "scale(1.0)";
			else if (currentView == "cluster")
				return "scale("+clusterscalefactor+")";
			else
				return "scale("+scalefactor+")";
		})
		.attr("height", function(d, i){
			var elcount = document.getElementById("elementcount").value;
		    var remainder = group.numelements % elcount; 
    	    var topitem = Math.ceil(group.numelements / elcount) - 1;
    	    
    		if(elcount == 1 || remainder == 0)
    			topitem = -1;
    			
    		
    		var height = elsize;
    		if(pane.attr("currentView") == "bar")
    			height = elsize + spacing + 1;
    		
    		var ratioheight = height * (remainder/elcount);
    			
    		if(i == topitem)
    			return ratioheight;
    		else
    			return height;
    		
    	})
		.each("end", function(){
			tick--;
			if (!tick) {
			
				setFill(pane, group);
				var groupindex = material.groupIndx(group.classname);
						
				if(groupindex < material.groups.length){
					groupindex++;
		
					if(groupindex == material.groups.length){
					
						if(currentView == targetView)
							return;
							
						GoNext(pane);
						NextView(pane, material.groups[0]);
					}
					else{
						NextView(pane, material.groups[groupindex]);
					}
				}
			}
		
		});	
				
}

function setFill(pane, group){

	var currentView = pane.attr("currentView");
	
	//console.log("@setFill: ", group.classname, group.icongroup);
	
	var theclass = group.classname;
	var theicon = ''+group.icongroup+group.iconnum;
	
	var iconref = 'url(#'+theicon+'_pat)';
	
	var newpos = pane.selectAll('.'+theclass)
					.style("fill", function(d){
						if(currentView == "tally" || currentView == "bar")
							return group.color; 
						else 
							return iconref;
					})
					.style("opacity", 1.0);
}


function GoBack(pane){

	var currentView = pane.attr("currentView");
	var targetView = pane.attr("targetView");

	if(currentView == targetView)
		return;
		
	//set current view to next
    var viewind = views.indexOf(currentView);
    viewind--;

    currentView = views[viewind];
    pane.attr("currentView", currentView);
    
    var movemark = d3.select("#playpos")
    					.transition()
    					//.delay(50)
    					.ease("linear")
						.duration(animspeed*material.groups.length)
    					.attr("cx", viewind*65);
    					
    					
    
    
    d3.select("#mat_yaxis").style("visibility", function(d){
			return (currentView == "scatter" || currentView =="cluster") ? "hidden" : "visible";
	});

	d3.select("#mat_xaxis").style("visibility", function(d){
			return (currentView == "scatter" || currentView =="cluster") ? "hidden" : "visible";
	});	
}

function PreviousView(pane, group){  

	var currentView = pane.attr("currentView");
	var targetView = pane.attr("targetView");
	
	var theclass = group.classname;
	var theicon = ''+group.icongroup+group.iconnum;
	

	var vieworder = material.groupIndx(theclass);
	var labelx = material.xposRule(vieworder);
	
	pane.selectAll('.'+theclass+'_button').attr("x", labelx+15);
	pane.selectAll('.'+theclass+'_label').attr("x", labelx);
	
	group.handleRemainder(pane);
	
	var iconref = 'url(#'+theicon+'_pat)';
	var tick = 0;
	var newpos = pane.selectAll('.'+theclass)
		.each(function() {
			tick++;
		})
		.transition()
		//.delay(50)
		.duration(animspeed)
		.style("opacity", function(d){
			if(currentView == "stack")
				return 0.1; 
			else 
				return 1.0;
		})
		.attr("x", function(d){
			if(currentView == "scatter")
				return d3.select(this).attr("scatterx"); 
			else if(currentView == "cluster")
				return d3.select(this).attr("clusterx"); 
			else 
				return labelx;
			})
		.attr("y", function(d, i){
			var elcount = document.getElementById("elementcount").value;
		    var remainder = group.numelements % elcount;
		    
		    var topitem = Math.ceil(group.numelements / elcount) - 1;
		    
		    if(elcount == 1 || remainder == 0)
		    	topitem = -1;
		    	
		    var height = elsize;
    		if(pane.attr("currentView") == "bar")
    			height = elsize + spacing + 1;
    		
    		var ratioheight = height * (remainder/elcount);
		    	
		    if(currentView == "scatter")
				return d3.select(this).attr("scattery");  
			else if(currentView == "cluster")
				return d3.select(this).attr("clustery"); 
			else{
				if(i == topitem)
					return  material.yposRule(i) - ratioheight + height;
				else
					return material.yposRule(i); 
			}
		})
		.attr("transform", function(d) { 
			if(currentView == "scatter")
				return "scale(1.0)";
			else if (currentView == "cluster")
				return "scale("+clusterscalefactor+")";
			else
				return "scale("+scalefactor+")";
		})
		.attr("height", function(d, i){
			var elcount = document.getElementById("elementcount").value;
		    var remainder = group.numelements % elcount; 
    	    var topitem = Math.ceil(group.numelements / elcount) - 1;
    	    
    		if(elcount == 1 || remainder == 0)
    			topitem = -1;
    			
    		
    		var height = elsize;
    		if(pane.attr("currentView") == "bar")
    			height = elsize + spacing + 1;
    		
    		var ratioheight = height * (remainder/elcount);
    			
    		if(i == topitem)
    			return ratioheight;
    		else
    			return height;
		})
		.each("end", function(){
			tick--;
			if (!tick) {
			
				setFill(pane, group);
				var groupindex = material.groupIndx(group.classname);
				
				if(groupindex < material.groups.length){
					groupindex++;
				
					if(groupindex == material.groups.length){
					
						if(currentView == targetView)
							return;
							
						GoBack(pane);
						PreviousView(pane, material.groups[0]);
					}
					else{
						PreviousView(pane, material.groups[groupindex]);
					}
				}
			}
		});	
		
}


function addPlayControl(pane, view1, view2){

		var currentView = view1;
	    var targetView = view2;
	    
	    pane.attr("currentView", currentView);
	    pane.attr("targetView", targetView);
	
		var timeline = pane
						.append("g")
						.attr("id", "timeline")
					    .attr("transform", "translate(40, 60) scale(1.5)");
		
		var viewstart = views.indexOf(currentView);
        var viewend = views.indexOf(targetView);
        
        				
	    var line = timeline.append("line")
	    					.attr("id", "playline")
                          	.attr("x1", viewstart*65)
                          	.attr("y1", 0)
                         	.attr("x2", viewend*65)
                         	.attr("y2", 0)
                         	.attr("stroke-width", 2)
                         	.attr("stroke", "black");
        
        var linecircle = timeline.append("circle")
        						.attr("id", "playpos")
        						.attr("cy", 0)
        						.attr("cx", viewstart*60)
        						.attr("r", 5)
        						.style("fill", "#e0603d");
        			
        
        for(var s=viewstart; s<viewend+1; s++){               	
        	var stop = timeline
        					.append("rect")
        					.attr("id", 'stop'+s)
        					.attr("class", "stopicons")
        					.attr("view", views[s])
        					.attr("x", s*60)
        					.attr("y", -35)
        					.attr("width", 20)
        					.attr("height", 35)
        					.on("click", function(){
        					
        						haltAnimations();
        						
        						targetView = d3.select(this).attr("view");
        						pane.attr("targetView", targetView);
        						
        						currentView = pane.attr("currentView");
        						
        						if(views.indexOf(currentView) < views.indexOf(targetView)){
        							GoNext(pane);
									NextView(pane, material.groups[0]);
        						}
        						else{
        							GoBack(pane);
        							PreviousView(pane, material.groups[0]);
        						}
        					})
        					.style("fill", function(){
        					    return "url(#"+views[s]+"pattern)";
        					});				
        }
        
        
        var previos = timeline.append("rect")
	    				.attr("class", "prev")
	    				.attr("x", viewend*65 +100)
						.attr("y", -30)
						.attr("width", 20)
						.attr("height", 20)
						.style("fill", "url(#prevpattern)")
						.on("click", function(){
							haltAnimations();
							
							pane.attr("targetView", material.firstView);
							GoBack(pane);
							PreviousView(pane, material.groups[0]);
						});  		
				
		var next = timeline.append("rect")
						.attr("class", "next")
						.attr("x", viewend*65 + 150)
						.attr("y", -30)
						.attr("width", 20)
						.attr("height", 20)
						.style("fill", "url(#nextpattern)")
						.on("click", function(){
							haltAnimations();
							
							pane.attr("targetView", material.lastView);
							GoNext(pane);
    						NextView(pane,material.groups[0]);
						});  
}

function haltAnimations(){
	//halt all animations
	for(var g=0; g<material.groups.length; g++){
		var theclass = material.groups[g].classname; 
		pane1g.selectAll('.'+theclass).transition();
		//pane2g.selectAll('.'+theclass).transition();
	}
	
	d3.select("#pane2g").transition();
	d3.select("#pane1g").transition();
	d3.select("#playpos").transition();
}

function updateTimeline(pane, view1, view2){

	var timeline = pane.select("#timeline");
	
	var viewstart = views.indexOf(view1);
    var viewend = views.indexOf(view2);
    
    pane.attr("targetView", view2);
	
	
	timeline.selectAll('.stopicons').remove();
	
	timeline.select('#playline')
    		.attr("x1", viewstart*65)
            .attr("x2", viewend*65);
    
    timeline.select('#playpos').attr("cx", viewstart*60);     
            
    for(var s=viewstart; s<viewend+1; s++){               	
        	var stop = timeline
        					.append("rect")
        					.attr("id", 'stop'+s)
        					.attr("class", "stopicons")
        					.attr("view", views[s])
        					.attr("x", s*60)
        					.attr("y", -35)
        					.attr("width", 20)
        					.attr("height", 35)
        					.on("click", function(){
        						targetView = d3.select(this).attr("view");
        						pane.attr("targetView", targetView);
        						
        						currentView = pane.attr("currentView");
        						
        						if(views.indexOf(currentView) < views.indexOf(targetView)){
        							GoNext(pane);
									NextView(pane, material.groups[0]);
        						}
        						else{
        							GoBack(pane);
        							PreviousView(pane, material.groups[0]);
        						}
        					})
        					.style("fill", function(){
        					    return "url(#"+views[s]+"pattern)";
        					});				
        }
};


            



            
