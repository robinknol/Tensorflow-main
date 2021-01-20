/*
	23-2-2020
	klasse om punten op de 2d context van een canvas te tekenen

	eigenschappen
	* pos (positie van het middelpunt m.b.v. een Vector2d)
	* radius (grootte van de cirkel in pixels)
	* color (kleur van het punt, als String)
*/

class Point
{

	constructor(pos, radius, color, draggable, label)
	{
		this.pos = pos;
		this.radius = radius;
		this.color = color;
		this.draggable = draggable || false;

		if (draggable)
		{
			this.drag();
		}
		this.label = label || "";
	}

	get vPos()
	{
		return new Vector2d(this.pos.dx, this.pos.dy);
	}

	set vPos(vector)
	{
		this.pos.dx = vector.dx;
        this.pos.dy = vector.dy;
	}

	drag()
	{
		let mouse = {};
		let distance;
		let dragging = false;

		addEventListener('mousedown',(evt)=>
		{
			mouse.x = evt.clientX;
			mouse.y = evt.clientY;

			let dx = this.pos.dx - mouse.x;
			let dy = this.pos.dy - mouse.y;
			distance = Math.sqrt(dx*dx + dy*dy);

			if(distance < this.radius)
			{
				dragging = true;
			}
			else
			{
				dragging = false;
			}
		})


		addEventListener('mousemove', (evt)=>
		{
			if(dragging)
			{
				this.pos.dx = evt.clientX;
				this.pos.dy = evt.clientY;
			}
		})

		addEventListener('mouseup', (evt)=>
		{
			dragging = false;
		})
	}

	draw(context)
	{
		context.beginPath();
		context.lineWidth = "5";
		context.fillStyle = this.color;
		context.arc(this.pos.dx, this.pos.dy, this.radius, 0, 2 * Math.PI);
		context.font = "20px Comic Sans MS";
		context.fillText(this.label, this.pos.dx - this.radius, this.pos.dy - this.radius);
		context.closePath();
		context.stroke();
		context.fill();
	}

	Update(pos, radius, color)
	{
		this.pos = pos
		this.radius = radius;
		this.color = color;
	}
}
