'use strict'

let lastKey = "right"
let mainInterval = 0;
let score = 0;
let zmeya = [];
let playing = false;
let gameFinished = false;
let speed = 0;
document.getElementById('speed').innerHTML = speed + " "

if (localStorage.getItem("maxScore") === null) {
    localStorage.setItem("maxScore", 0)
}

let btnRestart = document.getElementById('btn-restart')
let btnStop = document.getElementById('btn-stop')

let status = document.getElementById('status')
status.innerHTML = "Stoped"

btnStop.addEventListener('click', stopGame)
btnRestart.addEventListener('click', restart)
document.getElementById('score').innerHTML = score;
document.getElementById('max-score').innerHTML = localStorage.getItem("maxScore")

function stopGame() {
    if (!gameFinished) {
        clearInterval(mainInterval);
        document.getElementById('status').innerHTML = "Stoped"
    }
}

function restart() {
    lastKey = "right"
    gameFinished = false;
    clearInterval(mainInterval);
    score = 0;
    speed = 170;
    document.getElementById('speed').innerHTML = speed + " "
    document.getElementById('status').innerHTML = "Playing";

    // clear field

    for (let row = 1; row <= 15; row++) {
        for (let col = 1; col <= 15; col++) {
            document.getElementById(`${row}-${col}`).classList.remove('zm')
            document.getElementById(`${row}-${col}`).classList.remove('food')
            document.getElementById(`${row}-${col}`).classList.remove('red')
        }
    }

    zmeya = [];

    zmeya.unshift(new Pos(7, 7));
    zmeya.unshift(new Pos(7, 6));
    zmeya.unshift(new Pos(7, 5));
    zmeya.unshift(new Pos(7, 4));


    zmeya.forEach(element => {
        let el = document.getElementById(`${element.row}-${element.col}`)
        el.classList.remove('blank')
        el.classList.remove('food')
        el.classList.add('zm')
    });



    startGame()
}


document.addEventListener('keydown', event => {
    let key = event.key;
    if (key === "ArrowRight" && lastKey != "left") {
        lastKey = 'right'
    }
    if (key === "ArrowLeft" && lastKey != "right") {
        lastKey = 'left'
    }
    if (key === "ArrowUp" && lastKey != "down") {
        lastKey = 'up'
    }
    if (key === "ArrowDown" && lastKey != "up") {
        lastKey = 'down'
    }
})

class Pos {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}


function startGame() { // including restart
    createFood()
    playing = true;
    score = 0
    document.getElementById('score').innerHTML = score;
    reinterval(speed)

}


function reinterval(num) {
    console.log("reinterval")
    clearInterval(mainInterval)
    mainInterval = setInterval(() => {
        let front = zmeya[zmeya.length - 1]
        let newRow = front.row;
        let newCol = front.col;
        console.log(num)
        //console.log(`new row - ${newRow}  new col - ${newCol}`)

        switch (lastKey) {
            case "up":
                newRow = newRow - 1
                if (newRow < 1) {
                    newRow = 15;
                }
                break;
            case "down":
                newRow = newRow + 1;
                if (newRow > 15) {
                    newRow = 1;
                }
                break;

            case "left":
                newCol = newCol - 1;
                if (newCol < 1) {
                    newCol = 15;
                }
                break;

            case "right":
                newCol = newCol + 1;
                if (newCol > 15) {
                    newCol = 1;
                }
                break;
        }

        // check if new brik if self => finish
        let newBrik = new Pos(newRow, newCol);
        let newEl = document.getElementById(`${newRow}-${newCol}`)

        if (newEl.classList.contains('zm') && playing === true) {
            draw(newBrik, "red")
            finishGame("self")
        }

        if (newEl.classList.contains('food')) {
            // console.log("food")
            zmeya.push(newBrik)
            draw(newBrik, "zm")
            score++
            document.getElementById('score').innerHTML = score;
            createFood()
            if (score > localStorage.getItem("maxScore")) {
                localStorage.setItem("maxScore", score)
                document.getElementById('max-score').innerHTML = localStorage.getItem("maxScore")
            }

            if (score % 7 === 0 && speed > 50) {
                speed = speed - 12
                document.getElementById('speed').innerHTML = speed + " "
                reinterval(speed)
            }

        } else { // new is clear
            let toDelete = zmeya.shift()
            draw(toDelete, "blank")
            zmeya.push(newBrik)
            draw(newBrik, "zm")
        }
    }, num)

}


function finishGame(type) {
    // type could be left, could borders, could be prepiatstvie
    playing = false;
    clearInterval(mainInterval)
    console.log(`Finished on ${type}`)
    document.getElementById('status').innerHTML = `Finished on ${type}`;
    gameFinished = true;
}

function createFood() {
    let interrate = true;
    let r = 0;
    let c = 0;
    while (interrate) {
        r = 1 + Math.round(Math.random() * 14);
        c = 1 + Math.round(Math.random() * 14);
        if (document.getElementById(`${r}-${c}`).classList.contains('blank')) {
            interrate = false
        }
    }
    draw(new Pos(r, c), "food")

}

function draw(pos, type) {
    let el = document.getElementById(`${pos.row}-${pos.col}`)
    if (type === "zm") {
        el.classList.remove('blank')
        el.classList.remove('food')
        el.classList.add('zm')
    } else if (type === "food") {
        el.classList.remove('blank')
        el.classList.remove('zm')
        el.classList.add('food')
    } else if (type === "blank") {
        el.classList.remove('zm')
        el.classList.remove('food')
        el.classList.add('blank')
    } else if (type === "red") {
        console.log("red")
        el.classList.remove('zm')
        el.classList.remove('food')
        el.classList.remove('blank')
        el.classList.add('red')
    }
}