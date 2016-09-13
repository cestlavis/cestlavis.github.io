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
    
    //this.begincount = 0;
    
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
    				
    	
    	
    	/*var xScale = d3.scale.linear()
                         .domain([1,8])
                         .range([60,width-5]);
    	
		var xAxis = d3.svg.axis()
							.scale(xScale)
							.ticks(3)
							.tickFormat("")
							.orient("bottom");
		
		    
		    
		thepane.append("g")
						.attr("class", "axis xaxis")
						.attr("id", "mat_xaxis")
						.attr("transform", "translate(0," + (height-60) + ")")
						.style("visibility", function(d) {
							return (theview == "scatter" || theview == "cluster") ? "hidden" : "visible";
						})
						.call(xAxis);
					
	
    	*/			

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
    	//this.updateXaxis();
    	
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
    updateXaxis: function(){	
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
    },
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
    highlightItem:function(thepane, itemindex, classname){
    	
    	var groupIndex = this.groupIndx(classname);
		var thegroup = this.groups[groupIndex];
		
		var isTopItem = false;
		
		var numels = thegroup.data.length;
		if(thepane == pane2g && material.isDetached == true)
			numels = thegroup.userdata.length;
			
		if(itemindex == (numels - 1))
			isTopItem = true;
		
		/////////////////////////////////////////////////////////////////////
		////when top of the bar is highlighted, this block will call the line
		if(thepane.attr("currentView") == "bar" || thepane.attr("currentView") == "tally" || thepane.attr("currentView") == "stack"){
			
			
			//console.log("mat mode here is: ", material.mode);
			
			if(isTopItem){
				thegroup.displayLine(thepane, itemindex);	
			}
		
		}
		//end of block
		/////////////////////////////////////////////////////////////////////
	
	
	    if(material.isDetached){
	    	
			var currentView = thepane.attr("currentView");
		
			var iconref1 = 'url(#'+thegroup.icon+'_pat)';
			var iconref2 = 'url(#'+thegroup.icon+'_patH)';
		
			if( currentView == "bar" || currentView == "tally" ){
				iconref1 = thegroup.color;
				iconref2 = thegroup.highcolor;
			}
			
			if( currentView == "bar" || currentView == "tally" || currentView == "stack"){
			
				thepane.selectAll('.'+classname)
								.style("fill", function(d, i){
								if(i <= itemindex)
									return iconref2;
								else
									return iconref1;
				
								});
			}
			else{    		
				thepane.selectAll('.'+classname)
							.style("fill", function(d, i){
								if(i == itemindex)
									return iconref2;
								else
									return iconref1;
			
								});
			
			
			}
	    }
	    
	    else{
				var panelnames=["pane1g", "pane2g"];
		
				for(var p = 0; p<panelnames.length; p++){
		
					var iconref1 = 'url(#'+thegroup.icon+'_pat)';
					var iconref2 = 'url(#'+thegroup.icon+'_patH)';
			
					var panel = d3.select('#'+panelnames[p]);
					var currentView = panel.attr("currentView");
			
					if( currentView == "bar" ||currentView == "tally"){
				
						iconref1 = thegroup.color;
						iconref2 = thegroup.highcolor;
					}
		
					if(thepane.attr("currentView") == "bar" || thepane.attr("currentView") == "tally" || thepane.attr("currentView") == "stack")
					{
							panel.selectAll('.'+classname)
								.style("fill", function(d, i){
									if(i <= itemindex)
										return iconref2;
									else
										return iconref1;
		
							});

							
					}
					else{
				
						if( currentView == "bar" || currentView == "tally" || currentView == "stack"){
							if(material.elcount == 1)
								itemindex = 0;
							else{
								if(!isTopItem)
									itemindex = 0;
							}
						}
			
						panel.selectAll('.'+classname)
									.style("fill", function(d, i){
										if(i == itemindex)
											return iconref2;
										else
											return iconref1;
				
										});
			
						}
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
						.style("fill",  iconref);
						//.style("opacity", 1.0);
						
						
			//removes the temp line meeting the axis			
			panel.selectAll('.meetaxisline').remove();

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
		return origins[i][0] + Math.random()*180 -90;
	}, 
	clusterYRule:function(i){
		return origins[i][1] + Math.random()*180 -90;
	}
}



