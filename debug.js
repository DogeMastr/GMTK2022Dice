const debug = {
	_debugText: [],
	_fontSize: 40,
	_fontColour: 255,

	displayText: function(t) {
		this._debugText.push(t);
	},

	update: function() {
		textSize(this._fontSize);
		fill(255);

		let i=0;
		for (let t of this._debugText) {

			text(t, this._fontSize, i+this._fontSize);

			i += this._fontSize*1.5;
		}

		this._debugText = [];
	}
}
