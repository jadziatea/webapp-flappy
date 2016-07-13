// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 200;
var jumpPower = 200;

var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score=0;
var labelScore;
var player;
var pipes = [];
var gapSize = 50;
var gapMargin = 50;
var blockHeight= 50;
var splashDisplay;
var stars = [];
/*
* Loads all resources for the game and gives them names.
*/
function preload() {


  game.load.image("playerImg", "../assets/flappy_frog.png");
  game.load.audio("score", "../assets/point.ogg");
  game.load.image("pipeBlock","../assets/pipe_blue.png");
  game.load.image("star", "../assets/star.png");



}

/*
* Initialises the game. This function is only called once.
*/

function start() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  labelScore=game.add.text(0,0,"0");
  game.input
  .onDown
  .add(clickHandler);
  player = game.add.sprite(100, 200, "playerImg");



  game.physics.arcade.enable(player);
  player.body.gravity.y = 400;
  game.input.keyboard
      .addKey(Phaser.Keyboard.SPACEBAR)
      .onDown.add(playerJump);
  player.anchor.setTo(0.5, 0.5);

  var pipeInterval = 1.75 * Phaser.Timer.SECOND;
  game.time.events.loop(
    pipeInterval,
    generatePipe
  );

  game.paused = false;
  game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
  splashDisplay.destroy();
  splashDisplay1.destroy();
  splashDisplay2.destroy();
}

function create() {

  game.stage.setBackgroundColor("#a64dff");
  game.paused = true;


  game.input.keyboard
      .addKey(Phaser.Keyboard.ENTER)
      .onDown.add(start);
      splashDisplay = game.add.text(140,200, "Press ENTER to start, SPACEBAR to jump");
      splashDisplay1 = game.add.text(0,0, "FLYING FROGS");
      splashDisplay2 = game.add.text(300,150, "Start Game");
}


function update() {
  game.physics.arcade.overlap(player, pipes, gameOver);
  if (player.y < 0 || player.y > 400) {
    gameOver();
  }
  player.rotation = Math.atan(player.body.velocity.y / 200);

game.physics.arcade.overlap(player, stars, scoreStars )



}
function scoreStars(player, star){
  star.destroy()
  changeScore()
}
// set the background colour of the scene
function clickHandler(event) {
  //alert("The position is: " + event.x + "," + event.y
}
function spaceHandler() {
  game.sound.play("score");
}
function changeScore() {
  score = score + 1;
  labelScore.setText(score.toString());
}

function generatePipe() {
  var gap = game.rnd.integerInRange(1 ,5);
  for (var count = 0; count < 8; count++) {
    if (count != gap && count != gap+1) {
      addPipeBlock(750, count * 50);
    }
  }
  addStar(750, 25+ gap * 50);
}

function addStar(x,y) {
var Star  = game.add.sprite(x,y,"star");
stars.push(Star);
game.physics.arcade.enable(Star);
Star.body.velocity.x=-200;

}

function addPipeBlock(x, y) {
  var pipeBlock = game.add.sprite(x,y,"pipeBlock");
  pipes.push(pipeBlock);
  game.physics.arcade.enable(pipeBlock);
  pipeBlock.body.velocity.x=-200;
}

function playerJump() {
  player.body.velocity.y = -200;
  game.sound.play("score");
}

function gameOver(){
  score = 0;
  game.state.restart();
  stars = [];
}
