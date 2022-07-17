class Ruleset { // One for each RatParent

	constructor(parent) {
		// list of rules that are applied
		this.parent = parent;
		this.rules = [];
	}

	applicableRules(n) {
		// checks the number passed in and returns object with all rules that apply to that number
		let arr = [];
		for (let rule of this.rules) {
			if (rule.number == n || rule.number == "ANY") {
				arr.push(rule);
			}
		}
		return arr;

	}

	conditionRules(cond) {
		let arr = [];
		for (let rule of this.rules) {
			if (rule.condition == cond) {
				arr.push(rule);
			}
		}
		return arr;
	}

	newRule(rule) {
		for (let rule of this.conditionRules("newRule")) {
			for (let rat of this.parent.getRats(rule.number)) {
				rule.execute(rat);
			}
		}

		if (!rule) {
			return;
		}

		// some kinda js object gets pushed
		// rule.description = rule.description.replaceAll("<n>", `[${rule.number}]`)
		this.rules.push(rule);

		for (let rat of this.parent.getRats()) {
			rat.resolveStats();
		}
	}

}


// // Example ruleset
// function() {
// 	const rules = Ruleset();
//
// 	rules.newRule()
// }


const basicRules = {
	duplicate: {
		number: 1,
		type: "duplicate",
		description: "All rats with number [1] have a chance to duplicate when a new rule is acquired",
		condition: "newRule",
		execute: function(rat) {
			rat.parent.newRat(new PlayerRat(rat.pos(), 35, rat.parent).setNumber(rat.number));
		}
	},
}


function generateDynamicRule() {
	let number = random.integer(1, 7);
	let stat = random.choice(["hp", "dmg", "dodge", "cooldown"]);
	let bonus = random.integer(1, 3);

	return {
		number: number,
		type: random.choice([""]),
		description: `All rats with number [${number}] gain +${bonus} to ${stat}`,
		condition: "onCalculate",
		execute: function(rat) {
			rat.stats[stat] += bonus;
		}
	};
}
