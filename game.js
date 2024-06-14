const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Charger l'image du joueur
const playerImage = new Image();
playerImage.src = 'player.png';

const player = {
    x: 10,
    y: 500,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0
};

const gravity = 1;
let isJumping = false;

// Définir les différentes cartes
const maps = [
    [
        {x: 0, y: 550, width: 250, height: 50, color: 'green', passable: false},
        {x: 300, y: 400, width: 200, height: 20, color: 'orange', passable: true},
        {x: 50, y: 250, width: 200, height: 20, color: 'red', passable: true},
        {x: 350, y: 100, width: 100, height: 20, color: 'yellow', passable: true},
        
        {x: 730, y: 350, width: 50, height: 20, color: 'blue', passable: true},
        {x: 780, y: 100, width: 20, height: 500, color: 'red', passable: true}, /*Mur de fin*/

    ],
    [
        {x: 0, y: 550, width: 800, height: 50, color: 'green', passable: false},
        {x: 150, y: 450, width: 200, height: 20, color: 'blue', passable: true},
        {x: 450, y: 350, width: 200, height: 20, color: 'green', passable: false}
    ]
];

// Initialiser à la première carte
let currentMapIndex = 0;

function drawPlayer() {
    // Désactiver l'interpolation des images
    context.imageSmoothingEnabled = false;
    // Dessiner l'image du joueur
    context.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    const currentMap = maps[currentMapIndex];
    currentMap.forEach(platform => {
        context.fillStyle = platform.color;
        context.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.dy += gravity;
    player.x += player.dx;
    player.y += player.dy;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) {
        changeMap();
    }
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    checkCollisions();
}

function checkCollisions() {
    const currentMap = maps[currentMapIndex];
    currentMap.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x) {
            // Collision avec la partie supérieure de la plateforme
            if (player.y + player.height > platform.y &&
                player.y + player.height - player.dy <= platform.y) {
                if (!platform.passable || (platform.passable && player.dy >= 0)) {
                    player.y = platform.y - player.height;
                    player.dy = 0;
                    isJumping = false;
                }
            }

            if (player.y >= 550){
                alert("game over");
                player.y = 500;
                player.x = 10;
            }

            // Collision avec la partie inférieure de la plateforme (uniquement pour les passables)
            if (platform.passable && 
                player.y < platform.y + platform.height &&
                player.y - player.dy >= platform.y + platform.height) {
                player.y = platform.y + platform.height;
                player.dy = 0;
            }

        }
    });
}

function changeMap() {
    currentMapIndex = (currentMapIndex + 1) % maps.length;
    player.x = 0;
    player.y = 400;
    player.dx = 0;
    player.dy = 0;
}

function update() {
    clear();
    drawPlayer();
    drawPlatforms();
    newPos();
    requestAnimationFrame(update);
}

function moveRight() {
    player.dx = player.speed;
}

function moveLeft() {
    player.dx = -player.speed;
}

function moveUp() {
    if (!isJumping) {
        player.dy = -20;
        isJumping = true;
    }
}

function moveDown() {
    player.dy = player.speed;
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') moveRight();
    if (e.key === 'ArrowLeft' || e.key === 'Left') moveLeft();
    if (e.key === 'ArrowUp' || e.key === 'Up') moveUp();
    if (e.key === 'ArrowDown' || e.key === 'Down') moveDown();
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') player.dx = 0;
    if (e.key === 'ArrowLeft' || e.key === 'Left') player.dx = 0;
    if (e.key === 'ArrowUp' || e.key === 'Up') player.dy = 0;
    if (e.key === 'ArrowDown' || e.key === 'Down') player.dy = 0;
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

update();
