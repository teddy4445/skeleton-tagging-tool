let urlAnswer = "";
let ERROR_STRING = "e";
let API_URL = "https://basket.roundu.ai/api/process";
let API_RESULT_URL = "https://basket.roundu.ai/result_url";

let sekeletons_gt = [];
let sekeletons_sample = [];

async function make_api_call()
{
	try
	{
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
		var gt_url_path = urlAnswer;
		
		// wait until answer is ready
		var flagAnswerIsFine = false;
		while(!flagAnswerIsFine)
		{		
			make_http_call(API_RESULT_URL, "get", gt_url_path);
			while (urlAnswer == "")
			{
				await sleep(100);
			}
			if (urlAnswer == ERROR_STRING)
			{
				throw "HTTP call failed";
			}
			var answer = Json.parse(urlAnswer);
			if (answer["processed"])
			{
				sekeletons_gt = downloadSkeletons(answer["skeleton_url"]);
				flagAnswerIsFine = true;
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
		var sample_url_path = urlAnswer;
		
		var flagAnswerIsFine = false;
		while(!flagAnswerIsFine)
		{		
			make_http_call(API_RESULT_URL, "get", sample_url_path);
			while (urlAnswer == "")
			{
				await sleep(100);
			}
			if (urlAnswer == ERROR_STRING)
			{
				throw "HTTP call failed";
			}
			var answer = Json.parse(urlAnswer);
			if (answer["processed"])
			{
				sekeletons_sample = downloadSkeletons(answer["skeleton_url"]);
				flagAnswerIsFine = true;
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
	}
}

async function make_http_call(url, method, value)
{
	try
	{
		httpAnswer = "";
		const xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.setRequestHeader('Content-Type', 'application/json');
		if (method == "post")
		{
			xhr.send("video=" + value);
		}
		else // method == "get"
		{
			xhr.send();
		}

		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				urlAnswer =  this.responseText;
			}
			else
			{
				urlAnswer = ERROR_STRING;
			}
		}
	}
	catch (error)
	{
		console.log("Error");
	}
}

async function downloadSkeletons()
{
	
}

function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}