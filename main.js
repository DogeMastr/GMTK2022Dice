
function preload() {
	assets.RAT_LEFT = loadImage("data/michaelLEFT.png");
	assets.RAT_RIGHT = loadImage("data/michaelRIGHT.png")

	assets.GIANT_RAT_LEFT = loadImage("data/michaelLEFT.png");
	assets.GIANT_RAT_RIGHT = loadImage("data/michaelRIGHT.png")
}


function setup() {
	assets.GIANT_RAT_LEFT.resize(200, 0);
	assets.GIANT_RAT_RIGHT.resize(200, 0);

	imageMode(CENTER);
	createCanvas(window.innerWidth, window.innerHeight);
	sprites.setLayers(["BACKGROUND", "LOWPARTICLE", "RAT", "HIGHPARTICLE", "FOREGROUND"]);

	sprites.new(new RatParent(50, [400, 300], "2", -1));
	sprites.new(new RatParent(5, [400, 100], "2", 20));

}

function draw() {
	background(0, 0, 0);
	sprites.updateSprites(); // Update all sprites
	debug.displayText(Math.floor(frameRate()));
	debug.update();

	if (inputManager.keyDown("p") && sprites.get("HIGHPARTICLE").length == 0) {
		sprites.new(particleExplosion(20, [mouseX, mouseY], 20, color(155, 35, 35)));
		// fill(255);
		// circle(mouseX, mouseY, 50, 50);
	}

}
