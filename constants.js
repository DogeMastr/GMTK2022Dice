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

	2: {
		hp: 12,
		dmg: 1,
		dodge: 15,
		cooldown: 60,
	},

	3: {
		hp: 8,
		dmg: 2,
		dodge: 15,
		cooldown: 60,
	},

	4: {
		hp: 4,
		dmg: 3,
		dodge: 15,
		cooldown: 60,
	},

	5: {
		hp: 2,
		dmg: 4,
		dodge: 25,
		cooldown: 75,
	},

	6: {
		hp: 1,
		dmg: 6,
		dodge: 15,
		cooldown: 50,
	},

	resolve: function(n) {
		let b = this[n];

		let newObj = {};
		for (let key in b) {
			newObj[key] = b[key];
		}

		return newObj;
	},
}


function giantRatStats() {
	return {
		hp: 15,
		dmg: 3,
		dodge: 1,
		cooldown: 90,
	}
}
