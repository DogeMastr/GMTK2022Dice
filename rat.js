class RatBase extends Sprite {
	LAYER = "RAT";

	collide(other) {
		if (this._stuckToMouse || other._stuckToMouse) {
			return false;
		}

		return dist(this.x, this.y, other.x, other.y) < this.r + other.r;
	}

	drawRat(ymod) {
		let xp = this.x - camera.x;
		let yp = (this.y - camera.y) + (ymod ?? 0);

		imageMode(CENTER);
		if (this.direction == "RIGHT") {
			image(assets.RAT_RIGHT, xp, yp);

			textSize(35);
			impactFont(this.number, [xp - this.r*0.75, yp], 2, color(255), color(10));

		}

		else {
			image(assets.RAT_LEFT, xp, yp);

			textSize(35);
			impactFont(this.number, [xp + this.r*0.4, yp], 2, color(255), color(10));

		}
	}

	collideRats(colliders, callback) {
		for (let rat of colliders) {
			if (rat === this) continue;

			// let cb = (callback != null) ? callback(this, rat) : true

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

	}
}


class Rat extends RatBase {

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

	update() {
		let giantRat = this.parent.giantRat;

		// let angle = atan2(giantRat.y-this.y, giantRat.x-this.x);
		//
		this.direction = (giantRat.move.x > 0) ? "RIGHT" : "LEFT";
		//
		// this.x += cos(angle)*this.speed;
		// this.y += sin(angle)*this.speed;

		this.x += giantRat.move.x * this.speed;
		this.y += giantRat.move.y * this.speed;

		this.collideRats(this.parent.getRats());

		this.drawRat();

		// drawRAT(this.x, this.y, this.r);
	}
}


class GiantRatThatMakesAllTheRules extends RatBase {

	constructor(pos, parent) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];
		this.r = 60;

		this.parent = parent
		this.speed = 4;
		this.direction = "RIGHT";

		this.angle = 0;
		this.changeAngle();
	}

	changeAngle(a) {
		a = (a ?? Math.random()*TWO_PI);
		this.move = {
			x: cos(a),
			y: sin(a),
		}

	}

	update() {
		this.x += this.move.x * this.speed;
		this.y += this.move.y * this.speed;

		this.direction = (this.move.x > 0) ? "RIGHT" : "LEFT";

		this.collideRats(this.parent.getRats());
		this.drawRat();
	}

	drawRat() {

		imageMode(CENTER);
		let xp = this.x - camera.x
		let yp = this.y - camera.y;

		if (this.direction == "RIGHT") {
			image(assets.GIANT_RAT_RIGHT, xp, yp);

			textSize(35);
			impactFont(this.number, [xp - this.r*0.75, yp], 2, color(255), color(10));

		}

		else {
			image(assets.GIANT_RAT_LEFT, xp, yp);

			textSize(35);
			impactFont(this.number, [xp + this.r*0.4, yp], 2, color(255), color(10));

		}
	}
}




class PlayerRat extends RatBase {

	constructor(pos, radius, parent) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];
		this.r = radius + random.integer(-5, 20);

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

	update() {
		// Move towards mouse

		this._animJump.update();

		if (inputManager.keyTapped("r")) {
			if (!this._animJump.jumping) {
				this.rollNumber();
			}
		}

		if (inputManager.keyDown(' ')) {
			let angle = atan2(inputManager.mouse.y()-this.y, inputManager.mouse.x()-this.x);

			this.direction = (angle > -HALF_PI && angle < HALF_PI) ? "RIGHT" : "LEFT";

			this.x += cos(angle)*this.speed;
			this.y += sin(angle)*this.speed;
		}


		if (inputManager.mouse.left) {
			if (!this._stuckToMouse) {

				let b = true;

				// for (let s of this.parent.getRats()) {
					// if (s._stuckToMouse) {
					// 	b = false;
					// 	break;
					// }
				// }

				if (b && dist(this.x, this.y, inputManager.mouse.x(), inputManager.mouse.y()) < this.r) {
					this._stuckToMouse = true;
				}
			}
		} else {
			if (this._stuckToMouse) {
				this.x += random.integer(-3, 3);
				this.y += random.integer(-3, 3);
			}

			this._stuckToMouse = false;
		}

		if (this._stuckToMouse){
			this.x = inputManager.mouse.x();
			this.y = inputManager.mouse.y()
		}

		this.collideRats(this.parent.getRats(), function(thisRat, rat) {
			return !rat._stuckToMouse || !thisRat._stuckToMouse;
		});

		this.drawRat(this._animJump.ymod);
	}
}



class RatParent extends Sprite {
	LAYER = "RAT";

	constructor(number, pos, genome, identifier) {
		super();
		new super.constructor();

		if (identifier != -1) {
			this.giantRat = new GiantRatThatMakesAllTheRules(pos, this);
		}



		this._rats = [];
		if (identifier != -1) {
			this._rats.push(this.giantRat);
		}

		for (let i=0; i<number; i++) {
			let p = [
				pos[0] + number*random.integer(-10, 10),
				pos[1] + number*random.integer(-10, 10)
			]

			let newRat = (identifier === -1) ? new PlayerRat(p, 35, this) : new Rat(p, 35, this);
			console.log(newRat);

			if (newRat === null) {
				console.log(identifier);
			}

			this._rats.push(newRat);

		}

		this.identifier = identifier;
		this._genome = genome;
	}

	update() {
		if (this.identifier != -1) {
			if (Math.abs(this.giantRat.x - camera.x) > window.innerWidth*2 || Math.abs(this.giantRat.y - camera.y) > window.innerHeight*2) {
				return;
			}
		}

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
