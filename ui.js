class UIScroll extends Sprite {
	constructor(pos) {
		super();
		new super.constructor();

		this.x = pos[0];
		this.y = pos[1];

		this._og = {
			x: this.x,
			y: this.y
		}

		this._moving_down = false;
	}

	update() {
		if (!this._moving_down) {
			if (!inputManager.keyDown("q")) {
				if (this.y == this._og.y) {
					this._moving_down = true;
				}

				else {
					this.y = this._og.y;
				}
			}
		}

		else {
			this.y += 10;
			if (this.y > this._og.y + asset.RULE_SCROLL.height) {
				this._moving_down = false;
			}
		}

		imageMode(CORNER);
		image(asset.RULE_SCROLL, this.x, this.y);
	}
}
