const WIDTH = 800; // 800px
const HEIGHT = 600; // 600px
const ASTEROID_NAMES = ['asteroidPotato', 'asteroidCircle', 'asteroidRedSpikes' ];

var config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var gameOver = false;

var createAsteroidsTimer;
var timer;
var player;
var playerVelocityX = 0;
var playerVelocityY = 0;
var cursors;
var asteroids;
var emitter;

const defaultPlayerX = 400; // 400px at x coordinate
const defaultPlayerY = 400; // 400px at y coordinate

// This is the preload webhook.
function preload ()
{
    this.load.image('space', 'assets/space_background.png');

    this.load.spritesheet(
        'player', 
        'assets/satellite.png',
        { frameWidth: 64, frameHeight: 64}
    );
    // load the asteroids
    this.load.spritesheet(
        'asteroidPotato',
        'assets/asteroid_potato.png',
        { frameWidth: 64, frameHeight: 64 }
    );

    this.load.spritesheet(
        'asteroidCircle',
        'assets/asteroid_circle.png',
        { frameWidth: 64, frameHeight: 64 }
    );
    this.load.spritesheet(
        'asteroidRedSpikes',
        'assets/asteroid_red_spikes.png',
        { frameWidth: 64, frameHeight: 64 }
    );
}

 // This is the create webhook.
function create ()
{
    // Add the backgound image
    this.add.image(WIDTH/2, HEIGHT/2, 'space');

    // Create the timer
    createAsteroidsTimer = this.time.addEvent({
        delay: 4000,
        callback: createAsteroidHandler,
        callbackScope: this,
        loop: true
    });

    timer = this.time.addEvent({
        delay: 1000,
        callback: secondHandler,
        callbackScope: this,
        loop: true
    });

    //  Create our own EventEmitter instance
    emitter = new Phaser.Events.EventEmitter();
     //  Set-up an event handler
    emitter.on('createAsteroid', createAsteroidHandler, this);

    player = this.physics.add.sprite(defaultPlayerX, defaultPlayerY ,'player')
    player.setCollideWorldBounds(true);
    player.onWorldBounds = true;
    
    asteroids = this.physics.add.group();

    this.physics.add.collider(player, asteroids, hitAsteroid, null, this);
    cursors = this.input.keyboard.createCursorKeys();
}

 // This is the update webhook.
function update ()
{
 
    // Ensure all the asteroids are moving downwards
    Phaser.Actions.Call(asteroids.getChildren(), function(go) {
        go.setVelocityY(100);
    })

    // Logic for player's movement of the satellite
    if (cursors.left.isDown)
    {
        if (playerVelocityX >= 0 )
        {
            playerVelocityX = -50;
        } else {
            playerVelocityX -= 10;
        }
    }
    else if (cursors.right.isDown)
    {
        if (playerVelocityX <= 0 )
        {
            playerVelocityX = 50;
        } else {
            playerVelocityX += 10;
        }
    }
    else if (cursors.up.isDown)
    {
        if (playerVelocityY >= 0 )
        {
            playerVelocityY = -50;
        } else {
            playerVelocityY -= 10;
        }
    } 
    else if (cursors.down.isDown)
    {
        if (playerVelocityY <= 0 )
        {
            playerVelocityY = 50;
        } else {
            playerVelocityY += 10;
        }
    }
    else
    {
        // Player doesn't move unless arrow up, down, left, and right, buttons are pressed
        playerVelocityX = 0;
        playerVelocityY = 0;
    } 

    player.setVelocityX(playerVelocityX);
    player.setVelocityY(playerVelocityY);
}

// The eventHandler to create asteroid at a random x position at the top of the screen.
function createAsteroidHandler(){
    let xPos = Math.floor(Math.random() * WIDTH);
    let yPos = 0;
    let asteroidName = ASTEROID_NAMES[Math.floor(Math.random() * ASTEROID_NAMES.length)];        
    let asteroid = asteroids.create(xPos, yPos, asteroidName);
    // The offset is for users to be able to see the asteroid.
    let offset = 0.5
    asteroid.setScale(Math.random() + offset);
}

// The eventHandler to keep track of time by seconds and decreases the delay time for createAsteroidHandler
function secondHandler(){
    createAsteroidsTimer.delay -= 1;
}

// Game is paused when asteroid hits player.
function hitAsteroid(player, asteroid){
    this.physics.pause();

    player.setTint(0xff0000);

    gameOver = true;
    createAsteroidsTimer.paused = true;
    timer.paused = true;
} 
