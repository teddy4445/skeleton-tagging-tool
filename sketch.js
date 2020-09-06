// canvas Z-Index
var zIndex = 300;
var imgSize = 800;


is_data_uploaded = false;

var countFrame = 0;
var dataFrames = [];
var sampleFrames = [];


var gtSkeletons = [];
var sampleSkeletonds = [];

var dragObject = "";
dragging = false;

// final compare score
let finalComapre = 0;

let sectionIndex = 0;

// --- DOM ACTIONS --- //
var nextBtn;
var prevBtn;
var saveBtn;

// handle arrows actions

function keyPressed() 
{
  if (keyCode === LEFT_ARROW) 
  {
    return next();
  } 
  else if (keyCode === RIGHT_ARROW) 
  {
	  return prev();
  }
}

function nextWindow()
{
	document.getElementById("title-" + sectionIndex).style.display = "none";
	
	sectionIndex += 1;
	countFrame = 0;
	
	document.getElementById("title-" + sectionIndex).style.display = "";
	
	if (sectionIndex == 2)
	{
		document.getElementById("next_window").style.display = "none";
		document.getElementById("compare_score").style.display = "";
		
		for (var skeletonIndex = 0; skeletonIndex < dataFrames.length; skeletonIndex++)
		{
			gtSkeletons.push(dataFrames[skeletonIndex].skeleton);
		}
		
		finalComapre = SkeletonCompare.totalCompare(gtSkeletons, sampleSkeletonds);
	}
}

// puase the simulation draw loop and manage the control buttons 
function prev()
{
	if (countFrame != 0)
	{
		countFrame--;
	}
	openCloseBtns();
	dataFrames[countFrame].print(true);
}

// start the simulation draw loop and manage the control buttons 
function next()
{
	if (dataFrames.length - 1 != countFrame)
	{
		countFrame++;
	}
	openCloseBtns();
	dataFrames[countFrame].print(true);
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
	console.log("Frame Index #" + (1 + countFrame));
}

// --- END DOM ACTIONS --- //


// ------------------- END OF GLOBAL VARS ------------------------ // 

function preloadDataToSystem() 
{
	// gt 
	for (var index = 1; index <= sekeletons_gt.length; index++)
	{
		var dataIndex = index - 1;
		var img = loadImage('img/gt/image' + index + '.jpg');
		img.resize(imgSize, imgSize);
		try
		{
			var skeleton = Skeleton.fromJsonString(sekeletons_gt[dataIndex]);	
		}
		catch (error)
		{
		
			var skeleton = new Skeleton(sekeletons_gt[dataIndex][0],
										sekeletons_gt[dataIndex][1],
										sekeletons_gt[dataIndex][2],
										sekeletons_gt[dataIndex][3],
										sekeletons_gt[dataIndex][4],
										sekeletons_gt[dataIndex][5],
										sekeletons_gt[dataIndex][6],
										sekeletons_gt[dataIndex][7],
										sekeletons_gt[dataIndex][8],
										sekeletons_gt[dataIndex][9],
										sekeletons_gt[dataIndex][10],
										sekeletons_gt[dataIndex][11],
										sekeletons_gt[dataIndex][12],
										sekeletons_gt[dataIndex][13],
										sekeletons_gt[dataIndex][14],
										sekeletons_gt[dataIndex][15],
										sekeletons_gt[dataIndex][16],
										sekeletons_gt[dataIndex][17],
										sekeletons_gt[dataIndex][18],
										sekeletons_gt[dataIndex][19],
										sekeletons_gt[dataIndex][20],
										sekeletons_gt[dataIndex][21],
										sekeletons_gt[dataIndex][22],
										sekeletons_gt[dataIndex][23]);
		}
		var ball = new Ball(0, 0);
		dataFrames.push(new imageSkeleton(img, skeleton, ball, "image" + index + ".jpg"));
	}
	
	// sample
	for (var index = 1; index <= sekeletons_sample.length; index++)
	{
		var dataIndex = index - 1;
		var img = loadImage('img/sample/image' + index + '.jpg');
		img.resize(imgSize, imgSize);
		try
		{
			var skeleton = Skeleton.fromJsonString(skeletons[dataIndex]);	
		}
		catch (error)
		{
		
			var skeleton = new Skeleton(sekeletons_sample[dataIndex][0],
										sekeletons_sample[dataIndex][1],
										sekeletons_sample[dataIndex][2],
										sekeletons_sample[dataIndex][3],
										sekeletons_sample[dataIndex][4],
										sekeletons_sample[dataIndex][5],
										sekeletons_sample[dataIndex][6],
										sekeletons_sample[dataIndex][7],
										sekeletons_sample[dataIndex][8],
										sekeletons_sample[dataIndex][9],
										sekeletons_sample[dataIndex][10],
										sekeletons_sample[dataIndex][11],
										sekeletons_sample[dataIndex][12],
										sekeletons_sample[dataIndex][13],
										sekeletons_sample[dataIndex][14],
										sekeletons_sample[dataIndex][15],
										sekeletons_sample[dataIndex][16],
										sekeletons_sample[dataIndex][17],
										sekeletons_sample[dataIndex][18],
										sekeletons_sample[dataIndex][19],
										sekeletons_sample[dataIndex][20],
										sekeletons_sample[dataIndex][21],
										sekeletons_sample[dataIndex][22],
										sekeletons_sample[dataIndex][23]);
		}
		skeleton.close_editing();
		sampleSkeletonds.push(skeleton);
		var ball = new Ball(0, 0);
		sampleFrames.push(new imageSkeleton(img, skeleton, ball, "image" + index + ".jpg"));
	}
}

// setup all the simulation before starting 
function setup()
{
	var cnv = createCanvas(1024, 1820);
	cnv.parent('game');
	// setup for simulation
	frameRate(1);
}

// loop run on the simulation
function draw() 
{
	// no data - don't spend energy on computing this function
	if (!is_data_uploaded)
	{
		return;
	}
	
	background(255);
	if (sectionIndex == 0) // gt
	{
		dataFrames[countFrame].print();
		
		textSize(22);
		fill(255);
		text("Frame " + (1 + countFrame) + " / " + dataFrames.length, 20, 30);
	
		if(dragging)
		{
			dataFrames[countFrame].set_new_point(dragObject, mouseX, mouseY);
		}
	}
	else if (sectionIndex == 1) // sample
	{
		sampleFrames[countFrame].print();
		
		textSize(22);
		fill(255);
		text("Frame " + (1 + countFrame) + " / " + sampleFrames.length, 20, 30);
	
		if(dragging)
		{
			sampleFrames[countFrame].set_new_point(dragObject, mouseX, mouseY);
		}
	}
	else // if (sectionIndex == 2) comparision
	{
		background(79, 121, 66);
		sampleFrames[countFrame].skeleton.print();
		dataFrames[countFrame].skeleton.print();
		document.getElementById("compare_score").innerHTML = "Frame score: " + SkeletonCompare.compare(dataFrames[countFrame].skeleton, sampleFrames[countFrame].skeleton);
		
		if (countFrame == sampleFrames.length - 1)
		{
			document.getElementById("compare_score").innerHTML += "<br> Final Move score is: " + finalComapre;
		}
	}
	
	
}

/*when mouse is pressed, 
check if mouse is intersecting w/ circle */
function mousePressed() {
	// no data - don't spend energy on computing this function
	if (!is_data_uploaded)
	{
		return;
	}
	
  console.log("Pressed on: x = " + mouseX + ", y = " + mouseY);
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