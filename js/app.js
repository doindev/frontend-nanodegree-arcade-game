var Moveable = function(sprite){
    this.sprite = sprite;
    this.x = 0;
    this.y = 0;
    this.width = 101;
    this.height = 171;
};

// Update the position, required method for game
// Parameter: dt, a time delta between ticks
Moveable.prototype.update = function(dt){
     // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the on the screen, required method for game
Moveable.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.checkForCollisions();
};

/* define row and column points */
var row = [-13, 59, 142, 225, 307, 387];
var col = [0, 101, 202, 303, 404];

var Enemy = function(){
    Moveable.call(this, 'images/enemy-bug.png');
    this.reset();
};
Enemy.prototype = Object.create(Moveable.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(dt){
    this.x = this.x + (this.interval * dt);

    /* check if enemy made it across the screen */
    if(this.x>507)
        this.reset();
};
Enemy.prototype.checkForCollisions = function(){
    /* check to see if we hit player */
    if(this.y === player.y
        && this.x < player.x + 25 
        && this.x + this.width > player.x + 25
    ){
        player.reset();
    }
}
Enemy.prototype.reset = function(){
    this.x = -100;
    this.interval = Math.floor(Math.random() * (600 - 100)) + 100
    this.y = row[Math.floor(Math.random() * (4 - 1)) + 1];
};


var Player = function(sprite){
    if(sprite !== undefined)
        Moveable.call(this, sprite);
    else
        Moveable.call(this, 'images/char-boy.png');
    this.reset();
};
Player.prototype = Object.create(Moveable.prototype);
Player.prototype.constructor = Player;
Player.prototype.handleInput = function(direction){
    switch(direction){
        case 'up':
            if(this.row > 0)
                this.row = this.row - 1;
            break;
        case 'down':
            if(this.row < 5)
                this.row = this.row + 1;
            break;
        case 'left':
            if(this.col > 0)
                this.col = this.col - 1;
            break;
        case 'right':
            if(this.col < 4)
                this.col = this.col + 1;
    }
    this.y = row[this.row];
    this.x = col[this.col];
};
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y +4);
    this.checkForCollisions();
};
Player.prototype.checkForCollisions = function(){
    /* reset if player made it to the top */
    if(this.y == row[0]){
        this.reset();
        return;
    }

    /* check to see if we jumped on top of enemy */
    for(i=0;i<allEnemies.length;i++){
        if(allEnemies[i].y == this.y
            && this.x < allEnemies[i].x 
            && this.x + this.width - 25 > allEnemies[i].x
        ){
            this.reset();
            break;
        }
    };
};
Player.prototype.reset = function(){
    this.col = 2;
    this.row = 5;
    this.y = row[this.row];
    this.x = col[this.col];
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemies = 3 ;
var allEnemies = [];

for(i=0;i<enemies;i++){
    allEnemies[i] = new Enemy();
}
var player = new Player();




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
