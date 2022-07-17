const random = {
	integer: function(a, b) {
		return Math.floor(Math.random()*(b-a)) + a;
	},


	choice: function(seq) {
		if (!(typeof seq.length === "number")) {
			throw new TypeError("The sequence you passed must have integer length, dickhead");
		}

		return seq[integer(0, seq.length-1)]
	},


	choiceIndex: function(seq) {
		if (!(typeof seq.length === "number")) {
			throw new TypeError("The sequence you passed must have integer length, dickhead");
		}

		let i = integer(0, seq.length-1);
		return {
			choice: seq[i],
			index: i
		}
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


function sum(iter) {
let count = 0;
	for (let s of iter) {
		count += s;
	}
	return count;
}


function any(iter, cond) {
	for (let i of iter) {
		if (cond(i)) {
			return true;
		}
	}

	return false;
}


function normalize(val) {
	if (val > 0) { return 1; }
	if (val < 0) { return -1; }
	return 0;
}


class Coroutine extends Sprite {
	LAYER = "MANAGER";

	constructor(frames, callback, args) {
		super();
		new super.constructor();

		this._frames = frames;
		this._callback = callback;
		this._callback_args = args;
	}

	update() {
		this._frames--;
		if (this._frames < 1) {
			(this._callback_args) ? this._callback(this._callback_args) : this._callback();
			this.destroy = true;
		}
	}
}


class RepeaterCoroutine extends Sprite {
	constructor(pos, frameLen, frameMod, callback) {
		super();
		new super.constructor();

		this._frameLen = frameLen;
		this._frameMod = frameMod;

		this._callback = callback;
	}

	update() {
		this._frameLen--;

		if (this._frameLen < 1) {
			this.kill();
		}

		if (this._frameLen % this._frameMod == 0) {
			this._callback();
		}
	}
}
