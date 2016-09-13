function Group (classname) {
    this.classname = classname; 
    this.icon;
    this.icongroup;
    this.iconnum; // this actually is the table row index
    this.numelements;
    this.numuserelements = 0;
    
    this.data = [];
    this.userdata = [];
    this.color;
    this.highcolor;
    this.name;
    this.vieworder;
}

Group.prototype = {
    constructor: Group,
    createGroup:function (icons, rowindex, numelements) {

    	this.numelements = numelements; 
    	this.updateCount();
    	
    	
    	this.icongroup = icons;
    	this.iconnum = rowindex;
    	
    	this.icon = ''+this.icongroup+this.iconnum;
    	this.color = colors[this.icongroup][this.iconnum];
    	this.highcolor = colors[this.icongroup][7];
    	this.name = names[this.icongroup][this.iconnum];
    	
    	var iconref = 'url(#'+this.icon+'_pat)';	
    }, 
    removeGroupFromPane:function(thepane){
    	var theclass = this.classname;
    	
    	thepane.selectAll('.'+theclass).remove();
	 	thepane.select('#'+theclass+'_labelgr').remove();
	 	
	 	 	
    },
    addGroupToPane:function(pane){
    	//console.log("TheGroup:addGroupToPane: is called");
    	var thedata = this.data; 
    	var theclass = this.classname;
    	
    	var thepane = pane;
    	var theview = pane.attr("currentView");
    	
    	var vieworder = material.groupIndx(theclass);
    	
    	var iconref = 'url(#'+this.icon+'_pat)';
    	var colorref = this.color;
    	
    
    	
    	//first clear the older version of the group if exists
    	thepane.selectAll('.'+theclass).remove();
		thepane.selectAll('.'+theclass+'_label').remove();
	 	thepane.select('#'+theclass+'_button').remove();
    	
    	
    	if(thepane == pane2g && ( material.mode == 'animation' || material.mode == 'cat' || material.mode == 'scale' || material.isDetached)){
				//then do not add the labels
		}
    	else{
			var elements = thepane.selectAll ('elements')
											.data(this.data)
											.enter()
											.append("rect"); 
		
		
			elements
				   .attr("class", theclass)
				   .attr("panel", thepane.attr("id"))
				   .attr("index", function(d, i){return i;})
				   .attr("id", function(d, i){return theclass+'_'+i;})
				   .attr("scatterx", function(d){
				   		return material.scatterXRule();
				   })
				   .attr("clusterx", function(d){
				   		return material.clusterXRule(vieworder);
				   })
				   .attr("x", function(d){
						if(theview == "scatter")
							return d3.select(this).attr("scatterx");
						else if(theview == "cluster")
							return d3.select(this).attr("clusterx");
						else 
							return material.xposRule(vieworder);
					})
					.attr("scattery", function(d){
						return material.scatterYRule();
					})
					.attr("clustery", function(d){
						return material.clusterYRule(vieworder);
					})
					.attr("y", function(d, i){
						if(theview == "scatter")
							return d3.select(this).attr("scattery");
						else if(theview == "cluster")
							return d3.select(this).attr("clustery");
						else
							return material.yposRule(i); 
					})
					.attr("width", elsize)
					.attr("height", function(d){
						if(theview == "bar")
							return (elsize+spacing)+1;
						else 
							return elsize;
					})
					.attr("transform", function(d) { 
						if(theview == "scatter" || theview == "cluster")
							return "scale(1.0)";
						else
							return "scale("+scalefactor+")";
					})
					.style("fill", function(d){
						if(theview == "tally" || theview == "bar" )
							return colorref;
						else
							return iconref;
					})
				   .on('mouseover', function(d){
						if(dragging) return;
						material.highlightItem(pane, d3.select(this).attr("index"), d3.select(this).attr("class"));
					})
					.on('mouseout', function(d){
						if(dragging) return;
						material.dehighlightItem(d3.select(this).attr("index"), d3.select(this).attr("class"));
					})
					.on("touchstart", function(){
						material.highlightItem(pane, d3.select(this).attr("index"), d3.select(this).attr("class"));
						d3.event.preventDefault();
					 })
					.on("touchmove", function(){
						d3.event.preventDefault();
					})
					.on("touchend", function(){
						material.dehighlightItem(d3.select(this).attr("index"), d3.select(this).attr("class"));
						
					})
					.call(drag);
					
			}
			
			
			//add the buttons to the bottom
			
			if(thepane == pane1g && ( material.mode == 'cat' || material.mode == 'scale' || material.isDetached)){
				//then do not add the labels
			}
			else{
				var labelGroup = thepane
									.append("g")
									.attr("id", theclass+'_labelgr')
									.attr("transform", "translate(0,"+ material.labelpos + ") scale("+scalefactor+")");  
					
			   // var butx =  material.xposRule(vieworder)  + 35;
			
			    var upbutton = labelGroup
			    					.append("rect")//.append("path")
			    					.attr("id", theclass)
									.attr("class", theclass+'_button')
									.attr("width", elsize)
									.attr("height", elsize*0.5)	
									.attr("x", material.xposRule(vieworder) +15)
									.attr("y", -10)
			    					.style("fill", "url(#tripattern)") 
			    					.on("mouseover", function() {
        									d3.select(this).style("fill", "url(#tripatternh)"); 
        							 })
        							 .on("mouseout", function() {
        									d3.select(this).style("fill", "url(#tripattern)"); 
        							 })
			    					.on("click", function(){
										var classnm = d3.select(this).attr("id");
										//identify the group from the class name
										var groupIndex = material.groupIndx(classnm);
										var thegroup = material.groups[groupIndex];
						
										thegroup.populate(true);
				
									});
			    					
			    					
			    var downbutton = labelGroup
			    					.append ("rect") //.append("path")
			    					.attr("id", theclass)
									.attr("class", theclass+'_button')	
			    					.attr("width", elsize)
									.attr("height", elsize*0.5)	
									.attr("x", material.xposRule(vieworder) +15)
									.attr("y", 140)
			    					.style("fill", "url(#tridwnpattern)") 
			    					.on("mouseover", function() {
        									d3.select(this).style("fill", "url(#tridwnpatternh)"); 
        							 })
        							 .on("mouseout", function() {
        									d3.select(this).style("fill", "url(#tridwnpattern)"); 
        							 })
			    					.on("click", function(){
										var classnm = d3.select(this).attr("id");
										//identify the group from the class name
										var groupIndex = material.groupIndx(classnm);
										var thegroup = material.groups[groupIndex];
						
										thegroup.populate(false);
									});		
									
									
					var label = labelGroup.append("rect")
									.attr("id", theclass)
									.attr("class", theclass+'_label')
									.attr("panel", thepane.attr("id"))
									.attr("x", material.xposRule(vieworder))
									.attr("y", 40)
									.attr("width", elsize)
									.attr("height", elsize)
									.style("fill", iconref)
									.on("touchstart", function(){
										d3.event.preventDefault();
									})
									.on("touchmove", function(){
										d3.event.preventDefault();
									})
									.call(limiteddrag);	
				
				
			}
			
			this.handleRemainder(thepane);
    
    },
    
    displayLine: function(thepane, itemind){
    	
    	var theclass = this.classname;
        var vieworder = material.groupIndx(this.classname);
        var x1 = material.xposRule(vieworder);
        var x2 = 60;
        
        var y = material.yposRule(itemind);
        
        if(material.elcount> 1){
			thepane.selectAll('.'+theclass).each( function(d, i){
				if(i == itemind){
					
					y = d3.select(this).attr("y");
					//console.log( "y is: ",  y);
				}
			});
		}
    
    	var colorref = this.color;
    	thepane.append("line")          // attach a line
    			.attr("class", "meetaxisline")
    			.style("stroke", colorref)  // colour the line
    			.attr("stroke-width", 6)
    			.attr("x1", x1)     // x position of the first end of the line
    			.attr("y1", y)      // y position of the first end of the line
    			.attr("x2", x2)     // x position of the second end of the line
    			.attr("y2", y)
    			.attr("transform", "scale("+scalefactor+")");  
    
    }, 
    
    updateCount: function (){
    	
    	
    	var elcount = material.elcount;
    	var begin = material.begincount;
    
    	
    	var visel = Math.ceil((this.numelements - begin) / elcount);
    	
    	//console.log("visible elements: ", visel);
    	
    	this.data = [];
    	
    	for(var n=0; n<visel; n++){
    		this.data.push(n);
    	}
    	
    	//do the same for the user data:
    	var visuserel = Math.ceil( (this.numuserelements - begin) / elcount);
    	
    	this.userdata = [];
    	
    	for(var n=0; n<visuserel; n++){
    		this.userdata.push(n);
    	}
    	
    	
    },
    
    handleRemainder: function(pane){
    
        //console.log("handle remainder is called: ");
    
    	var numels = this.numelements;
    	
    	
    	if(pane == pane2g && (material.mode == "cat" || material.mode == "scale" || material.isDetached))
    		numels = this.numuserelements;
    		
    	var elcount = material.elcount;
    	var begin = material.begincount;
    	var remainder = (numels - begin) % elcount; 
    	
    	if(elcount == 1 || remainder == 0)
    		return;
    		
    	var topitem = Math.ceil( (numels - begin) / elcount) - 1;
    	var height = elsize;
    	if(pane.attr("currentView") == "bar")
    		height = elsize + spacing + 1;
    		
    	var ratioheight = height * (remainder/elcount);
    	
    
    	//now pick the top element and adjust it's height
    	pane.selectAll('.'+this.classname)
    				.attr("height", function(d, i){
    				    
    					if(i == topitem){
    						return ratioheight;
    					}
    					else
    						return height;
    				})
    				.attr("y", function(d, i){
    					if(pane.attr("currentView") == "scatter")
							return d3.select(this).attr("scattery"); 
						else if(pane.attr("currentView") == "cluster")
							return d3.select(this).attr("clustery"); 
						else{
							if(i == topitem)
								return  material.yposRule(i) - ratioheight + height;
							else
								return material.yposRule(i); 
							
						}
								
						
    				
    				});
    
    	
    },
    
    updateGroupOnPane:function (thepane){
    	var theclass = this.classname;
    
    	var theview = thepane.attr("currentView");
    	
    	var vieworder = material.groupIndx(theclass);
    	
    	thepane.selectAll('.'+theclass+'_button').attr("x", material.xposRule(vieworder)+15);
    	thepane.select('.'+theclass+'_label').attr("x", material.xposRule(vieworder));
    
    	var iconref = 'url(#'+this.icon+'_pat)';
    	var colorref = this.color;	
    	
    	
    	if(thepane == pane1g){
    	
    		//UPDATE EXISTING ELEMENTS
			var selection = thepane.selectAll('.'+theclass)
							.data(this.data)
							.attr("x", function(d){
								if(theview == "scatter")
									return d3.select(this).attr("scatterx"); 
								else if(theview == "cluster")
									return d3.select(this).attr("clusterx"); 
								else 
									return material.xposRule(vieworder);
							})
							.attr("y", function(d, i){
								if(theview == "scatter")
									return d3.select(this).attr("scattery"); 
								else if(theview == "cluster")
									return d3.select(this).attr("clustery"); 
								else
									return material.yposRule(i); 
							})
							.attr("height", function(d){
								if(theview == "bar")
									return (elsize+spacing)+1;
								else 
									return elsize;
							})
							.attr("transform", function(d) { 
								if(theview == "scatter" || theview == "cluster")
									return "scale(1.0)";
								else
									return "scale("+scalefactor+")";
							})
							.style("fill", function(d){
								if(theview == "tally" || theview == "bar" )
									return colorref;
								else
									return iconref;
							});
						
						
						
			//ADD NEW ELEMENTS
			selection.enter()
						.append("rect")
						.attr("class", theclass)
						.attr("panel", thepane.attr("id"))
						.attr("id", function(d, i){return theclass+'_'+i;})
						.attr("index", function(d, i){return i;})
						.attr("scatterx", function(d){
				   			return material.scatterXRule();
					   	})
					   	.attr("clusterx", function(d){
							return material.clusterXRule(vieworder);
					   	})
					   	.attr("x", function(d){
							if(theview == "scatter")
								return d3.select(this).attr("scatterx");
							else if(theview == "cluster")
								return d3.select(this).attr("clusterx");
							else 
								return material.xposRule(vieworder);
						})
						.attr("scattery", function(d){
							return material.scatterYRule();
						})
						.attr("clustery", function(d){
							return material.clusterYRule(vieworder);
						})
						.attr("y", function(d, i){
							if(theview == "scatter")
								return d3.select(this).attr("scattery");
							else if(theview == "cluster")
								return d3.select(this).attr("clustery");
							else
								return material.yposRule(i); 
						})
						.attr("width", elsize)
						.attr("height", function(d){
							if(theview == "bar")
								return (elsize+spacing)+1;
							else 
								return elsize;
						})
						.attr("transform", function(d) { 
							if(theview == "scatter" || theview == "cluster")
								return "scale(1.0)";
							else
								return "scale("+scalefactor+")";
						})
						.style("fill", function(d){
							if(theview == "tally" || theview == "bar" )
								return colorref;
							else
								return iconref;
						})
						.on('mouseover', function(d){
							var itemindex = d3.select(this).attr("index");
							var classname = d3.select(this).attr("class");
							material.highlightItem(thepane, itemindex, classname);
						})
						.on('mouseout', function(d){
							var itemindex = d3.select(this).attr("index");
							var classname = d3.select(this).attr("class");
							material.dehighlightItem(itemindex, classname);
						})
						.on("touchstart", function(){
							d3.event.preventDefault();
						 })
						.on("touchmove", function(){
							d3.event.preventDefault();
						})
						.on("touchend", function(){
							material.dehighlightItem(d3.select(this).attr("index"), d3.select(this).attr("class"));
						})
						.call(drag);
		
			//REMOVE ELEMENTS	
			selection.exit().remove();
		
		}
		if(thepane == pane2g){
    	
    	    var thedata = this.data;
    	        
    	    if(material.isDetached == true || material.mode == "cat" || material.mode == "scale")
    	    	thedata = this.userdata;
    	    
    	    	
    	    
    		//UPDATE EXISTING ELEMENTS
			var selection = thepane.selectAll('.'+theclass)
							.data(thedata)
							.attr("x", function(d){
								if(theview == "scatter")
									return d3.select(this).attr("scatterx"); 
								else if(theview == "cluster")
									return d3.select(this).attr("clusterx"); 
								else 
									return material.xposRule(vieworder);
							})
							.attr("y", function(d, i){
								if(theview == "scatter")
									return d3.select(this).attr("scattery"); 
								else if(theview == "cluster")
									return d3.select(this).attr("clustery"); 
								else
									return material.yposRule(i); 
							})
							.attr("height", function(d){
								if(theview == "bar")
									return (elsize+spacing)+1;
								else 
									return elsize;
							})
							.attr("transform", function(d) { 
								if(theview == "scatter" || theview == "cluster")
									return "scale(1.0)";
								else
									return "scale("+scalefactor+")";
							})
							.style("fill", function(d){
								if(theview == "tally" || theview == "bar" )
									return colorref;
								else
									return iconref;
							});
						
						
						
			//ADD NEW ELEMENTS
			selection.enter()
						.append("rect")
						.attr("class", theclass)
						.attr("panel", thepane.attr("id"))
						.attr("id", function(d, i){return theclass+'_'+i;})
						.attr("index", function(d, i){return i;})
						.attr("scatterx", function(d){
				   			return material.scatterXRule();
					   	})
					   	.attr("clusterx", function(d){
							return material.clusterXRule(vieworder);
					   	})
					   	.attr("x", function(d){
							if(theview == "scatter")
								return d3.select(this).attr("scatterx");
							else if(theview == "cluster")
								return d3.select(this).attr("clusterx");
							else 
								return material.xposRule(vieworder);
						})
						.attr("scattery", function(d){
							return material.scatterYRule();
						})
						.attr("clustery", function(d){
							return material.clusterYRule(vieworder);
						})
						.attr("y", function(d, i){
							if(theview == "scatter")
								return d3.select(this).attr("scattery");
							else if(theview == "cluster")
								return d3.select(this).attr("clustery");
							else
								return material.yposRule(i); 
						})
						.attr("width", elsize)
						.attr("height", function(d){
							if(theview == "bar")
								return (elsize+spacing)+1;
							else 
								return elsize;
						})
						.attr("transform", function(d) { 
							if(theview == "scatter" || theview == "cluster")
								return "scale(1.0)";
							else
								return "scale("+scalefactor+")";
						})
						.style("fill", function(d){
							if(theview == "tally" || theview == "bar" )
								return colorref;
							else
								return iconref;
						})
						.on('mouseover', function(d){
							var itemindex = d3.select(this).attr("index");
							var classname = d3.select(this).attr("class");
							material.highlightItem(thepane, itemindex, classname);
						})
						.on('mouseout', function(d){
							var itemindex = d3.select(this).attr("index");
							var classname = d3.select(this).attr("class");
							material.dehighlightItem(itemindex, classname);
						})
						.call(drag);
		
			//REMOVE ELEMENTS	
			selection.exit().remove();
		
		}
		
		this.handleRemainder(thepane);
						
	},
	
	
	updateIcon:function(panel, icongroup) {
    
    	this.icongroup = icongroup;
    	this.icon = ''+icongroup+this.iconnum;
    	
    	//console.log(this.icon, icongroup, this.iconnum);
    	this.color = colors[icongroup][this.iconnum];
    	this.name = names[icongroup][this.iconnum];
    	
    	var iconref = 'url(#'+this.icon+'_pat)';
    	
    	addIconPattern(this.icon);
    	
    	
    	var thedata = this.data; 
    	var theclass = this.classname;
    	
    	var thepane = panel;
    	var theview = panel.attr("currentView"); 
    	
    	var colorref = this.color;
    	
    	
    	var selection = thepane.selectAll('.'+theclass)
				.style("fill", function(d){
						if(theview == "tally" || theview == "bar" )
							return colorref;
						else
							return iconref;
					});
				
		
		thepane.selectAll('.'+theclass+'_label').style("fill", iconref);
		thepane.selectAll('.'+theclass+'_pop').style("fill", iconref);
    }, 
    
    populate:function(pop) {
    	
    	
    	var elcount = material.elcount; 
	    var begin = material.begincount;
	
		if( material.isDetached == true || material.mode == 'cat' || material.mode == 'scale'){
		
			var currcount = this.numuserelements;
			if(pop){						
				currcount++;
				if(currcount > 10*elcount) currcount = 10*elcount;
			}
			else{
				currcount--;
				if(currcount < 0) currcount = 0;
			}
	
			this.numuserelements = currcount;
			
			var visel = Math.ceil((currcount - begin) / elcount);
			this.userdata = [];
		
			for(var n=0; n<visel; n++){
				this.userdata.push(n);
			}

			this.updateGroupOnPane(pane2g);
			
			material.compare();
		
			
		} 
		else{

			var currcount = this.numelements;
		
			if(pop){						
				currcount++;
				if(currcount >10*elcount) currcount = 10*elcount;
			}
			else{
				currcount--;
				if(currcount < 0) currcount = 0;
			}
		
		
			this.numelements = currcount;
			this.updateCount();
			
			
			this.updateGroupOnPane(pane1g);
			this.updateGroupOnPane(pane2g);
		
			//update the value on the input table
			document.getElementById('CountButton'+this.iconnum).value = currcount;
		
			//update the value on the final table
			var grpindx = material.groups.indexOf(this);
		
			var fintab = document.getElementById('finaltable');
		
			//console.log("table: ", fintab.rows);
			fintab.rows[grpindx+1].cells[1].innerHTML = currcount;
	
		} 
		
    }, 
    
    addUserData:function(count){

    	if( material.isDetached == true || material.mode == 'cat' || material.mode == 'scale'){
			this.numuserelements = count;
			var elcount = material.elcount; 
			
			var visel = Math.ceil(count / elcount);
			this.userdata = [];
		
			for(var n=0; n<visel; n++){
				this.userdata.push(n);
			}

			this.updateGroupOnPane(pane2g);
			
			material.compare();
    
    	}
    }
}



