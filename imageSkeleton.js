// UI CONSTS
var circle_size = 20;

class imageSkeleton
{
	constructor(img, skeleton, ball, img_name)
	{
		this.skeleton = skeleton;
		this.img = img;
		this.img_name = img_name;
		this.ball = ball;
	}
	
	on_point(x, y)
	{
		return this.skeleton.on_point(x, y);
	}
	
	set_new_point(name, new_x, new_y)
	{
		return this.skeleton.set_new_point(name, new_x, new_y);
	}
	
	print(is_frist = false)
	{
		// print image
		if (is_frist)
		{
			clear();
			background(255);
		}
		image(this.img, 0, 0);
		// print skeleton
		this.skeleton.print();
		this.ball.print();
	}
	
	toString()
	{
		return '{"image": "' + this.img_name + '", "skeleton": ' + this.skeleton.toString() + '", "ball": ' + this.ball.toString()  + '}';
	}
}

class Skeleton
{
	constructor(leg_left_x, leg_left_y,
		leg_right_x, leg_right_y,
		hand_right_x, hand_right_y,
		hand_left_x, hand_left_y,
		leg_left_knee_x, leg_left_knee_y,
		leg_right_knee_x, leg_right_knee_y,
		hand_left_knee_x, hand_left_knee_y,
		hand_right_knee_x, hand_right_knee_y,
		sholder_left_x, sholder_left_y,
		sholder_right_x, sholder_right_y,
		center_x, center_y,
		head_x, head_y)
	{
		this.leg_left = new SkeletonJoint("left_leg", leg_left_x, leg_left_y);
		this.leg_right = new SkeletonJoint("leg_right", leg_right_x, leg_right_y);
		this.hand_right = new SkeletonJoint("hand_right", hand_right_x, hand_right_y);
		this.hand_left = new SkeletonJoint("hand_left", hand_left_x, hand_left_y);
		
		this.leg_left_knee = new SkeletonJoint("leg_left_knee", leg_left_knee_x, leg_left_knee_y);
		this.leg_right_knee = new SkeletonJoint("leg_right_knee", leg_right_knee_x, leg_right_knee_y);
		this.hand_left_knee = new SkeletonJoint("hand_left_knee", hand_left_knee_x, hand_left_knee_y);
		this.hand_right_knee = new SkeletonJoint("hand_right_knee", hand_right_knee_x, hand_right_knee_y);
		
		this.sholder_left = new SkeletonJoint("sholder_left", sholder_left_x, sholder_left_y);
		this.sholder_right = new SkeletonJoint("sholder_right", sholder_right_x, sholder_right_y);
		this.sholder_center = new SkeletonJoint("sholder_center", (sholder_right_x + sholder_left_x)/2, (sholder_left_y + sholder_right_y) / 2);
		
		this.center = new SkeletonJoint("center", center_x, center_y);
		this.head = new SkeletonJoint("head", head_x, head_y);
		
		this.joints = [this.leg_left, 
			this.leg_right, 
			this.hand_right, 
			this.hand_left, 
			this.leg_left_knee,
			this.leg_right_knee,
			this.hand_left_knee,
			this.hand_right_knee,
			this.sholder_left, 
			this.sholder_right, 
			this.center, 
			this.head,
		]
	}
	
	toConstractorValues()
	{
		return [this.leg_left.x, this.leg_left.y, 
				this.leg_right.x, this.leg_right.y,
				this.hand_right.x, this.hand_right.y,
				this.hand_left.x, this.hand_left.y,
				this.leg_left_knee.x, this.leg_left_knee.y,
				this.leg_right_knee.x, this.leg_right_knee.y,
				this.hand_left_knee.x, this.hand_left_knee.y,
				this.hand_right_knee.x, this.hand_right_knee.y,
				this.sholder_left.x, this.sholder_left.y,
				this.sholder_right.x, this.sholder_right.y,
				this.center.x, this.center.y,
				this.head.x, this.head.y];
	}
	
	static fromJsonString(jsonString)
	{
		var jsonObj = JSON.parse(jsonString);
		return new Skeleton(jsonObj["left_leg"]["x"], jsonObj["left_leg"]["y"],
							jsonObj["leg_right"]["x"], jsonObj["leg_right"]["y"],
							jsonObj["hand_right"]["x"], jsonObj["hand_right"]["y"],
							jsonObj["hand_left"]["x"], jsonObj["hand_left"]["y"],
							jsonObj["leg_left_knee"]["x"], jsonObj["leg_left_knee"]["y"],
							jsonObj["leg_right_knee"]["x"], jsonObj["leg_right_knee"]["y"],
							jsonObj["hand_left_knee"]["x"], jsonObj["hand_left_knee"]["y"],
							jsonObj["hand_right_knee"]["x"], jsonObj["hand_right_knee"]["y"],
							jsonObj["sholder_left"]["x"], jsonObj["sholder_left"]["y"],
							jsonObj["sholder_right"]["x"], jsonObj["sholder_right"]["y"],
							jsonObj["center"]["x"], jsonObj["center"]["y"],
							jsonObj["head"]["x"], jsonObj["head"]["y"]);	
	}
	
	on_point(x, y)
	{
		for (var i = 0; i < this.joints.length; i++)
		{
			if (this.joints[i].is_hit(x, y))
			{
				return this.joints[i].name;
			}
		}
		return "";
	}
	
	set_new_point(name, new_x, new_y)
	{
		this.sholder_center.x = (this.sholder_right.x + this.sholder_left.x) / 2;
		this.sholder_center.y = (this.sholder_left.y + this.sholder_right.y) / 2;
		for (var i = 0; i < this.joints.length; i++)
		{
			if (this.joints[i].name == name)
			{
				this.joints[i].update_location(new_x, new_y);
				return true;
			}
		}
		return false;
	}
	
	print()
	{	
		// joints 
		for (var i = 0; i < this.joints.length; i++)
		{
			this.joints[i].print();
		}
		
		// lines between them 
		stroke(255);
		line(this.leg_left.x, this.leg_left.y, this.leg_left_knee.x, this.leg_left_knee.y);
		line(this.leg_left_knee.x, this.leg_left_knee.y, this.center.x, this.center.y);
		
		line(this.leg_right.x, this.leg_right.y, this.leg_right_knee.x, this.leg_right_knee.y);
		line(this.leg_right_knee.x, this.leg_right_knee.y, this.center.x, this.center.y);
		
		line(this.center.x, this.center.y, this.sholder_center.x, this.sholder_center.y);
		
		line(this.sholder_left.x, this.sholder_left.y, this.sholder_center.x, this.sholder_center.y);
		line(this.sholder_right.x, this.sholder_right.y, this.sholder_center.x, this.sholder_center.y);
		
		line(this.head.x, this.head.y, this.sholder_center.x, this.sholder_center.y);
		
		line(this.hand_left.x, this.hand_left.y, this.hand_left_knee.x, this.hand_left_knee.y);
		line(this.hand_left_knee.x, this.hand_left_knee.y, this.sholder_left.x, this.sholder_left.y);
		
		line(this.hand_right.x, this.hand_right.y, this.hand_right_knee.x, this.hand_right_knee.y);
		line(this.hand_right_knee.x, this.hand_right_knee.y, this.sholder_right.x, this.sholder_right.y);
	}
	
	toString()
	{
		let answer = '{';
		
		for (var i = 0; i < this.joints.length; i++)
		{
			answer += this.joints[i].toString() + ", ";
		}
		answer = answer.substring(0, answer.length - 1) + '}';
		return answer;
	}
}

class SkeletonJoint
{
	constructor(name, x, y)
	{
		this.name = name;
		this.x = x;
		this.y = y;
	}
	
	update_location(new_x, new_y)
	{
		this.x = new_x;
		this.y = new_y;
	}
	
	print()
	{
		ellipse(this.x, this.y, circle_size, circle_size);
	}
	
	is_hit(x, y)
	{
		return dist(this.x, this.y, x, y) < circle_size/2;
	}
	
	toString()
	{
		// TODO: finish for all points
		return '"' + this.name + '": {"x": ' + this.x + ', "y": ' + this.y + '}';
	}
}

let BALL_CIRCLE_SCALE = 1.25;

class Ball
{
	constructor(x, y)
	{
		this.name = "ball";
		this.x = x;
		this.y = y;
	}
	
	update_location(new_x, new_y)
	{
		this.x = new_x;
		this.y = new_y;
	}
	
	print()
	{
		fill(253, 88, 0);
		ellipse(this.x, this.y, circle_size * BALL_CIRCLE_SCALE, circle_size * BALL_CIRCLE_SCALE);
		fill(255);
	}
	
	is_hit(x, y)
	{
		return dist(this.x, this.y, x, y) < circle_size/2;
	}
	
	toString()
	{
		// TODO: finish for all points
		return '{"x": ' + this.x + ', "y": ' + this.y + '}';
	}
}