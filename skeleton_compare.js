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
		var sumDistances = SkeletonCompare.sunError(skeleton1, skeleton2);
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
			var thisScore = SkeletonCompare.compare(list_skeleton1[i], skeleton2);
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
		var center1 = skeleton1.ceneter;
		var sholder_center1 = skeleton1.sholder_center;
		var center2 = skeleton2.ceneter;
		var sholder_center2 = skeleton2.sholder_center;
		
		// find the move factor
		var move_x = center1.x - center2.x;
		var move_y = center1.y - center2.y;
		
		// find strach factor
		var dist1 = SkeletonCompare.distance(center1, sholder_center1);
		var dist2 = SkeletonCompare.distance(center2, sholder_center2);
		var strachFactor = dist1 / dist2;
		
		// find rotate factor
		var vect1 = new SkeletonJoint(sholder_center1.x - ceneter1.x, sholder_center1.y - ceneter1.y);
		var vect2 = new SkeletonJoint(sholder_center2.x - ceneter2.x, sholder_center2.y - ceneter2.y); 
		var vect_m1 = vect1.y / vect1.x;
		var vect_m2 = vect2.y / vect2.x;
		var rotateAngleFactor = 180 / 3.14159 * (math.atan(vect_m1) - math.atan(vect_m2));
		
		// make tranform //
		// move + strach all dots
		for (var jointIndex = 0; jointIndex < skeleton2.joints.length; jointIndex++)
		{
			skeleton2.joints[jointIndex] = new SkeletonJoint(strachFactor * (skeleton2.joints[jointIndex].x + move_x), strachFactor * (skeleton2.joints[jointIndex].y + move_y));
		}
		// rotate
		for (var jointIndex = 0; jointIndex < skeleton2.joints.length; jointIndex++)
		{
			skeleton2.joints[jointIndex] = SkeletonCompare.rotateDot(skeleton2.joints[jointIndex], rotateAngleFactor);
		}
		
		return skeleton2;
	}
	
	static sunError(skeleton1, skeleton2)
	{
		var ansewr = 0;
		for (var jointIndex = 0; jointIndex < skeleton1.joints.length; jointIndex++)
		{
			answer += SkeletonCompare.distance(skeleton1.joints[jointIndex], skeleton2.joints[jointIndex]);
		}
		return answer;
	}
	
	static distance(dot1, dot2)
	{
		return math.sqrt(math.pow(dot1.x - dot2.x, 2) + math.pow(dot1.x - dot2.x, 2));
	}
	
	static rotateDot(dot, angle)
	{
		return new SkeletonJoint(math.cos(angle) * dot.x - math.sin(angle) * dot.y, math.sin(angle) * dot.x + math.cos(angle) * dot.y);
	}
	
	/* end - help functions */
	
}