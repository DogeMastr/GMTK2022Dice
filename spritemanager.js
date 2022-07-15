class Sprite {
	destroy = false;

	// Abstract method
	update() {}

	pos() {
		return [this.x, this.y]
	}
}




const sprites = {
	_sprites: {

	},

	setLayers: function(layerNames) {
		for (let layer of layerNames) {
			this._sprites[layer] = [];
		}
	},

	new: function(newSprite) {
		if (!newSprite.LAYER) {
			console.log("Sprite has no layer");
			return;
		}

		this._sprites[newSprite.LAYER].push(newSprite);
	},

	get: function(layerName) {
		let x = this._sprites[layerName];
		if (x == null) {console.log(`No layer with name ${layerName}`);}
		return x;
	},

	gets: function(...layerNames) {
		let arr = [];

		for (let n of layerNames) {
			arr.concat(this.get(n));
		}

		return arr;
	},

	updateSprites: function() {
		for (let layer in this._sprites) {
			const layerSprites = this._sprites[layer];
			for (let i=layerSprites.length-1; i>-1; i--) {
				let sprite = layerSprites.at(i);
				sprite.update();
				if (sprite.destroy) {
					layerSprites.splice(i, 1);
				}
			}
		}
	}
}
