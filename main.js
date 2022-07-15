
function preload() {
	assets.RAT_LEFT = loadImage("data/michaelLEFT.png");
	assets.RAT_RIGHT = loadImage("data/michaelRIGHT.png")

}


function setup() {
	// assets.RAT_LEFT.resize(75, 0);
	//
	// assets.RAT_RIGHT.resize(75, 0);

	imageMode(CENTER);
	createCanvas(window.innerWidth, window.innerHeight);
	sprites.setLayers(["BACKGROUND", "RAT", "FOREGROUND"]);

	for (let i=0; i<20; i++) {
		sprites.new(new Rat([400, 300], 35));
	}
}

function draw() {
	background(0, 0, 0);
	sprites.updateSprites(); // Update all sprites
}
