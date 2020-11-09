let urlAnswer = "";
let ERROR_STRING = "e";
let API_URL = "https://basket.roundu.ai/api/process";

let images_gt = [];
let sekeletons_gt = [];
let images_sample = [];
let sekeletons_sample = [];

async function make_api_call()
{
	try
	{
		document.getElementById("start_btn").style.display = "none";
		
		// get needed data 
		var gt_url = document.getElementById("gt").value;
		var sample_url = document.getElementById("sample").value;
		
		// make calls 
		make_http_call(API_URL, "post", gt_url);
		while (urlAnswer == "")
		{
			await sleep(250);
		}
		if (urlAnswer == ERROR_STRING)
		{
			console.log("Error in '" + API_URL + '" post request');
			throw "HTTP call failed";
		}
		var gt_url_path = urlAnswer["result_url"];
		urlAnswer = "";
		console.log("Get GT link result");
		
		// wait until answer is ready
		var flagAnswerIsFine = false;
		while(!flagAnswerIsFine)
		{		
			make_http_call(gt_url_path, "post");
			while (urlAnswer == "")
			{
				await sleep(250);
			}
			if (urlAnswer == ERROR_STRING)
			{
				console.log("Error in '" + API_URL + '" post request');
				throw "HTTP call failed";
			}
			var answer = urlAnswer;
			urlAnswer = "";
			if (answer["processed"])
			{
				console.log("Got GT skeleton result");
				await downloadSkeletons(answer["skeleton_url"], answer["frames_url"], true);
				flagAnswerIsFine = true;
			}
			else
			{
				console.log("Get GT skeleton result waiting....");
			}
		}
		
		make_http_call(API_URL, "post", sample_url);
		while (urlAnswer == "")
		{
			await sleep(250);
		}
		if (urlAnswer == ERROR_STRING)
		{
			throw "HTTP call failed";
		}
		var sample_url_path = urlAnswer["result_url"];
		urlAnswer = "";
		console.log("Get SAMPLE link result");
		
		var flagAnswerIsFine = false;
		while(!flagAnswerIsFine)
		{		
			make_http_call(sample_url_path, "post");
			while (urlAnswer == "")
			{
				await sleep(250);
			}
			if (urlAnswer == ERROR_STRING)
			{
				throw "HTTP call failed";
			}
			var answer = urlAnswer;
			urlAnswer = "";
			if (answer["processed"])
			{
				console.log("Got SAMPLE skeleton result");
				await downloadSkeletons(answer["skeleton_url"], answer["frames_url"], false);
				flagAnswerIsFine = true;
			}
			else
			{
				console.log("Get SAMPLE skeleton result waiting....");
			}
		}
		
		// put data in the system
		preloadDataToSystem();
		is_data_uploaded = true;
		frameRate(24);
		
		// update GUI
		document.getElementById("main").style.display = "";
		document.getElementById("start").style.display = "none";
	}
	catch (error)
	{
		alert("Error in your request, saying: " + error);
		document.getElementById("start_btn").style.display = "";
	}
}

async function make_http_call(url, method, value = "")
{
	try
	{
		httpAnswer = "";
		const xhr = new XMLHttpRequest();
		if (method == "post")
		{
			xhr.open(method, url, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send("video=" + value + "&save_frames=1&workout_type=crossover");
		}
		else // method == "get"
		{
			xhr.open("GET", url, true);
			xhr.send(null);
		}

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				console.log("Get good response");
				urlAnswer = JSON.parse(this.responseText);
			}
			else
			{
				console.log("Get bad response");
				urlAnswer = ERROR_STRING;
			}
		}
	}
	catch (error)
	{
		urlAnswer = "";
		console.log("Error in 'make_http_call' saying: " + error);
	}
}

async function downloadSkeletons(skeleton_url, frames_url, is_gt)
{
	try
	{
		await sleep(250);
		console.log("Download Skeleton from link: " + skeleton_url);
		make_http_call(skeleton_url, "get");
		while (urlAnswer == "")
		{
			await sleep(500);
		}
		if (urlAnswer == ERROR_STRING)
		{
			throw "HTTP call failed";
		}
		var data = urlAnswer;
		urlAnswer = "";
	}
	catch (error)
	{
		console.log("Error in 'downloadSkeletons' saying: " + error);
		urlAnswer = "";
		throw error;
	}
	
	try
	{
		await sleep(250);
		console.log("Download Frames from link: " + frames_url);
		make_http_call(frames_url, "get");
		while (urlAnswer == "")
		{
			await sleep(500);
		}
		if (urlAnswer == ERROR_STRING)
		{
			throw "HTTP call failed";
		}
		var data_frames = urlAnswer;
		urlAnswer = "";
	}
	catch (error)
	{
		console.log("Error in 'downloadSkeletons' saying: " + error);
		urlAnswer = "";
		throw error;
	}
	
	var frameSkeleton = [];
	for (var itemIndex = 0; itemIndex < data.length; itemIndex++)
	{
		frameSkeleton.push([data[itemIndex]["frame"], data[itemIndex]["people"][0]["pose_keypoints_2d"]]);
	}
	frameSkeleton.sort(function(a, b)
	{ 
		return parseInt(a[0]) - parseInt(b[0]);
	});
	
	
	var frameImg = [];
	for (var itemIndex = 0; itemIndex < data_frames.length; itemIndex++)
	{
		frameImg.push([data_frames[itemIndex]["frame"], data_frames[itemIndex]["img"]]);
	}
	frameImg.sort(function(a, b)
	{ 
		return parseInt(a[0]) - parseInt(b[0]);
	});
	
	var answer = [];
	var answer_frames = [];
	for (var itemIndex = 0; itemIndex < Math.min(frameSkeleton.length, frameImg.length); itemIndex++)
	{
		var values_arr = frameSkeleton[itemIndex][1];
		answer.push([values_arr[14*3+0], values_arr[14*3+1], 
					values_arr[11*3+0], values_arr[11*3+1], 
					values_arr[7*3+0], values_arr[7*3+1],
					values_arr[4*3+0], values_arr[4*3+1],
					values_arr[13*3+0], values_arr[13*3+1],
					values_arr[10*3+0], values_arr[10*3+1],
					values_arr[6*3+0], values_arr[6*3+1],
					values_arr[3*3+0], values_arr[3*3+1],
					values_arr[5*3+0], values_arr[5*3+1],
					values_arr[2*3+0], values_arr[2*3+1],
					values_arr[8*3+0], values_arr[8*3+1],
					values_arr[0*3+0], values_arr[0*3+1]]);
		answer_frames.push(frameImg[itemIndex][1]);
	}
	
	if (is_gt)
	{
		sekeletons_gt = answer;
		images_gt = answer_frames;
	}
	else
	{
		sekeletons_sample = answer;
		images_sample = answer_frames;
	}
}

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}