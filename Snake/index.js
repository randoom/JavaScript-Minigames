// @ts-check
/** @type {HTMLCanvasElement} */
// @ts-ignore
var canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var square = 50;
var colCount = canvas.width / square;
var rowCount = canvas.height / square;

var LEFT = "LEFT", RIGHT = "RIGHT", UP = "UP", DOWN = "DOWN";
var directionChanges = {
	LEFT:{
		c: -1,
		r: 0
	},
	RIGHT:{
		c: 1,
		r: 0
	},
	UP:{
		c: 0,
		r: -1
	},
	DOWN:{
		c: 0,
		r: 1
	}
}

class Snake {
    constructor(colors, parts, direction, keys) {
        this.colors = colors;
        this.parts = parts;
        this.direction = direction;
        this.keys = keys;
        this.score = 0;
        this.mustGrowBy = 0;
    }

    get head() {
        return this.parts[this.parts.length - 1];
    }

    drawSnakePart(part, isHead) {
        context.fillStyle = isHead ? this.colors[0] : this.colors[1];
        context.fillRect(part.c * square, part.r * square, square, square);
    }

    draw() {
		this.parts.forEach(part => this.drawSnakePart(part, part === this.head));
    }

    makeNewHead() {
		var delta = directionChanges[this.direction];
		if(typeof delta === "undefined") return null;
		
		var newHead = {
			c: this.head.c + delta.c,
			r: this.head.r + delta.r
		};

		// wrap at borders
		newHead.c = (colCount + newHead.c) % colCount;
		newHead.r = (rowCount + newHead.r) % rowCount;

        this.parts.push(newHead);
    }

    advance() {
        this.makeNewHead();

        if (this.mustGrowBy > 0) {
            this.mustGrowBy = this.mustGrowBy - 1;
        } else {
            // delete tail
            this.parts.splice(0, 1);
        }
    }

    checkEatsTheApple() {
        if (this.head.c == apple.c && this.head.r == apple.r) {
            this.mustGrowBy = 2;
            this.score += this.parts.length;
            return true;
        }
        return false;
    }

    checkEatsHimself() {
		return this.parts.some(part => this.head !== part && this.head.c == part.c && this.head.r == part.r);
    }

    checkEatsSnake(snake) {
		return snake.parts.some(part => this.head.c == part.c && this.head.r == part.r);
    }

    checkKey(keyCode) {
		Object.keys(this.keys).
			filter(k => this.keys[k] === keyCode).
			forEach(k => this.direction = k);
    }

    makeSmall() {
        this.parts.splice(0, this.parts.length - 2);
    }
}

var snakes;
var apple;
function newGame() {
    snakes = [
        new Snake(
            ['rgba(0, 200, 0, 0.7)', 'rgba(100, 200, 100, 0.7)'],
            [
                { c: 1, r: 1 },
                { c: 2, r: 1 }
            ],
            RIGHT,
            {
                LEFT: 37,
                RIGHT: 39,
                UP: 38,
                DOWN: 40
            }),
        new Snake(
            ['rgba(0, 0, 200, 0.7)', 'rgba(100, 100, 200, 0.7)'],
            [
                { c: colCount - 2, r: rowCount - 2 },
                { c: colCount - 3, r: rowCount - 2 }
            ],
            LEFT,
            {
                LEFT: 81,
                RIGHT: 68,
                UP: 90,
                DOWN: 83
            })
    ];

    makeNewApple();
}

function drawApple() {
    context.fillStyle = 'red';
    context.fillRect(apple.c * square, apple.r * square, square, square);
}

function drawScore() {
    var scoreText = "";
    snakes.forEach((snake, i) => scoreText += "Score " + (i + 1) + ": " + snake.score + "   ")
    context.fillStyle = 'teal';
    context.font = '20px sans';
    context.fillText(scoreText, 2, 20);
}

function makeNewApple() {
    apple = {
        c: Math.round(Math.random() * (colCount - 1)),
        r: Math.round(Math.random() * (rowCount - 1))
    }
}

function draw(){
	context.clearRect(0, 0, canvas.width, canvas.height);

	drawApple();
    snakes.forEach(snake => snake.draw());
    drawScore();
}

function update(){
	snakes.forEach(snake => snake.advance());

	if (snakes.some(snake => snake.checkEatsTheApple())) {
		makeNewApple();
	}

	snakes.filter(snake => snake.checkEatsHimself()).
		forEach(snake => snake.makeSmall());

	snakes.forEach(snake => {
		snakes.filter(snake2 => snake2 !== snake && snake2.checkEatsSnake(snake)).
			forEach(snake3 => snake3.makeSmall());
	})
}

function gameStep() {
	update();
	draw();
}

var lastStepTime = 0;
function gameLoop(time) {
	if(lastStepTime === 0 || time - lastStepTime > 300){
		gameStep();
		lastStepTime = time;
	}

    window.requestAnimationFrame(gameLoop);
}

newGame();
window.requestAnimationFrame(gameLoop);

window.onkeydown = function (e) {
    snakes.forEach(snake => snake.checkKey(e.keyCode));
}
