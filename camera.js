const camera = {
	x: 0,
	y: 0,
	_speed: 20,

	w: D_WIDTH,
	h: D_HEIGHT,
	margin: this.w / 30,

	update: function() {
		let playerRat = (function() {
			for (let r of sprites.get("RAT")) {
				if (r.identifier === -1) {
					return r;
				}
			}
			return null;
		})();

		if (playerRat == null) {return;}

		const rats = playerRat.getRats();

		// console.log(any(rats, (r) => r._stuckToMouse === true));
		if (any(rats, (r) => r._stuckToMouse)) {
			return;
		}

		if (rats.length < 1) {
			return;
		}

		this.avgPositionX = (sum(rats.map(r => r.x)) / rats.length);
		this.avgPositionY = (sum(rats.map(r => r.y)) / rats.length);

		this._ax = this.avgPositionX - (D_WIDTH/2);
		this._ay = this.avgPositionY - (D_HEIGHT/2);


		// this.x = avgPositionX - D_WIDTH/2;
		// this.y = avgPositionY - D_HEIGHT/2;

		let d = dist(this.x, this.y , this._ax, this._ay);
		// this._speed = map(d, 0, D_WIDTH/2, 0, 20);

		// if (d < 10) {
		// 	this.x = this.avgPositionX;
		// 	this.y = this.avgPositionY;
		// 	return;
		// }

		let angle = atan2(this._ay-this.y, this._ax-this.x);

		let df = (d > 5) ? d/20 : 0;

		this.x += cos(angle) * df;
		this.y += sin(angle) * df;


		// debug.displayText(`X: ${this.x}, Y: ${this.y}`);

		//MAKE NEW BACKGROUNDS!!!!

		/*
			how to make background 101
			1. is there space with no background on screen
				2. yes : make background
				3. no : dont

			if cameraX is ontop of a background
			if cameraX + W

		*/
		// let checkTile = function(x, y) {
		// 	for (let bg of sprites.get("BACKGROUND")) {
		// 		if (bg.x == x && bg.y == y) {
		// 			return true;
		// 		}
		// 	}
		// 	return false;
		// }
		//
		// for (let b of sprites.get("BACKGROUND")) {
		// 	if (b.onCamera([b.w, 0]) && !checkTile(b.x+b.w, b.y)) {
		// 		// console.log("hr");
		// 		// sprites.new(new Background([b.x+b.w, b.y], b._img));
		// 	}
		//
		// }
	} // end update function
}
