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

	constructor(p) {
		super();
		new super.constructor();

		this.x = p.x;
		this.y = p.y;

		this.direction = p.direction;

		this._opacity = 255;
		this._decay = 16;
	}

	update() {
		let xp = this.x - camera.x;
		let yp = (this.y - camera.y);

		imageMode(CENTER);


		if (this.direction == "RIGHT") {
			image(assets.RAT_RIGHT, xp, yp);
		}

		else {
			image(assets.RAT_LEFT, xp, yp);
		}

		// this._opacity -= this._decay;
		// if (this._opacity < 0) {
		// 	this.destroy = true;
		// }
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
		this._lines.push([this.x, this.y]);
		this._lines.push([this.x, this.y-20]);
		this._lines.push([this.x, this.y-40]);

		this._orig = [];
		for (let t of this._lines) {
			this._orig.push([t[0], t[1]]);
		}

		this._lifetime = 14;
		this._halfway = false;
	}

	update() {
		this._lifetime--;
		if (this._lifetime < 1) {
			this.destroy = true
			// if (this._halfway) {
			// }

			this._halfway = true;
			this._lifetime = 7
		}

		if (this._lifetime < 8 && this._first) {
			sprites.new(new ClawMarks([this.x-50, this.y], this.a+HALF_PI, this.c, false));
		}

		for (let i=0; i<3; i++) {
			this._lines[i][0] += this._move.x;
			this._lines[i][1] += this._move.y;
		}

		for (let i=0; i<3; i++) {
			let a = this._orig[i];
			let b = this._lines[i];

			strokeWeight(7);
			stroke(this.c);
			line(a[0] - camera.x, a[1] - camera.y, b[0] - camera.x, b[1] - camera.y);
			noStroke();
		}
	}


}
