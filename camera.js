const camera = {
	x: 0,
	y: 0,
	_speed: 20,

	w: window.innerWidth,
	h: window.innerHeight,
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

		this.avgPositionX = (sum(rats.map(r => r.x)) / rats.length) - window.innerWidth/ 2;
		this.avgPositionY = (sum(rats.map(r => r.y)) / rats.length) - window.innerHeight/2;

		// this.x = avgPositionX - window.innerWidth/2;
		// this.y = avgPositionY - window.innerHeight/2;

		let d = dist(this.x, this.y , this.avgPositionX, this.avgPositionY);
		// this._speed = map(d, 0, window.innerWidth/2, 0, 20);

		// if (d < 10) {
		// 	this.x = this.avgPositionX;
		// 	this.y = this.avgPositionY;
		// 	return;
		// }

		let angle = atan2(this.avgPositionY-this.y, this.avgPositionX-this.x);

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
