// Rules should be functions that are applied to the rats
function boostHp (boost, cond) {
	return function(rat) {
		if (cond(rat)) {
			rat.HP += boost;
		}
	}
}
