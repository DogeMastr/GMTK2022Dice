const gameState = {
	FRAMES: 0,

	framesMod: function(n) {
		return this.FRAMES % n == 0;
	}
}


function preload() {
	assets.RAT_LEFT = loadImage("data/michaelLEFT.png");
	assets.RAT_RIGHT = loadImage("data/michaelRIGHT.png");

	assets.BAD_RAT_LEFT = loadImage("data/fabriceLEFT.png");
	assets.BAD_RAT_RIGHT = loadImage("data/fabriceRIGHT.png");

	// Gets resized\
	assets.GIANT_RAT_LEFT = loadImage("data/fabriceLEFT.png");
	assets.GIANT_RAT_RIGHT = loadImage("data/fabriceRIGHT.png");

	assets.NEUTRAL_RAT_LEFT = loadImage("data/robertLEFT.png");
	assets.NEUTRAL_RAT_RIGHT = loadImage("data/robertRIGHT.png");

	assets.BACKGROUND_GRASS = loadImage("data/grass.png");
	assets.CHEESE_MOUSE_POINTER = loadImage("data/mouseCheese.png");
	// assets.RULE_SCROLL = loadImage("data/rule_scroll.png");
}


function setup() {
	noCursor();
	noStroke();
	assets.GIANT_RAT_LEFT.resize(200, 0);
	assets.GIANT_RAT_RIGHT.resize(200, 0);

	imageMode(CENTER);
	createCanvas(D_WIDTH, D_HEIGHT);
	sprites.setLayers(["MANAGER", "BACKGROUND", "LOWPARTICLE", "DEADRAT", "RAT", "ROAMINGRAT", "HIGHPARTICLE", "FOREGROUND", "UI"]);

	sprites.new(new RatParent(14, [400, 500], -1, genomePlayer));
	// sprites.new(new RatParent(27, [400, -400], 20, genomePlayer));
	// sprites.new(new RoamingRat([100, 500], 35));

	frameRate(50);

	const b = assets.BACKGROUND_GRASS.width - 1;
	const bounds = [[b*-5, b*-5], [b*5, b*5]]

	for (let y=bounds[0][1]; y<bounds[1][1]; y+=b) {
		for (let x=bounds[0][0]; x<bounds[1][0]; x+=b) {
			sprites.new(new Background([x, y], assets.BACKGROUND_GRASS))
		}
	}

	sprites.new({
		LAYER: "UI",
		x: 0,
		y: 0,
		_mouseClicked: false,

		update: function() {
			this.x = mouseX-10;
			this.y = mouseY-3;

			if (inputManager.mouse.left) {
				if (!this._mouseClicked) {
					this._mouseClicked = true;
					sprites.new(particleExplosion(10, [inputManager.mouse.x()-10, inputManager.mouse.y()-3], 10, color(255,215,25), 3));
				}
			}

			else {
				this._mouseClicked = false;
			}

			imageMode(CORNER);
			image(assets.CHEESE_MOUSE_POINTER, this.x, this.y);
		}
	});

	sprites.new({
		LAYER: "MANAGER",

		update: function() {

			if (sprites.get("RAT").length < 10) {
				let identifier = 0;
				for (let ratP of sprites.get("RAT")) {
					if (ratP.identifier > identifier) {
						identifier = ratP.identifier+1;
					}
				}

				let playerRats = sprites.get("RAT")[0];
				let pos = [
					camera.avgPositionX + random.choice([-1, 1])*D_WIDTH*random.integer(1, 2),
					camera.avgPositionY + random.choice([-1, 1])*D_HEIGHT*random.integer(1, 2),
				];

				sprites.new(new RatParent(playerRats.getRats().length + random.integer(-7, 2), pos, identifier, genomePlayer));
			}
		}

	});
}

function draw() {
	background(0, 0, 0);
	sprites.updateSprites(); // Update all sprites
	camera.update();

	debug.displayText(Math.floor(frameRate()));
	debug.update();

	if (inputManager.keyDown("p") && sprites.get("HIGHPARTICLE").length == 0) {
		// sprites.new(new ClawMarks(inputManager.mouse.pos(), -HALF_PI-QUARTER_PI, color(155, 35, 35)));
		sprites.new(new TextParticle(inputManager.mouse.pos(), "DODGE", 15, 255))
		// sprites.new(particleExplosion(20, inputManager.mouse.pos(), 20, color(155, 35, 35)));
		// fill(255);
		// circle(mouseX, mouseY, 50, 50);

		sprites.get("RAT")[0].rules.newRule();
	}

	gameState.FRAMES += 1;

}


window.onresize = function() {
	resizeCanvas(window.innerWidth, window.innerHeight);
};
