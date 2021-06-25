const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
    start = document.querySelector('.start'), 
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');
    
const btns = document.querySelectorAll('.btn');
const audio = new Audio('./audio/577340__josefpres__bass-loops-011-with-drums-short-loop-120-bpm.wav');

const enemies = [
    './image/enemy.png', 
    './image/enemy2.png', 
    './image/enemy3.png', 
    './image/enemy4.png', 
    './image/enemy5.png', 
    './image/enemy6.png'
];

car.classList.add('car');

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

let startSpeed = 0;

const changeLevel = (lvl) => {
    switch(lvl) {
        case '1':
            setting.traffic = 4;
            setting.speed = 3;
            break;
        case '2':
            setting.traffic = 3;
            setting.speed = 6;
            break;
        case '3':
            setting.traffic = 3;
            setting.speed = 8;
            break;
    }
    startSpeed = setting.speed;
};


function getQuantityElements(heightElement) {
    return (gameArea.offsetHeight / heightElement) + 1;
}


function getRandomEnemy(){
    return enemies[Math.floor(Math.random() * enemies.length)];
}


function startGame(){
    const target = event.target;

    if (!target.classList.contains('btn')) {
        return;
    }

    const levelGame = target.dataset.levelGame;

    changeLevel(levelGame);

    btns.forEach(btn => btn.disabled = true);

    gameArea.style.minHeight = Math.floor((document.documentElement.clientHeight -HEIGHT_ELEM) / HEIGHT_ELEM) * HEIGHT_ELEM;
    start.classList.add('hide');
    gameArea.classList.remove('hide'); 
    gameArea.innerHTML = '';
    audio.play();
    audio.volume = 0.1;
    audio.loop = true;
    // keys.ArrowUp = false;
    // keys.ArrowDown = false;
    // keys.ArrowLeft = false;
    // keys.ArrowRight = false;
        

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i++){
        const line = document.createElement('div');
        
        line.classList.add('line');
        line.style.top = (i * HEIGHT_ELEM) + 'px';
        line.style.height = (HEIGHT_ELEM / 2) + 'px';
        line.y = i * HEIGHT_ELEM;
        gameArea.append(line);
    }

    for (let i = 0; i < getQuantityElements(HEIGHT_ELEM * setting.traffic); i++){
        const enemy = document.createElement('div');
        const enemyColor = getRandomEnemy();

        enemy.classList.add('enemy');
        enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.backgroundImage = `url(${enemyColor})`;
        gameArea.append(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.append(car);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
 
    requestAnimationFrame(playGame);
}


function playGame(){
    if (setting.start){
        setting.score += setting.speed;
        score.innerHTML = 'SCORE: ' + setting.score;
        setting.speed = startSpeed + Math.floor(setting.score / 5000);

        moveRoad();
        moveEnemy();

        if (keys.ArrowLeft && setting.x > 0){
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
        }

        if (keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }
}

function startRun(event){
    if (keys.hasOwnProperty(event.key)){
        event.preventDefault();
        keys[event.key] = true;
    }
    
}

function stopRun(event){
    if (keys.hasOwnProperty(event.key)){
        event.preventDefault();
        keys[event.key] = false;
    }
}

function moveRoad(){
    let lines = document.querySelectorAll('.line');

    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= gameArea.offsetHeight) {
            line.y = -HEIGHT_ELEM;
        }
    });
}

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left && 
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            endGame();
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if (item.y >= gameArea.offsetHeight){
            item.y = -HEIGHT_ELEM * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}

function endGame(){
    alert('GAME OVER!');
    audio.pause();
    setting.start = false;
    console.warn('CRASH');
    start.classList.remove('hide');
    btns.forEach(btn => btn.disabled = false);
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);