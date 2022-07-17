class CircleParticle extends Sprite {
	LAYER = "HIGHPARTICLE";
	SQUARE = false;

	constructor(pos, radius, speed, angle, colour, decay) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];
		this.r = radius;

		this.speed = speed;
		this.angle = angle;

		this._vel = {
			x: cos(angle)*this.speed,
			y: sin(angle)*this.speed
		};

		this.c = colour;
		this.decay = decay ?? 0.5;
	}

	updateMove() {
		this.x += this._vel.x;
		this.y += this._vel.y;

		this.r -= this.decay;
		if (this.r < 0) {
			this.destroy = true;
		}
	}

	update() {
		this.updateMove();

		fill(this.c);

		if (this.SQUARE) {
			rectMode(CENTER);
			rect(this.x - camera.x, this.y - camera.y, this.r, this.r);
			rectMode(CORNER);
		}

		else {
			circle(this.x - camera.x, this.y - camera.y, this.r*2, this.r*2);
		}
	}
}


class TextParticle extends Sprite {
	LAYER = "HIGHPARTICLE";

	constructor(pos, text, textSize, colour, lifetime) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];

		this._text = text;
		this._textSize = textSize;
		this.c = colour;

		this._lifetime = (lifetime ?? 30);
	}

	update() {
		this.y -= this._textSize/10;
		this._lifetime--;
		if (this._lifetime < 0) {
			this.kill();
		}

		textSize(this._textSize);
		textAlign(CENTER);
		impactFont(this._text, [this.x-camera.x, this.y-camera.y], this._textSize/15, this.c, 10);
		textAlign(CORNER);
	}

}


class ParticleParent extends Sprite {
	LAYER = "HIGHPARTICLE";

	constructor(pos, callback) {
		super();
		new super.constructor();

		this.particles = callback();
	}

	update() {
		for (let i=this.particles.length-1; i>-1; i--) {
			this.particles[i].update()
			if (this.particles[i].destroy) {
				this.particles.splice(i, 1);
			}
		}

		if (this.particles.length < 1) {
			this.destroy = true;
		}

	}
}


function particleExplosion(number, pos, radius, colour, speed) {
	return new ParticleParent(pos, function() {
		let arr = [];
		for (let i=0; i<number; i++) {
			let part = new CircleParticle(
				pos,
				radius+random.integer(Math.floor(-radius/3), Math.floor(radius/3)),
				(speed ?? radius/10),
				Math.random() * TWO_PI,
				colour,
			);
			part.SQUARE = true;
			arr.push(part);

		}
		return arr;
	});
}


function riseParticles(number, range, radius, colour) {
	return new ParticleParent(range[0], function() {
		let arr = [];
		for (let i=0; i<number; i++) {
			arr.push(new CircleParticle(
				[random.integer(range[0][0], range[1][0]), random.integer(range[0][1], range[1][1])],
				(speed ?? radius)+random.integer(Math.floor(-radius/3), Math.floor(radius/3)),
				radius/10,
				-HALF_PI,
				colour,
			))
		}
		return arr;
	});
}
