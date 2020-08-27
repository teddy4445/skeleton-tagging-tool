// canvas Z-Index
var zIndex = 300;
var imgSize = 800;

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

let skeletons = [[730.7777709960938, 599.3333282470703, 584.7777709960938,626.3333282470703, 597.7777709960938, 537.3333282470703, 568.7777709960938, 538.3333282470703, 622.7777709960938, 583.3333282470703, 595.7777709960938, 569.3333282470703, 594.7777709960938, 518.3333282470703, 687.7777709960938, 519.3333282470703, 620.7777709960938, 499.3333282470703, 682.7777709960938, 490.3333282470703, 703.7777709960938, 541.3333282470703, 633.7777709960938, 456.3333282470703],
[730.7777709960938, 599.3333282470703, 584.7777709960938,626.3333282470703, 597.7777709960938, 537.3333282470703, 568.7777709960938, 538.3333282470703, 622.7777709960938, 583.3333282470703, 595.7777709960938, 569.3333282470703, 594.7777709960938, 518.3333282470703, 687.7777709960938, 519.3333282470703, 620.7777709960938, 499.3333282470703, 682.7777709960938, 490.3333282470703, 703.7777709960938, 541.3333282470703, 633.7777709960938, 456.3333282470703],
[663, 609, 584, 626, 553, 537, 536, 526, 615, 577, 583, 571, 594, 518, 687, 520, 612, 494, 653, 491, 690, 548, 620, 466],
[663, 609, 584, 626, 553, 537, 536, 526, 615, 577, 583, 571, 594, 518, 687, 520, 612, 494, 653, 491, 690, 548, 620, 466],
[663, 609, 584, 626, 553, 537, 536, 526, 615, 577, 583, 571, 594, 518, 687, 520, 612, 494, 653, 491, 690, 548, 620, 466],
[663, 609, 584, 626, 553, 537, 536, 526, 615, 577, 583, 571, 594, 518, 687, 520, 612, 494, 653, 491, 690, 548, 620, 466],
[663, 609, 584, 626, 553, 537, 536, 526, 615, 577, 583, 571, 594, 518, 687, 520, 612, 494, 653, 491, 690, 548, 620, 466],
[663, 609, 584, 626, 553, 537, 536, 526, 615, 577, 583, 571, 594, 518, 687, 520, 612, 494, 653, 491, 690, 548, 620, 466],
[663, 609, 584, 626, 553, 537, 536, 526, 615, 577, 583, 571, 594, 518, 687, 520, 612, 494, 653, 491, 690, 548, 620, 466],
[663, 609, 584, 626, 553, 537, 536, 526, 615, 577, 583, 571, 594, 518, 687, 520, 612, 494, 653, 491, 690, 548, 620, 466],
[663, 609, 584, 626, 553, 537, 536, 526, 615, 577, 583, 571, 594, 518, 687, 520, 612, 494, 653, 491, 690, 548, 620, 466],
[663, 609, 584, 626, 553, 537, 536, 526, 615, 577, 583, 571, 594, 518, 687, 520, 612, 494, 653, 491, 690, 548, 620, 466],];
let balls = [[553, 537],
			[553, 537],
			[548, 535],
			[548, 535],
			[548, 535],
			[548, 535],
			[548, 535],
			[548, 535],
			[548, 535],
			[548, 535],
			[548, 535],
			[548, 535],];

function preload() 
{
	for (var index = 1; index <= 12; index++)
	{
		var dataIndex = index - 1;
		var img = loadImage('img/image' + index + '.jpg');
		img.resize(imgSize, imgSize);
		try
		{
			var skeleton = Skeleton.fromJsonString(skeletons[dataIndex]);	
		}
		catch (error)
		{
		
			var skeleton = new Skeleton(skeletons[dataIndex][0],
										skeletons[dataIndex][1],
										skeletons[dataIndex][2],
										skeletons[dataIndex][3],
										skeletons[dataIndex][4],
										skeletons[dataIndex][5],
										skeletons[dataIndex][6],
										skeletons[dataIndex][7],
										skeletons[dataIndex][8],
										skeletons[dataIndex][9],
										skeletons[dataIndex][10],
										skeletons[dataIndex][11],
										skeletons[dataIndex][12],
										skeletons[dataIndex][13],
										skeletons[dataIndex][14],
										skeletons[dataIndex][15],
										skeletons[dataIndex][16],
										skeletons[dataIndex][17],
										skeletons[dataIndex][18],
										skeletons[dataIndex][19],
										skeletons[dataIndex][20],
										skeletons[dataIndex][21],
										skeletons[dataIndex][22],
										skeletons[dataIndex][23]);
		}
		
		var ball = new Ball(balls[dataIndex][0], balls[dataIndex][1]);
		dataFrames.push(new imageSkeleton(img, skeleton, ball, "image" + index + ".jpg"));
	}
}

// setup all the simulation before starting 
function setup()
{
	var cnv = createCanvas(imgSize, imgSize);
	cnv.parent('game');
	// setup for simulation
	frameRate(24);
	dataFrames[countFrame].print(true);
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