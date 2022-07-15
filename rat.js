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

		this.number = 0;

		this._animJump = {
			jumping: false,
			yvel: 0,
			ymod: 0,

			update: function() {
				this.yvel -= 0.5;
				this.ymod -= this.yvel;

				if (this.ymod > 0) {
					this.ymod = 0;
					this.jumping = false;
				}
			}
		}

		this.rollNumber();
	}

	rollNumber() {
		this.number = random.integer(1, 7);
		this._animJump.jumping = true;
		this._animJump.yvel = random.integer(7, 12);

	}

	collide(other) {
		return dist(this.x, this.y, other.x, other.y) < this.r + other.r;
	}

	update() {
		// Move towards mouse

		this._animJump.update();

		if (inputManager.keyDown("r")) {
			if (!this._animJump.jumping) {
				this.rollNumber();
			}
		}

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

		let yp = this.y+this._animJump.ymod;

		fill(this.c);

		if (this.direction == "RIGHT") {
			image(assets.RAT_RIGHT, this.x, yp);
			// fill(10);
			// text(this.number, this.x - this.r/2, this.y+2);
			//
			// fill(255);
			// textSize(35);
			// text(this.number, this.x - this.r/2, this.y);
			textSize(35);
			impactFont(this.number, [this.x - this.r*0.75, yp], 2, color(255), color(10));

		}

		else {
			image(assets.RAT_LEFT, this.x, yp);
			// fill(10);
			// text(this.number, this.x + this.r/3, t );
			//
			// fill(255);
			// textSize(35);
			// text(this.number, this.x + this.r/3, this.y);
			textSize(35);
			impactFont(this.number, [this.x + this.r*0.4, yp], 2, color(255), color(10));

		}
		// drawRAT(this.x, this.y, this.r);
	}
}


function impactFont (t, pos, stroke, textColour, strokeColour) {
	strokeColour = strokeColour ?? color(10);
	fill(strokeColour);

	text(t, pos[0]-stroke, pos[1]-stroke);
	text(t, pos[0]+stroke, pos[1]-stroke);
	text(t, pos[0]+stroke, pos[1]+stroke);
	text(t, pos[0]-stroke, pos[1]+stroke);

	fill(textColour);
	text(t, pos[0], pos[1]);

}
