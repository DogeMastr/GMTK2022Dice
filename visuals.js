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
