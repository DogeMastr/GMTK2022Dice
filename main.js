
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
	sprites.setLayers(["BACKGROUND", "RAT", "FOREGROUND"]);

	sprites.new(new RatParent(50, [400, 300], "2", -1));
	sprites.new(new RatParent(5, [400, 100], "2", 20));

}

function draw() {
	background(0, 0, 0);
	sprites.updateSprites(); // Update all sprites
	debug.displayText(Math.floor(frameRate()));
	debug.update();

}
