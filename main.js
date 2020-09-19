const score = document.getElementById('score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');
const record = document.getElementById('record');
const speed = document.getElementById('speed');
const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;

car.classList.add('car');

const audio = document.createElement('embed');
audio.src = './music/music.mp3';
audio.type = 'audio/mp3';
audio.style.cssText = "position:absolute; top:-1000px;";

const explosion = new Audio('./music/explosion.mp3');

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
    traffic:3
};

record.textContent = localStorage.getItem('nfjs_score', setting.record) ?
    localStorage.getItem('nfjs_score', setting.record) :
    0;

let topRecord = +localStorage.getItem('nfjs_score');
record.style.display = 'none';


const addLocalStorage = () => {
    if (setting.score > topRecord){
        topRecord = setting.score;
    localStorage.setItem('nfjs_score', setting.record);}
}

function getQuantityElement(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
    start.classList.add('hide');
    record.style.display = 'grid';
    gameArea.innerHTML = '';
   
    for (let i = 0; i < getQuantityElement(HEIGHT_ELEM); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * HEIGHT_ELEM) + 'px';
        line.y = i * HEIGHT_ELEM;
        document.querySelector('.gameArea').appendChild(line);
    }

    for (let i = 0; i < getQuantityElement(HEIGHT_ELEM * setting.traffic); i++) {
        const enemy = document.createElement('div');
        const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
        enemy.classList.add('enemy');
        enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - HEIGHT_ELEM / 2)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url('./image/enemy${randomEnemy}.png') center / cover no-repeat`;
        document.querySelector('.gameArea').appendChild(enemy);
    }

    setting.score = 0;
    setting.speed = 5;
    setting.start = true;
    gameArea.appendChild(car);
    document.body.append(audio);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
    car.style.bottom = '5px';
    car.style.top = 'auto';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    setting.score += setting.speed;

    score.innerHTML = 'SCORE : ' + setting.score;
    speed.innerHTML = 'SPEED : ' + setting.speed;
    record.innerHTML = 'RECORD : ' + topRecord;
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

        if ((setting.score % 1000) == 0) {
            setting.speed++;
        }

        if (setting.score > setting.record){
            setting.record = setting.score;
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

        if (line.y > gameArea.offsetHeight) {
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
            explosion.play();
            audio.remove();
            addLocalStorage();
            if (start.innerText === 'START') {
                document.querySelector('.start').innerText = 'RESTART';
              }
              start.style.top = 200 + 'px';
        }

        item.y = item.y + setting.speed;
        item.style.top = item.y + 'px';
        if (item.y > gameArea.offsetHeight) {
            item.y = -HEIGHT_ELEM * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
        }
    });

}

function startRun(event) {
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function startRun(event) {
    if (keys.hasOwnProperty(event.key)) {
        event.preventDefault();
        keys[event.key] = true;
    }
}