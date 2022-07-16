class CircleParticle extends Sprite {
	LAYER = "HIGHPARTICLE";

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

	update() {
		this.x += this._vel.x;
		this.y += this._vel.y;

		this.r -= this.decay;
		if (this.r < 0) {
			this.destroy = true;
		}

		fill(this.c);
		circle(this.x - camera.x, this.y - camera.y, this.r*2, this.r*2);
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
			arr.push(new CircleParticle(
				pos,
				radius+random.integer(Math.floor(-radius/3), Math.floor(radius/3)),
				(speed ?? radius/10),
				Math.random() * TWO_PI,
				colour,
			))
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
