// canvas Z-Index
var zIndex = 300;
var imgSize = 400;

var countFrame = 0;
var dataFrames = [];

var dragObject = "";
dragging = false;

// --- DOM ACTIONS --- //
var nextBtn;
var prevBtn;
var saveBtn;

// puase the simulation draw loop and manage the control buttons 
function prev()
{
	if (countFrame != 0)
	{
		countFrame--;
	}
	openCloseBtns();
}

// start the simulation draw loop and manage the control buttons 
function next()
{
	if (dataFrames.length - 1 != countFrame)
	{
		countFrame++;
	}
	openCloseBtns();
}

// start the simulation draw loop and manage the control buttons 
function saveTags()
{
	var answer = "";
	for (var i = 0; i < dataFrames.length; i++)
	{
		answer += dataFrames[i].toString() + ",";
	}
	answer = answer.substring(0, answer.length - 1);
	downloadasTextFile("gt_skeletons.json", answer);
}

function openCloseBtns()
{
	if (countFrame == 0)
	{
		// close and open buttons 
		document.getElementById("prev").disabled = true;
	}
	else
	{
		document.getElementById("prev").disabled = false;
	}
	if (countFrame == dataFrames.length - 1)
	{
		// close and open buttons 
		document.getElementById("next").disabled = true;
	}
	else
	{
		document.getElementById("next").disabled = false;
	}
	console.log(countFrame);
}

// --- END DOM ACTIONS --- //


// ------------------- END OF GLOBAL VARS ------------------------ // 

function preload() {
  img1 = loadImage('img/img1.jpg');
  img1.resize(imgSize, imgSize);
  skeleton1 = new Skeleton(300, 300, 200, 300, 300, 100, 200, 100, 250, 200, 250, 100);
  dataFrames.push(new imageSkeleton(img1, skeleton1, "img1.jpg"));
  
  img2 = loadImage('img/img2.jpg');
  img1.resize(imgSize, imgSize);
  skeleton2 = new Skeleton(300, 300, 200, 300, 300, 100, 200, 100, 250, 200, 250, 100);
  dataFrames.push(new imageSkeleton(img2, skeleton2, "img2.jpg"));
}

// setup all the simulation before starting 
function setup()
{
	var cnv = createCanvas(imgSize, imgSize);
	cnv.parent('game');
	// setup for simulation
	frameRate(24);
}

// loop run on the simulation
function draw() 
{
	dataFrames[countFrame].print();
	
	if(dragging)
	{
		dataFrames[countFrame].set_new_point(dragObject, mouseX, mouseY);
	}
}

/*when mouse is pressed, 
check if mouse is intersecting w/ circle */
function mousePressed() {
  
  dragging = true;
  dragObject = dataFrames[countFrame].on_point(mouseX, mouseY);
  
}

function mouseReleased(){
  dragging = false;
}

// download a .txt file into your computer
function downloadasTextFile(filename, text) 
{
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);	
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();	
	document.body.removeChild(element);
}