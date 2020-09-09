let urlAnswer = "";
let ERROR_STRING = "e";
let API_URL = "https://basket.roundu.ai/api/process";

let sekeletons_gt = [];
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
			await sleep(100);
		}
		if (urlAnswer == ERROR_STRING)
		{
			throw "HTTP call failed";
		}
		var gt_url_path = urlAnswer["result_url"];
		urlAnswer = "";
		
		// wait until answer is ready
		var flagAnswerIsFine = false;
		while(!flagAnswerIsFine)
		{		
			make_http_call(gt_url_path, "get");
			while (urlAnswer == "")
			{
				await sleep(100);
			}
			if (urlAnswer == ERROR_STRING)
			{
				throw "HTTP call failed";
			}
			var answer = urlAnswer;
			urlAnswer = "";
			if (answer["processed"])
			{
				await downloadSkeletons(answer["skeleton_url"], true);
			}
		}
		
		make_http_call(API_URL, "post", sample_url);
		while (urlAnswer == "")
		{
			await sleep(100);
		}
		if (urlAnswer == ERROR_STRING)
		{
			throw "HTTP call failed";
		}
		var sample_url_path = urlAnswer["result_url"];
		urlAnswer = "";
		
		var flagAnswerIsFine = false;
		while(!flagAnswerIsFine)
		{		
			make_http_call(sample_url_path, "get");
			while (urlAnswer == "")
			{
				await sleep(100);
			}
			if (urlAnswer == ERROR_STRING)
			{
				throw "HTTP call failed";
			}
			var answer = urlAnswer;
			urlAnswer = "";
			if (answer["processed"])
			{
				await downloadSkeletons(answer["skeleton_url"], false);
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
			xhr.send("video=" + value);
		}
		else // method == "get"
		{
			xhr.open(method, url);
			xhr.send();
		}

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				urlAnswer = JSON.parse(this.responseText);
			}
			else
			{
				urlAnswer = ERROR_STRING;
			}
		}
	}
	catch (error)
	{
		console.log("Error in 'make_http_call' saying: " + error);
	}
}

async function downloadSkeletons(skeleton_url, is_gt)
{
	try
	{
		make_http_call(skeleton_url, "get");
		while (urlAnswer == "")
		{
			await sleep(100);
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
	
	var answer = [];
	for (var itemIndex = 0; itemIndex < data.length; itemIndex++)
	{
		answer.push(frameSkeleton[itemIndex][1]);
	}
	
	if (is_gt)
	{
		sekeletons_gt = answer;
	}
	else
	{
		sekeletons_sample = answer;
	}
	flagAnswerIsFine = true;
}

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}