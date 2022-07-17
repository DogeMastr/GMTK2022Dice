class Ruleset { // One for each RatParent

	constructor() {
		// list of rules that are applied
		this.rules = [];
	}

	applicableRules(n) {
		// checks the number passed in and returns object with all rules that apply to that number
		let arr = [];
		for (let rule of this.rules) {
			if (rule.number == n || rule.number == "ANY") {
				arr.push(rule.type);
			}
		}
		return arr;

	}

	newRule(rule) {
		// some kinda js object gets pushed
		rule.description = rule.description.replaceAll("<n>", `[${rule.number}]`)
		this.rules.push(rule);
	}

}


// Example ruleset
function() {
	const rules = Ruleset();

	rules.newRule({
		number: 1,
		type: "duplicate",
		description: "All rats with number <n> have a chance to duplicate when a new rule is acquired"
	})
}
