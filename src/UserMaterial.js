UserMaterial.prototype = new Material();         
UserMaterial.prototype.constructor=UserMaterial;       // Otherwise instances of Cat would have a constructor of Mammal 

function UserMaterial (name, mode, icons, bg, path) {
    this.name = name;
    this.mode = mode;
    this.icons = icons;
    this.path = path;
    this.background = bg;
    
   
    this.labelpos = 650;
    
}


UserMaterial.prototype.addGroup=function(rowindex, count){ 
	var groupName = "group"+rowindex;
    var groupIndex = this.groupIndx(groupName);
    	
    
	if(groupIndex < 0 ){
		//THEN ADD A NEW GROUP
		var newgroup = new Group(groupName);
		newgroup.createGroup(this.icons, rowindex, count);
		this.groups.push(newgroup);
		
		//we do not upload highlight versions of icons by selecting false
		addIconPattern(''+this.icons+rowindex, false);
		
		newgroup.addGroupToPane(pane1g);
		newgroup.addGroupToPane(pane2g);
		
	}
	else{
		var thegroup = this.groups[groupIndex];
		//thegroup.numelements = count; 
		thegroup.updateCount(count);
		thegroup.updateGroupOnPane(pane1g);
		thegroup.updateGroupOnPane(pane2g);
	}

}

UserMaterial.prototype.highlightItemAndCounter = function(thepane, otherpane, thegroup, itemindex, counterindex){

    	var itemreps = this.itemRepresents(thepane, thegroup, itemindex);
    	var counterreps = this.itemRepresents(otherpane, thegroup, counterindex);
    	
    	//console.log("item reps: ", itemreps, "counter reps: ", counterreps);
    	
    	var theview = thepane.attr("currentView")
		var otherview = otherpane.attr("currentView");
    	
    	//var iconhigh = 'url(#'+thegroup.icon+'_patH)';
		//if( theview == "bar" ||theview == "tally") iconhigh = thegroup.highcolor;
		
		
		var iconhigh = thegroup.highcolor;
		
		//highlight this item 
		var item = thepane.select('#'+thegroup.classname+'_'+itemindex);
		item.attr('stroke', thegroup.highcolor)
			.attr('stroke-width', '8');
			
		
        
		
		//now deal with the counterpart
		
		//iconhigh = 'url(#'+thegroup.icon+'_patH)';
		//if( otherview == "bar" || otherview == "tally") 
			//iconhigh = thegroup.highcolor;
		
		
		var ghostx = 0; 
		var ghosty = 0; 
		var ghostheight = 0;
		var ghostfill = 'url(#'+thegroup.icon+'_patH)'; 
		var ghoststroke = thegroup.highcolor;
		
		var vieworder = material.groupIndx(thegroup.classname);
				
		if(counterreps == 0){  //counter doesn't exist, then create empty stroke element
			ghostheight = this.ratioHeight(itemreps, otherpane);
			
			var diffheight = elsize - ghostheight;
			if(otherview == "bar"){
				diffheight += spacing + 1;
				
			}
			
			if(otherview == "scatter" || otherview == "cluster"){
				ghostx = this.clusterXRule(vieworder); //itemindex * (elsize + spacing);
				ghosty = this.clusterYRule(vieworder); //630;  
			}
			else{
				ghostx = material.xposRule(vieworder);
				ghosty = material.yposRule(counterindex) + diffheight;
			}
			
			ghostfill = "none";
			ghoststroke = thegroup.highcolor;	
		}
    	else if(itemreps == counterreps){ //no ghost
    		var counteritem = otherpane.select('#'+thegroup.classname+'_'+counterindex);
			//counteritem.style("fill", iconhigh);
			counteritem.attr('stroke', iconhigh)
					   .attr('stroke-width', '8');
			
			ghostfill = "none";
			ghoststroke = "none"; 
			
    	}
    	else if(itemreps < counterreps){
    		var counteritem = otherpane.select('#'+thegroup.classname+'_'+counterindex);
    		ghostheight = this.ratioHeight(itemreps, otherpane);
			ghostx = counteritem.attr("x");
			
			var diffheight = 0;
			
			if(otherview == "stack" || otherview == "tally" || otherview == "bar"){
			
				var counterheight = this.ratioHeight(counterreps, otherpane);
				diffheight = ghostheight - counterheight;
		
			}
			

		    ghosty = parseInt(counteritem.attr("y")) - diffheight;
			
			ghostfill = iconhigh;
			ghoststroke = "none";
			
			
    	}
    	else if(itemreps > counterreps){
    	
    	    //console.log("comes here!!");
    		var counteritem = otherpane.select('#'+thegroup.classname+'_'+counterindex);
			//counteritem.style("fill", iconhigh);
			counteritem.attr('stroke', iconhigh)
					   .attr('stroke-width', '8');
			
			ghostheight = this.ratioHeight(itemreps, otherpane);
			ghostx = counteritem.attr("x");
			
			var diffheight = 0;
			
			if(otherview == "stack" || otherview == "tally" || otherview == "bar"){
			
				var counterheight = this.ratioHeight(counterreps, otherpane);
				diffheight = ghostheight - counterheight;
			
				if(otherview == "bar"){
					diffheight -= spacing + 1;	
				}
			}
			

		    ghosty = parseInt(counteritem.attr("y")) - diffheight;
		    
		    ghostfill = "none";
		    ghoststroke = thegroup.highcolor;
    	}
    	
    	//place ghost 
		var ghost = otherpane.append("rect")
					.attr("class", "ghost")
					.attr("x", ghostx)
					.attr("y", ghosty)
					.attr("width", elsize)
					.attr("height", ghostheight)
					.attr("transform", function(d) { 
						if(otherview == "scatter")
							return "scale(1.0)";
						else if (otherview == "cluster")
							return "scale("+clusterscalefactor+")";
						else
							return "scale("+scalefactor+")";
					})
					.attr('fill', ghostfill)
					.attr('stroke', ghoststroke)
					.attr('stroke-dasharray', '10,5')
					.attr('stroke-linecap', 'butt')
					.attr('stroke-width', '5');
					
} 
    
UserMaterial.prototype.highlightItem = function(thepane, itemindex, classname){
    	
    	var groupIndex = this.groupIndx(classname);
		var thegroup = this.groups[groupIndex];
		
		var isTopItem = false;
		
		var otherpane = pane2g;
		if(thepane == pane2g) otherpane = pane1g;
		
		var theview = thepane.attr("currentView")
		var otherview = otherpane.attr("currentView"); 
		
		var thedata = thegroup.data;
		var otherdata = thegroup.userdata;
		
		if(material.isDetached && thepane == pane2g ){
			thedata = thegroup.userdata;
			otherdata = thegroup.data;
		}
		
		
			
		if(itemindex == (thedata.length - 1))
			isTopItem = true;
		
		/////////////////////////////////////////////////////////////////////
		////when top of the bar is highlighted, this block will call the line
		if(theview == "bar" || theview == "tally" || theview == "stack"){
			if(isTopItem){
				thegroup.displayLine(thepane, itemindex);	
			}
		
		}
		//end of block
		/////////////////////////////////////////////////////////////////////
		
		
		
		if(theview == "cluster" || theview == "scatter"){ //highlight single items
			this.highlightItemAndCounter(thepane, otherpane, thegroup, itemindex, 0);
		}
		else{ //otherwise highlight until the index
		    for(var cnt=0; cnt<=itemindex; cnt++){
		    	this.highlightItemAndCounter(thepane, otherpane, thegroup, cnt, cnt);
		    }
		}
	
		
}

UserMaterial.prototype.dehighlightItem = function(itemindex, classname){
    	var groupIndex = this.groupIndx(classname);
		var thegroup = this.groups[groupIndex];
								
    	var iconref = 'url(#'+thegroup.icon+'_pat)';
    	var panelnames=["pane1g", "pane2g"];
    		
    	for(var p = 0; p<panelnames.length; p++){
    	    
    	    var panel = d3.select('#'+panelnames[p]);
    		var currentView = panel.attr("currentView");
    		
    		
    	
    		if( currentView == "bar" || currentView == "tally"){
    			
    			iconref = thegroup.color;
    		}
    	
        	panel.selectAll('.'+classname)
						.style("fill",  iconref)
						.attr("stroke",  "none");
						
						
						
			//removes the temp line meeting the axis			
			panel.selectAll('.meetaxisline').remove();
			panel.selectAll('.ghost').remove();

	}
}


