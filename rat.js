class RatBase extends Sprite {
	LAYER = "RAT";

	RAT_SIZE = 35;
	c = color(155, 35, 35);

	constructor(pos, radius, parent) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];
		this.r = radius;

		this.parent = parent
		this.speed = 4;
		this.direction = "RIGHT";
		this.number = random.integer(1, 7);
	}

	collide(other) {
		return dist(this.x, this.y, other.x, other.y) < this.r + other.r;
	}

	update() {
		let giantRat = this.parent.giantRat;

		let angle = atan2(giantRat.y-this.y, giantRat.x-this.x);

		this.direction = (angle > -HALF_PI && angle < HALF_PI) ? "RIGHT" : "LEFT";

		this.x += cos(angle)*this.speed;
		this.y += sin(angle)*this.speed;

		for (let rat of this.parent.getRats()) {
			if (rat === this) continue;

			if (rat.collide(this)) {
				let pos = rat.pos();
				let angle = atan2(this.y-pos[1], this.x-pos[0]);

				let d = (this.r + rat.r) - dist(this.x, this.y, rat.x, rat.y);

				this.x += cos(angle) * d * 0.5;
				this.y += sin(angle) * d * 0.5;

				rat.x += cos(angle) * d * -0.5;
				rat.y += sin(angle) * d * -0.5;
			}
		}

		this.drawRat();

		// drawRAT(this.x, this.y, this.r);
	}

	drawRat() {
		let yp = this.y;

		if (this.direction == "RIGHT") {
			image(assets.RAT_RIGHT, this.x, yp);

			textSize(35);
			impactFont(this.number, [this.x - this.r*0.75, yp], 2, color(255), color(10));

		}

		else {
			image(assets.RAT_LEFT, this.x, yp);

			textSize(35);
			impactFont(this.number, [this.x + this.r*0.4, yp], 2, color(255), color(10));

		}
	}
}


class GiantRatThatMakesAllTheRules extends Sprite {
	LAYER = "RAT";

	RAT_SIZE = 60;

	constructor(pos, parent) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];
		this.r = this.RAT_SIZE;

		this.parent = parent
		this.speed = 4;
		this.direction = "RIGHT";
	}

	collide(other) {
		return dist(this.x, this.y, other.x, other.y) < this.r + other.r;
	}


	update() {
		for (let rat of this.parent.getRats()) {
			if (rat === this) continue;

			if (rat.collide(this)) {
				let pos = rat.pos();
				let angle = atan2(this.y-pos[1], this.x-pos[0]);

				let d = (this.r + rat.r) - dist(this.x, this.y, rat.x, rat.y);

				this.x += cos(angle) * d * 0.5;
				this.y += sin(angle) * d * 0.5;

				rat.x += cos(angle) * d * -0.5;
				rat.y += sin(angle) * d * -0.5;
			}
		}

		this.drawRat();
	}

	drawRat() {
		let yp = this.y;

		if (this.direction == "RIGHT") {
			image(assets.GIANT_RAT_RIGHT, this.x, yp);

			textSize(35);
			impactFont(this.number, [this.x - this.r*0.75, yp], 2, color(255), color(10));

		}

		else {
			image(assets.GIANT_RAT_LEFT, this.x, yp);

			textSize(35);
			impactFont(this.number, [this.x + this.r*0.4, yp], 2, color(255), color(10));

		}
	}

}




class PlayerRat extends Sprite {
	LAYER = "RAT";

	RAT_SIZE = 35;
	c = color(155, 35, 35);

	constructor(pos, radius, parent) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];
		this.r = radius;

		this._stuckToMouse = false;

		this.parent = parent
		this.speed = 4;
		this.direction = "RIGHT";
		this.number = random.integer(1, 7);

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

		if (inputManager.keyTapped("r")) {
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

				for (let s of this.parent.getRats()) {
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

		for (let rat of this.parent.getRats()) {
			if (rat === this) continue;

			if (this.collide(rat)) {
				let pos = rat.pos();
				let angle = atan2(this.y-pos[1], this.x-pos[0]);


				let d = (this.r + rat.r) - dist(this.x, this.y, rat.x, rat.y);

				this.x += cos(angle) * d * 0.5;
				this.y += sin(angle) * d * 0.5;

				rat.x += cos(angle) * d * -0.5;
				rat.y += sin(angle) * d * -0.5;
			}
		}

		let yp = this.y+this._animJump.ymod;

		if (this.direction == "RIGHT") {
			image(assets.RAT_RIGHT, this.x, yp);
			textSize(35);
			impactFont(this.number, [this.x - this.r*0.75, yp], 2, color(255), color(10));

		}

		else {
			image(assets.RAT_LEFT, this.x, yp);
			textSize(35);
			impactFont(this.number, [this.x + this.r*0.4, yp], 2, color(255), color(10));

		}
	}
}



class RatParent extends Sprite {
	LAYER = "RAT";

	constructor(number, pos, genome, identifier) {
		super();
		new super.constructor();

		this._rats = [];
		for (let i=0; i<number; i++) {
			if (identifier === -1) {
				let newRat = new PlayerRat(pos, 35, this);
				this._rats.push(newRat);
			} else {
				this._rats.push(new RatBase(pos, 35, this));

			}
		}

		if (identifier != -1) {
			this.giantRat = new GiantRatThatMakesAllTheRules(pos, this);
			this._rats.push(this.giantRat);
		}
	}

	update() {
		for (let i=this._rats.length-1; i>-1; i--) {
			let rat = this._rats[i];
			rat.update();
			if (rat.destroy) {
				this._rats.splice(i, 1);
			}
		}
	}

	getRats() {
		return this._rats;
	}
}
