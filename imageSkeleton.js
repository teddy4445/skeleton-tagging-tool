// UI CONSTS
var circle_size = 20;

class imageSkeleton
{
	constructor(img, skeleton, img_name)
	{
		this.skeleton = skeleton;
		this.img = img;
		this.img_name = img_name;
	}
	
	on_point(x, y)
	{
		return this.skeleton.on_point(x, y);
	}
	
	set_new_point(name, new_x, new_y)
	{
		return this.skeleton.set_new_point(name, new_x, new_y);
	}
	
	print()
	{
		// print image
		image(this.img, 0, 0);
		// print skeleton
		this.skeleton.print();
	}
	
	toString()
	{
		return '{"image": "' + this.img_name + '", "skeleton": ' + this.skeleton.toString() + '}';
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
		this.leg_left_x = leg_left_x;
		this.leg_left_y = leg_left_y;
		this.leg_right_x = leg_right_x;
		this.leg_right_y = leg_right_y;
		this.hand_right_x = hand_right_x;
		this.hand_right_y = hand_right_y;
		this.hand_left_x = hand_left_x;
		this.hand_right_y = hand_right_y;
		this.sholder_x = sholder_x;
		this.sholder_y = sholder_y;
		this.center_x = center_x;
		this.center_y = center_y;
	}
	
	on_point(x, y)
	{
		// TODO: finish for all points
		if (dist(this.leg_left_x, this.leg_left_y, x, y) < circle_size/2)
		{
			return "leg_left";
		}
		else if (dist(this.leg_right_x, this.leg_right_y, x, y) < circle_size/2)
		{
			return "leg_right";
		}
		else
		{
			return "";
		}
	}
	
	set_new_point(name, new_x, new_y)
	{
		// TODO: finish for all points
		if (name == "leg_left")
		{
			this.leg_left_x = new_x;
			this.leg_left_y = new_y;
		}
		else if (name == "leg_right")
		{
			this.leg_right_x = new_x;
			this.leg_right_y = new_y;
		}
	}
	
	print()
	{
		// TODO: finish for all added points
		
		// joints 
		circle(this.leg_left_x, this.leg_left_y, circle_size);
		circle(this.leg_right_x, this.leg_right_y, circle_size);
		circle(this.hand_left_x, this.hand_left_y, circle_size);
		circle(this.hand_right_x, this.hand_right_y, circle_size);
		circle(this.sholder_x, this.sholder_y, circle_size);
		circle(this.center_x, this.center_y, circle_size);
		
		// lines between them 
		stroke(255);
		line(this.leg_left_x, this.leg_left_y, this.center_x, this.center_y);
		line(this.leg_right_x, this.leg_right_y, this.center_x, this.center_y);
		line(this.hand_left_x, this.hand_left_y, this.sholder_x, this.sholder_y);
		line(this.hand_right_x, this.hand_right_y, this.sholder_x, this.sholder_y);
		line(this.sholder_x, this.sholder_y, this.center_x, this.center_y);
	}
	
	toString()
	{
		// TODO: finish for all points
		return '{"leg_left": {"x": ' + this.leg_left_x + ', "y": ' + this.leg_left_y + '}, "leg_right": {"x": ' + this.leg_right_x + ', "y": ' + this.leg_right_y + '}, "hand_right": {"x": ' + this.hand_right_x + ', "y": ' + this.hand_right_y + '},  "hand_right": {"x": ' + this.hand_left_x + ', "y": ' + this.hand_left_y + '}}';
	}
}