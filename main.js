const score = document.getElementById('score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');
const record = document.getElementById('record');
const speed = document.getElementById('speed');
const MAX_ENEMY = 6;
car.classList.add('car');

const audio = document.createElement('embed');
audio.src = 'music.mp3';
audio.type ='audio/mp3';
audio.style.cssText = "position:absolute; left:-1000px;";

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    record: 0,
    score: 0,
    speed: 5,
    traffic: 3
};

function getQuantityElement(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
    start.classList.add('hide');

    gameArea.innerHTML = '';

    for (let i = 0; i < getQuantityElement(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        document.querySelector('.gameArea').appendChild(line);
    }

    for (let i = 0; i < getQuantityElement(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = 'transparent url(./image/enemy1.png) center / cover no-repeat';
        document.querySelector('.gameArea').appendChild(enemy);
    }

    setting.score = 0;
    setting.speed = 5;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.bottom = '10px';
    car.style.top = 'auto';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    setting.score += setting.speed;
    score.innerHTML = 'SCORE : ' + setting.score;
    record.innerHTML = 'RECORD : ' + setting.record;
    speed.innerHTML = 'SPEED : ' + setting.speed;
    moveRoad();
    moveEnemy();
    if (setting.start) {
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }

        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }

        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        if ((setting.score % 500) == 0) {
            setting.speed++;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function (line) {
        line.y = line.y + setting.speed;
        line.style.top = line.y + 'px';

        if (line.y > document.documentElement.clientHeight) {
            line.y = -100;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function (item) {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
            setting.start = false;
            if (setting.score > setting.record) {
                setting.record = setting.score;
            }
        }

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';
        if (item.y > document.documentElement.clientHeight) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });

}

function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun() {
    event.preventDefault();
    keys[event.key] = false;
}

function startRun(event) {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = true;
    }
}