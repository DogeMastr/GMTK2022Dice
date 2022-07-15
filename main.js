class ColliderCircle extends Sprite {
	LAYER = "CIRCLE";
	c = color(155, 35, 35);

	constructor(pos, radius) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];
		this.r = radius;

		this.speed = 10;
	}

	collide(other) {
		return dist(this.x, this.y, other.x, other.y) < this.r + other.r;
	}

	update() {
		for (let circle of sprites.get("CIRCLE")) {
			if (circle === this) continue;

			if (circle.collide(this)) {
				let pos = circle.pos();
				let angle = atan2(this.y-pos[1], this.x-pos[0]);

				let d = (this.r + circle.r) - dist(this.x, this.y, circle.x, circle.y);

				this.x += cos(angle) * d * 0.5;
				this.y += sin(angle) * d * 0.5;

				circle.x += cos(angle) * d * -0.5;
				circle.y += sin(angle) * d * -0.5;

			}
		}

		fill(this.c);
		circle(this.x, this.y, this.r*2, this.r*2)
	}

}



function setup() {
	createCanvas(800, 600);
	sprites.setLayers(["CIRCLE"]);
	sprites.new(new ColliderCircle([400, 300], 50));
	sprites.new(new ColliderCircle([510, 300], 50));
	sprites.new(new ColliderCircle([510, 300], 50));
	sprites.new(new ColliderCircle([510, 300], 50));
	sprites.new(new ColliderCircle([510, 300], 50));
	sprites.new(new ColliderCircle([510, 300], 50));


	// console.log(sprites._sprites["CIRCLE"][0]);
}

function draw() {
	background(0, 0, 0);
	sprites.updateSprites(); // Update all sprites
	if (mouseIsPressed == true) {
		moveCircles();
	}
}


function moveCircles() {
	for (let sprite of sprites.get("CIRCLE")) {
		let pos = sprite.pos();

		let angle = atan2(mouseY-pos[1], mouseX-pos[0]);

		sprite.x += cos(angle)*sprite.speed;
		sprite.y += sin(angle)*sprite.speed;
	}
}
