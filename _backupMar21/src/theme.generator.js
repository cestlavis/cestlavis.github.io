var debug = true;

function showThemeEditor () {

	var bg = d3.select('body')
		.append('div')
		.attr('class', 'dim-bg');
	var container = d3.select('body')
		.append('div')
		.attr('class', 'theme-editor-container')
	.append('div')
		.attr('class', 'theme-editor-inner-container');

	// ADD NAME
	var name_label = container.append('label')
		.style('width', '100%')
		.attr('for', '#new-theme-name');
	name_label.append('div')
		.style('float', 'left')
		.html('Theme name:');
	name_label.append('div')
		.style('float', 'right')
		.style('text-decoration', 'underline')
		.html('Close X')
	.on('click', rmThemeEditor)
	.on('touchend', rmThemeEditor);
	container.append('input')
		.attr('type', 'text')
		.attr('id', 'new-theme-name');

	// ADD TYPE
	container.append('label')
		.style('width', '100%')
		.html('Type of exercise:')

	var types = container.selectAll('.type-selector')
		.data(['animation', 'coordination']);

	types.enter()
		.append('div')
		.attr('class', 'type-selector')
		.style('padding-left', '25px')
		.style('float', 'left');

	types.append('input')
		.attr('type', 'radio')
		.attr('name', 'exercise-type')
		.attr('id', function (d) { return 'type-' + d; })
		.attr('value', function (d) { return d; });

	types.append('label')
		.attr('for', function (d) { return '#type-' + d; })
		.style('margin-left', '10px')
		.style('vertical-align', 'middle')
		.html(function (d) { return d; });

	container.append('div')
		.attr('class', 'spacer');

	// ADD BG IMAGE
	container.append('label')
		.attr('for', '#new-theme-bg')
		.html('Theme background image:&nbsp;');
	container.append('input')
		.datum({ type: 'bg' })
		.attr('type', 'file')
		.attr('id', 'new-theme-bg')
	.on('change', loadFile);

	container.append('div')
		.attr('class', 'spacer');

	// ADD ICONS
	for (var i=1; i<8; i++) {
		var upload = container.append('div')
			.style('width', '100%');
		upload.append('label')
			.attr('for', '#new-theme-icon-' + i)
			.html('Theme icon #' + i + ':&nbsp;');
		upload.append('input')
			.datum({ type: 'icon-' + i })
			.attr('type', 'file')
			.attr('id', 'new-theme-icon' + i)
		.on('change', loadFile);
	}


	// ADD SAVE THEME
	container.append('button')
		.html('Save Theme')
	.on('click', checkTheme)
	.on('touchend', checkTheme);

}

function rmThemeEditor () {
	d3.select('.dim-bg').remove();
	d3.select('.theme-editor-container').remove();
	return null;
}

function loadFile(d) {
  // The button where the user chooses the local image to display
  var file = d3.select(this).node().files[0];
  //document.querySelector('input[type=file]').files[0];
  // FileReader instance
  var reader  = new FileReader();
  
  // When the image is loaded we will set it as source of
  // our img tag
  reader.onloadend = function (thefile) {
    //console.log(this)
    var image = new Image();
        image.src = thefile.target.result;

    image.onload = function() {
        // access image size here 
        var w = this.width,
            h = this.height;


        // SAVE CHANGES
        sessionStorage.setItem('temp-' + d.type + '-img', this.src);
    }
  }
  
  if (file) {
    // Load image as a base64 encoded URI
    reader.readAsDataURL(file);
  } else {
    //var img_link = sessionStorage.getItem(placeholder + '-img');
  }
}

function checkTheme () {

	var themename = d3.select('#new-theme-name').node().value;
	if (!themename) {
		return alert('Please add a name for the new theme.');
	} else {
		var stdthemename = themename.replace(/[^\w\s]/gi, '').replace(/\s/g, '').toLowerCase();
		sessionStorage.setItem(stdthemename + '-name', themename);	
	}

	var exercise = d3.selectAll('input[name=exercise-type]:checked');
	if (!exercise[0][0]) {
		return alert('Please select a type of exercise.');
	} else {
		var exercise_type = exercise[0][0].value;
		sessionStorage.setItem(stdthemename + '-bg-img', exercise_type);
	}

	var themebg = sessionStorage.getItem('temp-bg-img');
	if (!themebg) {
		return alert('Please add a background-image for the new theme.');
	} else {
		sessionStorage.setItem(stdthemename + '-bg-img', themebg);
		sessionStorage.removeItem('temp-bg-img');
	}

	var themeicons = new Array();
	for (var i=1; i<8; i++) {
		var themeicon = sessionStorage.getItem('temp-icon-' + i + '-img');
		if (themeicon) {
			sessionStorage.setItem(stdthemename + '-icon-' + i + '-img', themeicon);
			sessionStorage.removeItem('temp-icon-' + i + '-img');
			themeicons.push(themeicon);
		}
	}

	// GET THE INDEX
	Object.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};

	var idx = Object.size(materials) + 1;

	// LOAD THE VARIABLES
	names[stdthemename] = themeicons;
	materials['material' + idx] = [exercise_type, stdthemename, themebg];
	var color_array  = ["#000", "#000", "#000", "#000", "#000", "#000", "#000", "#f0f", "#000"];
	colors[stdthemename] = color_array;
	fonts['material' + idx] = ["caprica", 24, 50];

	if (debug) {
		console.log(idx);
		console.log(names);
		console.log(materials);
	}

	var display_container = d3.select('#intro > div:first-child');
	
	console.log(idx%2)

	if (idx % 2 !== 0) {
		display_container.append('br');
	}

	var display_button = display_container.append('label')
		.html(function () {
			if (exercise_type === 'animation') {
				return '<input type="radio" class="load-content" onClick="updateSelections(\'material' + idx + '\')" name="material" value="material' + idx + '" />' +
				'<img src="images/custom_animation.png" height="70" border="5">' +
				'&nbsp;&nbsp;';
			} else if (exercise_type === 'coordination') {
				return '<input type="radio" class="load-content" onClick="updateSelections(\'material' + idx + '\')" name="material" value="material' + idx + '" />' +
				'<img src="images/custom_coordination.png" height="70" border="5">' +
				'&nbsp;&nbsp;';	
			}
		});


	return rmThemeEditor();
}