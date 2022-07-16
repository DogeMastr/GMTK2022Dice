const D_WIDTH = window.innerWidth;
const D_HEIGHT = window.innerHeight; // change to 919

// console.log(D_WIDTH);
// console.log(D_HEIGHT);


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
