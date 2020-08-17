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
	// TODO: finish for all added points
	constructor(leg_left_x, leg_left_y,
	leg_right_x, leg_right_y,
	hand_left_x, hand_left_y,
	hand_right_x, hand_right_y,
	sholder_x, sholder_y,
	center_x, center_y)
	{
		this.leg_left = new SkeletonJoint("left_leg", leg_left_x, leg_left_y);
		this.leg_right = new SkeletonJoint("leg_right", leg_right_x, leg_right_y);
		this.hand_right = new SkeletonJoint("hand_right", hand_right_x, hand_right_y);
		this.hand_left = new SkeletonJoint("hand_left", hand_left_x, hand_left_y);
		this.sholder = new SkeletonJoint("sholder", sholder_x, sholder_y);
		this.center = new SkeletonJoint("center", center_x, center_y);
		
		this.joints = [this.leg_left, this.leg_right, this.hand_right, this.hand_left, this.sholder, this.center]
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
		line(this.leg_left.x, this.leg_left.y, this.center.x, this.center.y);
		line(this.leg_right.x, this.leg_right.y, this.center.x, this.center.y);
		line(this.hand_left.x, this.hand_left.y, this.sholder.x, this.sholder.y);
		line(this.hand_right.x, this.hand_right.y, this.sholder.x, this.sholder.y);
		line(this.sholder.x, this.sholder.y, this.center.x, this.center.y);
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