function Material (name, mode, icons, bg) {
    this.name = name;
    this.mode = mode;
    this.icons = icons;
    this.background = bg;
    
    this.names = names[icons];
    this.colors = colors[icons];
    this.firstView = "scatter";
    this.lastView = "bar";
    this.published = false;
    
    this.elcount = 1;
    this.tickcount = 1;
    
    this.begincount = 0;
    
    this.groups = [];
    
    this.text = "na";
    
    
    
    this.labelpos = 650;
    
    this.isDetached = false;
    this.isTableHidden = false;
    this.isTableShuffle = false;
    this.isAddRemove = true;

}

Material.prototype = {
    constructor: Material,
    createMaterial:function () {
    	this.groups = [];
    	//start with defaults
		d3.select("#pane1g").attr("currentView", this.firstView);
		d3.select("#pane1g").attr("targetView", this.lastView);
	
		d3.select("#pane2g").attr("currentView", this.firstView);
		d3.select("#pane2g").attr("targetView", this.lastView);
	
	
		
		
    	if(this.mode == "animation"){
    		this.initVis(pane1g, this.firstView);
    		addPlayControl(pane1g, this.firstView, this.lastView);
    		
    		document.getElementById("contain_vis2").style.display = "none";
    	}
    	else{
    		this.initVis(pane1g, this.firstView);
    		this.initVis(pane2g, this.lastView);
    		
    		document.getElementById("contain_vis2").style.display = "";
    	}
    	
    	// START JEREMY EDIT
		/*document.getElementById("vis1").style.borderStyle = "solid";
		document.getElementById("vis2").style.borderStyle = "solid";
		
		document.getElementById("vis1").style.borderColor = "#000";
		document.getElementById("vis2").style.borderColor = "#000";*/
        // END JEREMY EDIT
		
		document.getElementById("contain_vis1").style.backgroundImage = "";
		document.getElementById("contain_vis2").style.backgroundImage = "";
		
		//eliminate any scalings 	
		pane1g.attr("transform", "translate(0, 0) scale(1.0)");
		pane2g.attr("transform", "translate(0, 0) scale(1.0)");
	
    },
    initVis:function (thepane, theview) {
    
    	//first clear everything
    	thepane.selectAll("*").remove();
    	thepane.attr("currentView", theview);
    
    	var yScale = d3.scale.linear()
                         .domain([10,0])
                         .range([15,645]);
    	
    	var yAxis = d3.svg.axis()
                  		.scale(yScale)
                  		.ticks(10)
                  		.orient("left");
                         
        thepane.append("g")
					.attr("class", "axis yaxis")
					.attr("id", "mat_yaxis")
					.attr("transform", "translate(30, 0)")
					.style("visibility", function(d) {
							return (theview == "scatter" || theview == "cluster") ? "hidden" : "visible";
					})
    				.call(yAxis);
    				

    },
    groupIndx:function(groupname){

    	for(var g =0; g< this.groups.length; g++){
    		if(this.groups[g].classname == groupname)
    			return g;
    	}
    	return -1;
    	
    },
    removeGroup:function(rowindex){
        
		var groupname = "group"+rowindex;
		var groupIndex = this.groupIndx(groupname);
		
		
		if(groupIndex > -1){
			var thegroup = this.groups[groupIndex];
		
			thegroup.removeGroupFromPane(pane1g);
			thegroup.removeGroupFromPane(pane2g);
		
			this.groups.splice(groupIndex, 1);

		}
		
    	this.updateMaterial();
    	
    	
    },
    addGroup:function (rowindex, count){
    	var groupName = "group"+rowindex;
    	var groupIndex = this.groupIndx(groupName);
    	
    	
    	
    	if(groupIndex < 0 ){
    		//THEN ADD A NEW GROUP
    		var newgroup = new Group(groupName);
    		newgroup.createGroup(this.icons, rowindex, count);
    		this.groups.push(newgroup);
    		
    		addIconPattern(''+this.icons+rowindex);
    		
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
    	
    	//this.updateXaxis();                    
    },
    addUserElements:function(rowindex, usercount){
    	var groupName = "group"+rowindex;
    	var groupIndex = this.groupIndx(groupName);
    	
    	
    	if(groupIndex < 0 ){
    		console.log("this should never happen!");
    	}
    	else{
    		var thegroup = this.groups[groupIndex]; 
    		thegroup.addUserData(usercount);
    	}
    
    }, 
    /*updateXaxis: function(){	
    	//adjust xScale by number of groups 
    	var scalewidth = (width-65)/7 * this.groups.length;
    	
    	//console.log("scalewidth: ", scalewidth, "for #: ", this.groups.length);
    	
    	xScale = d3.scale.linear()
                         .domain([1,this.groups.length])
                         .range([60,scalewidth]);
           
           
        var ticksArray = [];
        for (var g=0; g<this.groups.length; g++){
        	ticksArray.push(g);
        }               
        var xAxis = d3.svg.axis()
                  		.scale(xScale)
                  		.ticks(this.groups.length)
                  		.tickValues(ticksArray)
                  		.tickFormat("")
                  		.orient("bottom");
                  		  
    	d3.selectAll(".xaxis").call(xAxis);
    },*/
    updateGroup:function (groupname, count){
    	//make sure the group exists
    	var groupIndex = this.groupIndx(groupName);
    	if(groupIndex > -1 ){
    		var thegroup = this.groups[groupIndex];
    		thegroup.updateCount(count);
    		thegroup.updateGroupOnPane(pane1g);
    		thegroup.updateGroupOnPane(pane2g); 
    	}
    },
    updateMaterial:function ()  {
    	if(this.mode == "animation"){
    		updateTimeline(pane1g, this.firstView, this.lastView);
    		pane1g.attr("currentView", this.firstView);
    		pane1g.attr("targetView", this.lastView);
    		
    		for(var g =0; g< this.groups.length; g++){
    			this.groups[g].updateGroupOnPane(pane1g);
    		}
    	}
    	else{
    		pane1g.attr("currentView", this.firstView);
    		pane2g.attr("currentView", this.lastView);
    		
    		for(var g =0; g< this.groups.length; g++){
    			this.groups[g].updateGroupOnPane(pane1g);
    			this.groups[g].updateGroupOnPane(pane2g);
    		}
    	}
    	
    	var theview = pane1g.attr("currentView");
    	pane1g.selectAll(".axis").style("visibility", function(d) {
							return (theview == "scatter" || theview == "cluster") ? "hidden" : "visible";
						});
						
		var theview2 = pane2g.attr("currentView");
    	pane2g.selectAll(".axis").style("visibility", function(d) {
							return (theview2 == "scatter" || theview2 == "cluster") ? "hidden" : "visible";
						});
    },
    
    
    updateIcons:function(newicon){
		this.icons = newicon;
		
		for(var g =0; g< this.groups.length; g++){
    		this.groups[g].updateIcon(pane1g, this.icons);
    		this.groups[g].updateIcon(pane2g, this.icons);
    	}
	},
	setText (txt){
		this.text = txt;
		document.getElementById("description").innerHTML = txt;
		document.getElementById("textinput").value = txt;
		//console.log("init view and set text: ", txt);
		
	},
	setBg (bg){
		this.background = bg;

		var selection = d3.select("#maindiv")[0][0];
		if(ifshowbg){
			var urlString = 'url(images/'+this.background+'.png)';
			selection.style.backgroundImage =  urlString;
		}
	},
    setFirstView:function (view)  {
        this.firstView = view;
    },
    setLastView:function (view)  {
        this.lastView = view;
    }, 
    ratioHeight:function(reps, thepane){
    	var height = elsize;
    	if(thepane.attr("currentView") == "bar")
    		height = elsize + spacing + 1;
    		
    	var ratioheight = height * (reps/material.elcount);
    	return ratioheight;
    },
	itemRepresents:function(thepane, thegroup, itemindex){
		var thedata = thegroup.data; 
		var numels = thegroup.numelements; 
		
    	if(thepane == pane2g && material.isDetached){
    		 thedata = thegroup.userdata;
    		 numels = thegroup.numuserelements;
    	}
    	
    	//console.log("data: ", thedata.length, itemindex);
    	
    	if(thedata.length <= itemindex)
    		return 0;
    		
    	if(material.elcount == 1)
			return 1;
    	
    	var isTopItem = false;
    	if(itemindex == (thedata.length - 1)) isTopItem = true;
    	
    	if(isTopItem){
    		var remainder = numels % material.elcount; 
    		if(remainder == 0) remainder = material.elcount;
    		
    		return remainder;
    	}
    	
    	return material.elcount;
    }, 
    highlightItemAndCounter:function(thepane, otherpane, thegroup, itemindex, counterindex){

    	var itemreps = this.itemRepresents(thepane, thegroup, itemindex);
    	var counterreps = this.itemRepresents(otherpane, thegroup, counterindex);
    	
    	//console.log("item reps: ", itemreps, "counter reps: ", counterreps);
    	
    	var theview = thepane.attr("currentView")
		var otherview = otherpane.attr("currentView");
    	
    	var iconhigh = 'url(#'+thegroup.icon+'_patH)';
		if( theview == "bar" ||theview == "tally") iconhigh = thegroup.highcolor;
		
		//highlight this item 
		var item = thepane.select('#'+thegroup.classname+'_'+itemindex);
		item.style("fill", iconhigh);
		

		//now deal with the counterpart
		iconhigh = 'url(#'+thegroup.icon+'_patH)';
		
		if( otherview == "bar" || otherview == "tally") 
			iconhigh = thegroup.highcolor;
		
		
		var ghostx = 0; 
		var ghosty = 0; 
		var ghostheight = 0;
		var ghostfill = iconhigh; 
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
			counteritem.style("fill", iconhigh);
			
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
			counteritem.style("fill", iconhigh);
			
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
					
    },
    
    highlightItem:function(thepane, itemindex, classname){
    	
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
	
		
    }, 
    dehighlightItem:function(itemindex, classname){
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
		
		
    
    },
    highlightGroup:function(classname){
		var groupIndex = this.groupIndx(classname);
		var thegroup = this.groups[groupIndex];
	
    	var panelnames=["pane1g", "pane2g"];
    	
    	for(var p = 0; p<panelnames.length; p++){
    	
    		var iconref = 'url(#'+thegroup.icon+'_patH)';
    		
    		var panel = d3.select('#'+panelnames[p]);
    		var currentView = panel.attr("currentView");
    		
    		if( currentView == "bar" ||currentView == "tally"){
    			iconref = thegroup.highcolor;
    		}
    			
    			
    		panel.selectAll('.'+classname)
							.style("fill", iconref);
		}
	},
	dehighlightGroup:function(classname){
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
						.style("fill",  iconref);
		}
	}, 
	clearAll:function(){
		pane1g.selectAll("*").remove();
		pane2g.selectAll("*").remove();
	},
	compare: function(){
		if(!this.isDetached)
			return;
			
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
			return true;
		}
		if(totaluser > total){
			return false;
		}
	
		return false;
	}, 
	xposRule:function(i){
		return 70+((elsize+25)*i);
	},
	yposRule:function(i){
		return height-(i*(elsize+spacing)) + 310;
	},
	scatterXRule:function(){
		return Math.random() * 450;
	},
	scatterYRule:function(){
		return Math.random()*450 + 90;
	}, 
	clusterXRule:function(i){
		return circles[i][0]+ Math.random()*150 - 150;
	}, 
	clusterYRule:function(i){
		return circles[i][1]+ Math.random()*150 - 150;
	}
}

