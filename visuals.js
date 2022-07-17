class Background extends Sprite {
	LAYER = "BACKGROUND";

	constructor(pos, img) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];

		this.w = img.width;
		this.h = img.height;

		// console.log(this.w);

		this._img = img;
	}

	spawnNew(x, y) {
		if (sprites.get("BACKGROUND").length > 10) {
			return;
		}

		console.log(`${x} : ${y}`);
		for (let bg of sprites.get("BACKGROUND")) {
			if (bg.x == x && bg.y == y) {
				return;
			}
		}

		sprites.new(new Background([x, y], this._img));

	}

	onCamera(offset) {
		let margin = camera.margin;
		offset = offset ?? [0, 0];


		if ((this.x + offset[0]) + this.w < camera.x - margin || (this.x + offset[0]) > camera.x + camera.w + margin) {
			return false;
		}

		if ((this.y + offset[1]) + this.h < camera.y - margin|| (this.y + offset[1]) > camera.y + camera.h + margin) {
			return false;
		}

		return true;
	}

	update() {
		if (!this.onCamera()) {
			this.destroy = true;
		}

		imageMode(CORNER);
		image(this._img, this.x - camera.x, this.y - camera.y);
	}
}


class DeadRat extends Sprite {
	LAYER = "DEADRAT";

	constructor(p, img) {
		super();
		new super.constructor();

		this.x = p.x;
		this.y = p.y;

		this._yvel = 0;
		this._img = img

	}

	update() {
		this._yvel += 0.5;
		this.y -= this._yvel;

		let xp = this.x - camera.x;
		let yp = (this.y - camera.y);

		imageMode(CENTER);
		image(this._img, xp, yp);

		if (this.y < camera.y-this._img.height) {
			this.kill();
		}
	}
}


class ClawMarks extends Sprite {
	LAYER = "HIGHPARTICLE";

	constructor(pos, angle, colour, first) {
		super();
		new super.constructor();

		this._first = first ?? true;

		this.x = pos[0];
		this.y = pos[1];
		this.a = angle;

		this.speed = 4;

		this.c = colour;

		this._move = {
			x: cos(this.a) * this.speed,
			y: sin(this.a) * this.speed,
		}

		this._lines = [];
		let aMove = {
			x: cos(this.a+QUARTER_PI),
			y: sin(this.a+QUARTER_PI)
		}

		for (let d=-20; d<40; d+=20) {
			this._lines.push([this.x + (aMove.x*d), this.y + (aMove.y*d)]);
		}

		this._orig = [];
		for (let t of this._lines) {
			this._orig.push([t[0], t[1]]);
		}

		this._LIFE = 10
		this._lifetime = this._LIFE;
		this._halfway = false;
	}

	update() {
		this._lifetime--;
		if (this._lifetime < 1) {
			if (this._halfway) {
				this.kill();
			}

			this._halfway = true;
			this._lifetime = this._LIFE/2;
		}

		if (this._lifetime < 8 && this._first) {
			let newPos = [
				this.x + (cos(this.a-QUARTER_PI) * 50),
				this.y + (sin(this.a-QUARTER_PI) * 50),
			];

			sprites.new(new ClawMarks(newPos, this.a+HALF_PI, this.c, false));
		}

		for (let i=0; i<3; i++) {
			if (!this._halfway) {
				this._lines[i][0] += this._move.x;
				this._lines[i][1] += this._move.y;
			}

			else {
				this._orig[i][0] += this._move.x*1.5;
				this._orig[i][1] += this._move.y*1.5;
			}
		}

		for (let i=0; i<3; i++) {
			let a = this._orig[i];
			let b = this._lines[i];

			strokeWeight(3);
			stroke(this.c);
			line(a[0] - camera.x, a[1] - camera.y, b[0] - camera.x, b[1] - camera.y);
			noStroke();
		}
	}


}
