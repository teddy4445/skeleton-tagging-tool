// UI CONSTS
var DISTANCE_TO_SCORE_FACTOR = 100;
var WINDOW_SIZE = 2;

class SkeletonCompare
{
	constructor()
	{
	}
	
	/* main functions */
	
	static totalCompare(list_skeleton1, list_skeleton2)
	{
		var answer = 0;
		for (var i = 0; i < list_skeleton1.length; i++)
		{
			answer += SkeletonCompare.compare(list_skeleton1[i], list_skeleton2[i]);
		}
		return answer / list_skeleton1.length;
	}
	
	static compare(skeleton1, skeleton2)
	{
		skeleton2 = SkeletonCompare.fitSkeletons(skeleton1, skeleton2);
		var sumDistances = SkeletonCompare.sumError(skeleton1, skeleton2);
		return max((100 - sumDistances / DISTANCE_TO_SCORE_FACTOR), 0);
	}
	
	/* end - main functions */
	
	/* same logic but with moving window */
	
	static totalWindowCompare(list_skeleton1, list_skeleton2)
	{
		var answer = 0;
		for (var i = 0; i < list_skeleton1.length; i++)
		{
			answer += SkeletonCompare.windowCompare(list_skeleton1, list_skeleton2[i], i);
		}
		return answer / list_skeleton1.length;
	}
	
	static windowCompare(list_skeleton1, skeleton2, index)
	{
		var bestScore = 0;
		for (var i = max(0, index - WINDOW_SIZE); i <= min(list_skeleton1.length, index + WINDOW_SIZE); i++)
		{
			let thisScore = SkeletonCompare.compare(list_skeleton1[i], skeleton2);
			if (thisScore > bestScore)
			{
				bestScore = thisScore;
			}
		}
		return bestScore;
	}
	
	/* help functions */
	
	
	// return the second skeleton on top of the first one using 2 points (ceneter and center sholders)
	// doing move, strach and rotate
	static fitSkeletons(skeleton1, skeleton2)
	{
		// factors to find:
		// 1. move
		// 2. strach
		// 3. rotate
		
		// pull the 2 dots from each we need
		let center1 = skeleton1.center;
		let sholder_center1 = skeleton1.sholder_center;
		let center2 = skeleton2.center;
		let sholder_center2 = skeleton2.sholder_center;
		
		// find the move factor
		let move_x = center1.x - center2.x;
		let move_y = center1.y - center2.y;
		
		// find strach factor
		let dist1 = SkeletonCompare.distance(center1, sholder_center1);
		let dist2 = SkeletonCompare.distance(center2, sholder_center2);
		let strachFactor = dist1 / dist2;
		
		// find rotate factor
		let vect1 = new SkeletonJoint("", sholder_center1.x - center1.x, sholder_center1.y - center1.y);
		let vect2 = new SkeletonJoint("", sholder_center2.x - center2.x, sholder_center2.y - center2.y); 
		let vect_m1 = vect1.y / vect1.x;
		let vect_m2 = vect2.y / vect2.x;
		let rotateAngleFactor = 180 / 3.14159 * (Math.atan(vect_m1) - Math.atan(vect_m2));
		
		// make tranform //
		// move + strach all dots
		for (var jointIndex = 0; jointIndex < skeleton2.joints.length; jointIndex++)
		{
			skeleton2.joints[jointIndex] = new SkeletonJoint(skeleton2.joints[jointIndex].name, strachFactor * (skeleton2.joints[jointIndex].x + move_x), strachFactor * (skeleton2.joints[jointIndex].y + move_y));
		}
		// rotate
		for (var jointIndex = 0; jointIndex < skeleton2.joints.length; jointIndex++)
		{
			skeleton2.joints[jointIndex] = SkeletonCompare.rotateDot(skeleton2.joints[jointIndex], rotateAngleFactor);
		}
		
		return skeleton2;
	}
	
	static sumError(skeleton1, skeleton2)
	{
		let answer = 0;
		for (var jointIndex = 0; jointIndex < skeleton1.joints.length; jointIndex++)
		{
			answer += SkeletonCompare.distance(skeleton1.joints[jointIndex], skeleton2.joints[jointIndex]);
		}
		return answer;
	}
	
	static distance(dot1, dot2)
	{
		return Math.sqrt(Math.pow(dot1.x - dot2.x, 2) + Math.pow(dot1.y - dot2.y, 2));
	}
	
	static rotateDot(dot, angle)
	{
		return new SkeletonJoint(dot.name, Math.cos(angle) * dot.x - Math.sin(angle) * dot.y, Math.sin(angle) * dot.x + Math.cos(angle) * dot.y);
	}
	
	/* end - help functions */
	
}