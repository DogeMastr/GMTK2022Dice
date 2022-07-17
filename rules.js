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
		if (!rule) {
			return;
		}

		for (let rule of this.conditionRules("newRule")) {
			for (let rat of this.parent.getRats(rule.number)) {
				rule.execute(rat);
			}
		}

		if (this.parent.identifier == -1) {
			sprites.new(new TextParticle([camera.x+820, camera.y+90], "NEW RULE", 40, 255))
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
		description: "All rats with number [1] duplicate when a new rule is acquired",
		condition: "newRule",
		execute: function(rat) {
			rat.parent.newRat(new PlayerRat(rat.pos(), 35, rat.parent).setNumber(rat.number));
		}
	},
}


function generateDynamicRule() {
	let number = random.integer(1, 7);
	let stat = random.choice(["hp", "dmg", "dodge", "cooldown"]);

	let bonus = (stat == "hp" || stat == "dmg") ? random.integer(1, 3) : random.integer(5, 15);
	if (stat == "cooldown") {
		bonus *= -1;
	}

	return {
		number: number,
		type: stat + "Buff",
		description: `All rats with number [${number}] gain ${bonus} to ${stat}`,
		condition: "onCalculate",
		execute: function(rat) {
			rat.stats[stat] += bonus;
		}
	};
}


function dodgeBuffOverTime() {
	let number = random.integer(1, 7);

	return {
		number: number,
		type: "dodgeBuff",
		description: `All rats with number [${number}] gain +2 to dodge when a new rule is acquired`,
		condition: "newRule",
		execute: function(rat) {
			rat.stats.dodge += 2;
		}
	};
}
