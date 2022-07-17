class RatBase extends Sprite {
	LAYER = "RAT";

	setNumber(n) {
		this.number = n;
		return this;
	}

	changeAngle(a) {
		this.a = a;
		this._move.x = cos(a)*this.speed;
		this._move.y = sin(a)*this.speed;
	}


	collide(other) {
		if (this._stuckToMouse || other._stuckToMouse) {
			return false;
		}

		return dist(this.x, this.y, other.x, other.y) < this.r + other.r;
	}

	resolveStats() {
		this.stats = this.parent.genome.resolve(this.number);
		this.stats._cooling_down = null;

		for (let rule of this.parent.rules.conditionRules("onCalculate")) {
			rule.execute(this);
		}
	}

	attack(target) {
		if (this.stats._cooling_down != null) {
			this.stats._cooling_down = (this.stats._cooling_down > 0) ? this.stats._cooling_down-1 : null;
			return;
		}

		target.receiveAttack(this, this.stats.dmg);
		this.stats._cooling_down = this.stats.cooldown;
		sprites.new(new ClawMarks(
			target.pos(),
			this.a,
			(this.parent.identifier != -1) ? color(155, 35, 35) : color(35, 35, 155)
		));
	}

	dealDamage(dmg) {
		this.stats.hp -= dmg;
		if (this.stats.hp < 1) {
			this.death();
		}
	}

	receiveAttack(attacker, dmg) {
		if (this.parent.identifier != -1) {
			if (!this.parent.giantRat.battleStatus.underAttack) {
				this.parent.giantRat.battleStatus.ratAttacked(this, attacker);
			}
		}

		if (random.integer(0, 101) < this.stats.dodge) {
			sprites.new(new TextParticle(this.pos(), "DODGE", 15, 255));
			return; //dodged
		}

		sprites.new(new TextParticle(this.pos(), dmg, 25, color(255,0,0)));
		this.dealDamage(dmg);
	}

	death() {
		this.destroy = true;
		sprites.new(particleExplosion(20, this.pos(), 20, color(155, 35, 35)));

		const imgLeft = (this.parent.identifier === -1) ? assets.RAT_LEFT : assets.BAD_RAT_LEFT;
		const imgRight = (this.parent.identifier === -1) ? assets.RAT_RIGHT : assets.BAD_RAT_RIGHT;

		sprites.new(new DeadRat(this, (this.direction == "RIGHT") ? imgRight : imgLeft));
	}

	drawRat(ymod, imgLeft, imgRight) {
		let xp = this.x - camera.x;
		let yp = (this.y - camera.y) + (ymod ?? 0);

		imageMode(CENTER);
		if (this.direction == "RIGHT") {
			image(imgRight, xp, yp);

			textSize(35);
			impactFont(this.number, [xp - this._visualR, yp + this._visualR], 2, color(255), color(10));
		}

		else {
			image(imgLeft, xp, yp);

			textSize(35);
			impactFont(this.number, [xp + this._visualR*0.5, yp + this._visualR], 2, color(255), color(10));

		}
	}

	collideRats(colliders) {
		for (let ratGroup of sprites.get("RAT")) {
			if (!ratGroup.onScreenNow) {
				continue;
			}

			for (let rat of ratGroup.getRats()) {
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

					if (this._ROAMING) {
						if (ratGroup.identifier === -1) {
							this.kill()
							ratGroup.newRat(new PlayerRat(this.pos(), this.r).setNumber(this.number));
						}

						else {
							this.death();
						}
					}

					if (ratGroup.identifier != this.parent.identifier) {
						this.attack(rat);
					}
				}
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
		this.r = radius + random.integer(0, 20);
		this._visualR = radius;

		this.parent = parent
		this.speed = 3;
		this.direction = "RIGHT";
		this.number = random.integer(1, 7);
		this.resolveStats();
		this.stats.cooldown += 10;

		this.a = null;
		this._move = {
			x: 0,
			y: 0,
		}

		this.changeAngle(this.parent.giantRat.angle);
	}

	update() {
		let giantRat = this.parent.giantRat;
		if (this.a == null) {
			this.a = giantRat.a;
			this.changeAngle(this.a);
		}

		this.direction = (this._move.x > 0) ? "RIGHT" : "LEFT";

		if (this.parent.giantRat.battleStatus.underAttack) {
			const attacker = giantRat.battleStatus.attacker;
			let pos = (attacker.parent.identifier == -1) ? [camera.avgPositionX, camera.avgPositionY] : attacker.parent.giantRat.pos();
			let a = atan2(pos[1]-this.y, pos[0]-this.x)

			this.changeAngle(a);
		}

		this.x += this._move.x;
		this.y += this._move.y;

		this.collideRats();

		this.drawRat(0, assets.BAD_RAT_LEFT, assets.BAD_RAT_RIGHT);

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
		this.a = 0;

		this.parent = parent
		this.speed = 3;
		this.direction = "RIGHT";

		this.angle = Math.random()*TWO_PI;
		this.changeAngle(this.angle);

		this.battleStatus = {
			underAttack: false,
			giantRat: this,
			attacker: null,

			ratAttacked: function(rat, attacker) {
				if (this.underAttack) {return;}
				this.underAttack = true;
				this.attacker = attacker;

				sprites.new(new TextParticle(this.giantRat.pos(), "!!", 45, color(195, 35, 35)))
			}
		};
		this.stats = giantRatStats();
		if(!this.stats.dmg){
			this.stats = {
				hp: 15,
				dmg: 3,
				dodge: 1,
				cooldown: 90
			}
		}
	}

	changeAngle(a) {
		this.a = a;
		a = (a ?? Math.random()*TWO_PI);
		this.move = {
			x: cos(a) * this.speed,
			y: sin(a) * this.speed,
		}
	}

	update() {
		this.x += this.move.x;
		this.y += this.move.y;

		if (this.battleStatus.underAttack) {
			let pos = (this.battleStatus.attacker.parent.identifier == -1) ? [camera.avgPositionX, camera.avgPositionY] : this.battleStatus.attacker.parent.giantRat.pos();
			let a = atan2(pos[1]-this.y, pos[0]-this.x);
			this.changeAngle(a);
		}

		// debug.displayText(`attack: ${this.battleStatus.underAttack}`);

		this.direction = (this.move.x > 0) ? "RIGHT" : "LEFT";

		this.collideRats();
		this.drawRat(0, assets.GIANT_RAT_LEFT, assets.GIANT_RAT_RIGHT);

	}

	death() {
		this.destroy = true;
		sprites.new(particleExplosion(20, this.pos(), 20, color(155, 35, 35)));

		sprites.new(new DeadRat(this, (this.direction == "RIGHT") ? assets.GIANT_RAT_RIGHT : assets.GIANT_RAT_LEFT));

		this.parent.getRats().forEach((item, i) => {
			item.death();
		});

		if (this.battleStatus.attacker.parent.identifier == -1) {
			sprites.get("RAT")[0].rules.newRule(this.parent.rules.rules[0]);
		}

		// spawnRule
	}
}



class RoamingRat extends RatBase {
	_ROAMING = true;
	LAYER = "ROAMINGRAT";

	constructor(pos, radius, angle) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];
		this.r = radius + random.integer(0, 20);
		this._visualR = radius;

		this.a = angle;
		this.speed = 2

		this._move = {
			x: cos(this._a)*this.speed,
			y: sin(this._a)*this.speed,
		}

		this.number = random.integer(1, 3);
	}

	update() {
		if (Math.abs(this.giantRat.x - camera.x) > D_WIDTH*2 || Math.abs(this.giantRat.y - camera.y) > D_HEIGHT*2) {
			this.kill();
		}

		this.x += this._move.x;
		this.y += this._move.y;

		this.direction = (this._move.x > 0) ? "RIGHT" : "LEFT";

		this.collideRats();
		this.drawRat(0, assets.NEUTRAL_RAT_LEFT, assets.NEUTRAL_RAT_RIGHT);
	}
}



class PlayerRat extends RatBase {

	constructor(pos, radius, parent) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];
		this.r = radius + random.integer(0, 20);
		this._visualR = radius;
		this.a = 0;

		this._stuckToMouse = false;

		this.parent = parent
		this.speed = 11;
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

		this.resolveStats();
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
			if (!this._animJump.jumping && !this._stuckToMouse) {
				this.rollNumber();
			}
		}

		if (inputManager.keyDown(' ')) {
			let angle = atan2(inputManager.mouse.y()-this.y, inputManager.mouse.x()-this.x);
			this.a = angle;

			this.direction = (angle > -HALF_PI && angle < HALF_PI) ? "RIGHT" : "LEFT";

			this.x += cos(angle)*this.speed;
			this.y += sin(angle)*this.speed;
		}


		if (inputManager.mouse.left) {
			if (!this._stuckToMouse) {

				let b = true;

				if (b && dist(this.x, this.y, inputManager.mouse.x(), inputManager.mouse.y()) < this.r) {
					// if the rat has the same number of a rat thats already picked up
					let empty = false;
					for (let ratParent of sprites.get("RAT")) {
						for (let r of ratParent.getRats()) {
							if (r._stuckToMouse == true) {
								empty = true;
								if (this.number == r.number){
									this._stuckToMouse = true;
									break;
								}
							}
						}
					}
					if (empty == false){
						this._stuckToMouse = true;
					}
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

		this.collideRats();
		this.drawRat(this._animJump.ymod, assets.RAT_LEFT, assets.RAT_RIGHT);
	}
}



class RatParent extends Sprite {
	LAYER = "RAT";

	constructor(number, pos, identifier, genome) {
		console.log(number);

		super();
		new super.constructor();

		this.rules = new Ruleset(this);
		this.identifier = identifier;
		this.genome = genome;

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

			let newRat = (identifier === -1) ? new PlayerRat(p, 40, this) : new Rat(p, 40, this);

			this._rats.push(newRat);
		}

		if (this.identifier === -1) {
			this.rules.newRule(basicRules.duplicate);
		}

		else {
			this.rules.newRule([generateDynamicRule, dodgeBuffOverTime][random.integer(0, 2)]());
		}

	}

	newRat(rat) {
		this._rats.push(rat);
	}

	update() {
		// if (this.identifier != -1) {
		// 	if (Math.abs(this.giantRat.x - camera.x) > D_WIDTH*2 || Math.abs(this.giantRat.y - camera.y) > D_HEIGHT*2) {
		// 		this.onScreenNow = false
		// 		return;
		// 	}
		// }

		this.onScreenNow = true;

		for (let i=this._rats.length-1; i>-1; i--) {
			let rat = this._rats[i];
			rat.update();
			if (rat.destroy) {
				this._rats.splice(i, 1);
			}
		}

		// if (this.identifier === -1) {
		// 	circle(camera.avgPositionX - camera.x, camera.avgPositionY - camera.y, 50);
		// }

	}

	getRats(n) {
		if (!n || n < 1 || n > 6) {
			return this._rats;
		}

		let arr = [];
		for (let rat of this._rats) {
			if (rat.number == n) {
				arr.push(rat);
			}
		}
		return arr;

	}
}
