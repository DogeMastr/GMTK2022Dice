class Rat extends Sprite {
	LAYER = "RAT";
	c = color(155, 35, 35);

	constructor(pos, radius) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];
		this.r = radius;

		this.speed = 4;

		this.direction = "RIGHT";

		this._stuckToMouse = false;
	}

	collide(other) {
		return dist(this.x, this.y, other.x, other.y) < this.r + other.r;
	}

	update() {
		// Move towards mouse

		if (inputManager.keyDown(' ')) {
			let angle = atan2(mouseY-this.y, mouseX-this.x);

			this.direction = (angle > -HALF_PI && angle < HALF_PI) ? "RIGHT" : "LEFT";

			this.x += cos(angle)*this.speed;
			this.y += sin(angle)*this.speed;
		}


		if (inputManager.mouse.left) {
			if (!this._stuckToMouse) {

				let b = true;

				for (let s of sprites.get("RAT")) {
					if (s._stuckToMouse) {
						b = false;
						break;
					}
				}

				if (b && dist(this.x, this.y, mouseX, mouseY) < this.r) {
					this._stuckToMouse = true;
				}
			}
		} else {
			this._stuckToMouse = false;
		}

		if (this._stuckToMouse){
			this.x = mouseX;
			this.y = mouseY
		}

		for (let RAT of sprites.get("RAT")) {
			if (RAT === this) continue;

			if (RAT.collide(this)) {
				let pos = RAT.pos();
				let angle = atan2(this.y-pos[1], this.x-pos[0]);

				let d = (this.r + RAT.r) - dist(this.x, this.y, RAT.x, RAT.y);

				this.x += cos(angle) * d * 0.5;
				this.y += sin(angle) * d * 0.5;

				RAT.x += cos(angle) * d * -0.5;
				RAT.y += sin(angle) * d * -0.5;
			}
		}

		fill(this.c);

		if (this.direction == "RIGHT") {
			image(assets.RAT_RIGHT, this.x, this.y);
		}

		else {
			image(assets.RAT_LEFT, this.x, this.y);
		}

		// drawRAT(this.x, this.y, this.r);
	}

}

function drawRAT(x, y, r){
	// circle(x, y, r*2, r*2);
}

function preload() {
	assets.RAT_LEFT = loadImage("data/michaelLEFT.png")
	assets.RAT_RIGHT = loadImage("data/michaelRIGHT.png")
}


function setup() {
	imageMode(CENTER);
	createCanvas(window.innerWidth, window.innerHeight);
	sprites.setLayers(["BACKGROUND", "RAT", "FOREGROUND"]);

	for (let i=0; i<20; i++) {
		sprites.new(new Rat([400, 300], 20));
	}
}

function draw() {
	background(0, 0, 0);
	sprites.updateSprites(); // Update all sprites
}
