var elsize = 100;
var scalefactor = 0.55;
var clusterscalefactor = 0.75;
var spacing = 15; 

var dragging = false;
var animspeed = 1000;

//var isDetached = false;


var defs;

var nextpattern;
var prevpattern;

var scalebottompattern;

var upbutton;
var downbutton;
var upbuttonh;
var downbuttonh;

var scatterpattern;
var clusterpattern;
var stackpattern;
var tallypattern;
var barpattern;

var tripattern;
var tripatternh;

var tridwnpattern;
var tridwnpatternh;


var iconpattern_ids = [];


var complementaryColor = [0, 0, 0];





var panels = [pane1g, pane2g];
var views = ["scatter", "cluster", "stack", "tally", "bar"];

var swipe_t = 0;



var origins = [ [80, 190], [220, 320], [330, 500], [280, 150], [100, 420], [120, 250], [380, 400]]; //all origin centers predefined
var circles = [[350, 450], [600, 600], [350, 150], [125, 325], [125, 600], [350, 750], [600, 325]];

var clustercenters = [{"x": 350, "y":450, "color": "red"}, {"x":600, "y":600, "color": "green"}, {"x":350, "y":150, "color": "blue"}, 
						{"x":125, "y":325, "color": "purple"}, {"x":125, "y":600, "color": "cyan"}, {"x":350, "y":750, "color": "yellow"}, 
						{"x":600, "y":325, "color": "orange"}, {"x": 350, "y":450, "color": "red"}];



// COLORS ARE :
// 1-7. color of each bar in the bar charts
// 8. highlight color in the bar chart (same for all bars)
// 9. title text color

var colors = {};
var colors_cuteanimal  = ["#000", "#000", "#000", "#000", "#000", "#000", "#000", "#f0f", "#cf68cf"];
var colors_monster  = ["#00007f", "#00bf5f", "#ff7f00", "#ff00ff", "#ffc700", "#a509a5", "#007fff", "#f00", "#f00"];
var colors_flower  = ["#dcaacb", "#dcaacb", "#dcaacb", "#dcaacb", "#dcaacb", "#dcaacb", "#dcaacb", "#b1164f", "#b1164f"];
var colors_fish = ["#FBB03B","#D4145A","#FF7BAC","#F15A24","#662D91","#ED1C24","#A381BD", "#FCEE21", "#D4145A"];
var colors_animal = ["#6adda2", "#ff7f00", "#dd5a5a", "#3c6996", "#7f00ff", "#e570a9", "#aac6ff", "#000", "#000"];
var colors_vegetable = ["#ff7f00", "#d11919", "#480c89", "#ead80e", "#a57a24", "#ff99ff", "#007f3f", "#ffffff", "#90605c"];
var colors_food = ["#cf802c", "#f31e41", "#a1182f", "#f3501e", "#c3a036", "#e86565", "#d96836", "#000", "#000" ];
var colors_swars  = ["#4d4dff", "#e600e6", "#99ddff", "#cc0000", "#006622", "#ff8000", "#6600cc", "#dddddd", "#444444"];
var colors_arctic  = ["#000", "#000", "#000", "#000", "#000", "#000", "#000", "#f0f", "#000"];
var colors_planets  = ["#ccc", "#ccc", "#ccc", "#ccc", "#ccc", "#ccc", "#ccc", "#f0f", "#fff"];
var colors_witches  = ["#ccc", "#ccc", "#ccc", "#ccc", "#ccc", "#ccc", "#ccc", "#f0f", "#fff"];



colors["cuteanimal"] = colors_cuteanimal;
colors["monster"] = colors_monster;
colors["flower"] = colors_flower;
colors["fish"] = colors_fish;
colors["animal"] = colors_animal;
colors["vegetable"] = colors_vegetable;
colors["food"] = colors_food;
colors["swars"] = colors_swars;
colors["arctic"] = colors_arctic;
colors["planets"] = colors_planets;
colors["witches"] = colors_witches;



//surface resolution 2160*1440

var cuteanimalnames = ["Cat", "Dog", "Chick", "Bunny", "Owl", "Chameleon", "Penguin"];
var monsternames = ["Gam", "Baru", "Dag", "Gor", "Hed", "Kama", "Ghid"];
var flowernames = ["Tulip", "Daisy", "Rose", "Clover", "Poppy", "Sunflower", "Lilly"];
//var fishnames = ["Cupra", "Lufer", "Cinekop", "Laos", "Palamut", "Kilic", "Hamsi"];
var fishnames = ["Comet", "Nemo", "Freckles", "Bicker", "Finley", "Crimson", "Spike"];
var animalnames = ["Cat", "Owl", "Dog", "Fish", "Bunny", "Camel", "Elephant"];
//var vegetablenames = ["Carrot", "Tomato", "Eggplant", "Bell pepper", "Potato", "Turnip", "Broccoli"];
var vegetablenames = ["Carotte", "Tomate", "Aubergine", "Poivron", "Pomme de terre", "Navet", "Brocoli"]; 
var foodnames = ["Pizza", "Fish", "Cheese", "Milk", "Chicken", "Shrimp", "Burger"];
var swarsnames = ["Han Solo", "Leia", "Luke", "Darth Vader", "Yoda", "C3PO", "R2D2"];
//var arcticnames = ["Polar bear", "Seal", "Arctic Hare", "Caribou", "Arctic Fox", "Penguin", "Puffin"];
var arcticnames = ["Ours polaire", "Otarie", "Lièvre arctique", "Caribou", "Renard arctique", "Pingouin", "Puffin"];
var planetnames = ["Earth", "Mercury", "Mars", "Venus", "Jupiter", "Saturn", "Neptune"];
//var witchesnames = ["Snake", "Slug", "Rat", "Stinging Nettle", "Toad", "Bat", "Snail"];
var witchesnames = ["Serpent", "Limace", "Rat", "Ortie", "Crapaud", "Chauve-souris", "Escargot"];



var names = {};
names["cuteanimal"] = cuteanimalnames;
names["monster"] = monsternames;
names["flower"] = flowernames;
names["fish"] = fishnames;
names["animal"] = animalnames;
names["vegetable"] = vegetablenames;
names["food"] = foodnames;
names["swars"] = swarsnames;
names["arctic"] = arcticnames;
names["planets"] = planetnames;
names["witches"] = witchesnames;


//holds the fonts information for each theme, sizes are for secondary titles first, and the main title (c'est la vis)
var fonts = {};
var materials = {};

if(themelevel == 2){
	materials["material1"] = ['animation', 		'arctic', 	'bg_arctic-01'];
	materials["material2"] = ['animation', 		'swars', 		'bg_swars-01'];
	materials["material3"] = ['coordination', 	'planets', 		'bg_planets-01'];
	materials["material4"] = ['coordination', 	'fish', 		'bg_sea'];
	materials["material5"] = ['cat', 	'witches', 	'bg_witches-01'];
	materials["material6"] = ['scale', 	'vegetable', 		'bg_scale'];
	
	
	fonts["material1"] = ["snow", 22, 44];
	fonts["material2"] = ["swars", 16, 40];
	fonts["material3"] = ["space", 18, 40];
	fonts["material4"] = ["radio", 24, 55];
	fonts["material5"] = ["witches", 22, 50];
	fonts["material6"] = ["caprica", 24, 50];

}
else if(themelevel == 1){
	materials["material1"] = ['animation', 		'cuteanimal', 	'bg_animals2'];
	materials["material2"] = ['animation', 		'monster', 	'bg_monsters'];
	materials["material3"] = ['coordination', 	'flower', 	'bg_flower'];
	materials["material4"] = ['coordination', 	'fish', 	'bg_sea'];
	materials["material5"] = ['cat', 	'food', 	'bg_cat'];
	materials["material6"] = ['scale', 	'vegetable', 		'bg_scale'];
	
	
	fonts["material1"] = ["radio", 22, 44];
	fonts["material2"] = ["monsterfont", 24, 55];
	fonts["material3"] = ["flowerfont", 10, 20];
	fonts["material4"] = ["radio", 24, 55];
	fonts["material5"] = ["catfont", 22, 50];
	fonts["material6"] = ["caprica", 24, 50];

}



function definePatterns(){
	defs = svg_dummy.append("defs");
	
	nextpattern = defs.append("pattern")
		.attr("id", "nextpattern")
		.attr("height", "1")
		.attr("width", "1");	
	nextpattern.append("image") 
		.attr("height", "20")
		.attr("width", "20")
		.attr("xlink:href", "icons/forward.png");
		
	prevpattern = defs.append("pattern")
		.attr("id", "prevpattern")
		.attr("height", "1")
		.attr("width", "1");	
	prevpattern.append("image") 
		.attr("height", "20")
		.attr("width", "20")
		.attr("xlink:href", "icons/rewind.png");
		
		
	scatterpattern = defs.append("pattern")
		.attr("id", "scatterpattern")
		.attr("height", "1")
		.attr("width", "1");	
	scatterpattern.append("image") 
		.attr("height", "30")
		.attr("width", "20")
		.attr("xlink:href", "images/smallicons/scatter.png");
		
	clusterpattern = defs.append("pattern")
		.attr("id", "clusterpattern")
		.attr("height", "1")
		.attr("width", "1");	
	clusterpattern.append("image") 
		.attr("height", "30")
		.attr("width", "20")
		.attr("xlink:href", "images/smallicons/cluster.png");	
		
		
	stackpattern = defs.append("pattern")
		.attr("id", "stackpattern")
		.attr("height", "1")
		.attr("width", "1");	
	stackpattern.append("image") 
		.attr("height", "30")
		.attr("width", "20")
		.attr("xlink:href", "images/smallicons/stack.png");
		
		
	tallypattern = defs.append("pattern")
		.attr("id", "tallypattern")
		.attr("height", "1")
		.attr("width", "1");	
	tallypattern.append("image") 
		.attr("height", "35")
		.attr("width", "20")
		.attr("xlink:href", "images/smallicons/tally.png");
		
		
	barpattern = defs.append("pattern")
		.attr("id", "barpattern")
		.attr("height", "1")
		.attr("width", "1");	
	barpattern.append("image") 
		.attr("height", "30")
		.attr("width", "20")
		.attr("xlink:href", "images/smallicons/bar.png");
		
	
	scalebottompattern = defs.append("pattern")
		.attr("id", "scalepattern")
		.attr("height", "1")
		.attr("width", "1");
	scalebottompattern.append("image") 
		.attr("height", "50")
		.attr("width", "450")
		.attr("xlink:href", "images/scaleBottom.png");
		
		
	// START JEREMY EDIT
	/*tripattern = defs.append("pattern")
		.attr("id", "tripattern")
		.attr("height", "1")
		.attr("width", "1");
	tripattern.append("image") 
		.attr("height", "50")
		.attr("width", "70")
		.attr("xlink:href", "images/triangle.png");*/
	tripattern = defs.append("pattern")
		.attr("id", "tripattern")
		.attr("height", "1")
		.attr("width", "1");
	tripattern.append('path')
		.attr('d', 'M0,30 L70,30 L35,0 Z')
		.attr('transform', 'translate(' + [0, 10] + ')');
	// END JEREMY EDIT
		
		
	tripatternh = defs.append("pattern")
		.attr("id", "tripatternh")
		.attr("height", "1")
		.attr("width", "1");
	tripatternh.append("image") 
		.attr("height", "50")
		.attr("width", "70")
		.attr("xlink:href", "images/triangleh.png");
		
	
	// START JEREMY EDIT
	/*tridwnpattern = defs.append("pattern")
		.attr("id", "tridwnpattern")
		.attr("height", "1")
		.attr("width", "1");
	tridwnpattern.append("image") 
		.attr("height", "50")
		.attr("width", "70")
		.attr("xlink:href", "images/tridown.png");*/
	tridwnpattern = defs.append("pattern")
		.attr("id", "tridwnpattern")
		.attr("height", "1")
		.attr("width", "1");
	tridwnpattern.append('path')
		.attr('d', 'M0,0 L70,0 L35,30 Z')
		.attr('transform', 'translate(' + [0, 10] + ')');
	// END JEREMY EDIT
		
	tridwnpatternh = defs.append("pattern")
		.attr("id", "tridwnpatternh")
		.attr("height", "1")
		.attr("width", "1");
	tridwnpatternh.append("image") 
		.attr("height", "50")
		.attr("width", "70")
		.attr("xlink:href", "images/tridownh.png");
		

}

definePatterns();


function addIconPattern(iconname, boolhighlightmode){
    
    var iconpatternid = iconname+'_pat';
    
    
    if(iconpattern_ids.indexOf(iconpatternid) > -1) 
    	return;
    else{
		var iconpattern = defs.append("pattern")
			.attr("id", iconpatternid)
			.attr("height", 1)
			.attr("width", 1);
		
		iconpattern.append("image") 
				.attr("id", iconname+'_img')
				.attr("height", elsize)
				.attr("width", elsize)
				.attr("xlink:href", material.path+'/'+iconname+'.svg');
				
				
				
		iconpattern_ids.push(iconpatternid);
		
		
		if(boolhighlightmode){
			var iconpatternH = defs.append("pattern")
				.attr("height", 1)
				.attr("width", 1);
		
			iconpatternH.append("image") 
					.attr("height", elsize)
					.attr("width", elsize)
					.attr("xlink:href", (material.path+'/'+iconname+'h.svg'));
		}

	}
}





