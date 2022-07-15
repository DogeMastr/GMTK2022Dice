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