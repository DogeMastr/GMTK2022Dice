const inputManager = {
	_keyList: [],
	_firstFrame: [],

	mouse: {
		left: false,
		right: false,
		middle: false,

		pos: function() {
			return [mouseX, mouseY];
		}
	},

	keyTapped: function(k) {
		return this._firstFrame.includes(k);
	},


	keyDown: function(k) {
		return this._keyList.includes(k);
	}
}



function mousePressed() {
	if (mouseButton == LEFT) {
		inputManager.mouse.left = true;
	}
	else if (mouseButton == RIGHT) {
		inputManager.mouse.right = true;
	}
	else if (mouseButton == CENTER) {
		inputManager.mouse.middle = true;
	}
}


function mouseReleased() {
	if (mouseButton == LEFT) {
		inputManager.mouse.left = false;
	}
	else if (mouseButton == RIGHT) {
		inputManager.mouse.right = false;
	}
	else if (mouseButton == CENTER) {
		inputManager.mouse.middle = false;
	}
}


function keyTyped() {
	if (!inputManager._keyList.includes(key)) {
		inputManager._keyList.push(key);
	}
	if (!inputManager._firstFrame.includes(key)) {
		inputManager._firstFrame.push(key);
	}
}

function keyPressed() {
	// Tried making this a global const and everything just broke???
	// Leave me alone im literally a minor????
	arrowKeys = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW];

	if (!arrowKeys.includes(keyCode)) {
		return;
	}

	if (!inputManager._keyList.includes(keyCode)) {
		inputManager._keyList.push(keyCode);
	}
	if (inputManager._firstFrame.includes(key)) {
		var i = inputManager._firstFrame.indexOf(key);
		if (i != -1) {
			inputManager._firstFrame.splice(i, 1);
		}
	} else if (!inputManager._firstFrame.includes(keyCode)) {
		inputManager._firstFrame.push(keyCode);
	}
}

function keyReleased() {

	arrowKeys = [LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW];

	if (arrowKeys.includes(keyCode)) {
		var i = inputManager._keyList.indexOf(keyCode);
		if (i != -1) {
			inputManager._keyList.splice(i, 1);
		}
	}

	if (inputManager._keyList.includes(key)) {
		var i = inputManager._keyList.indexOf(key);
		if (i != -1) {
			inputManager._keyList.splice(i, 1);
		}
	}
	if (inputManager._firstFrame.includes(key)) {
		var i = inputManager._firstFrame.indexOf(key);
		if (i != -1) {
			inputManager._firstFrame.splice(i, 1);
		}
	}

	return false;
}
