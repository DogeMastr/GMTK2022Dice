const D_WIDTH = 1920;
const D_HEIGHT = 1080;


const genomePlayer = {
	1: {
		hp: 1,
		dmg: 1,
		dodge: 15,
		cooldown: 60,

	},

	_null: {
		hp: 1,
		dmg: 1,
		dodge: 15,
		cooldown: 60,
	},

	resolve: function(n) {
		n = (n > 1) ? 1 : n;

		return this[n ?? "_null"];
	},

}
