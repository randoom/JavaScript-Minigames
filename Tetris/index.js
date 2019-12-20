// @ts-check
/** @type {HTMLCanvasElement} */
// @ts-ignore
var canvas = document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var squareSize;
var colCount = 10,
	rowCount = 24;

var rawPieces = {
	"I": {
		size: 4,
		rawSquares:
			"    " +
			"oooo" +
			"    " +
			"    "
	},
	"J": {
		size: 3,
		rawSquares:
			"o  " +
			"ooo" +
			"   "
	},
	"L": {
		size: 3,
		rawSquares:
			"  o" +
			"ooo" +
			"   "
	},
	"O": {
		size: 2,
		rawSquares:
			"oo" +
			"oo"
	},
	"S": {
		size: 3,
		rawSquares:
			" oo" +
			"oo " +
			"   "
	},
	"Z": {
		size: 3,
		rawSquares:
			"oo " +
			" oo" +
			"   "
	},
	"T": {
		size: 3,
		rawSquares:
			" o " +
			"ooo" +
			"   "
	}
}

function drawSquare(c, r, color)
{
	context.fillStyle = color;
	context.fillRect(c * squareSize, r * squareSize, squareSize, squareSize);
}

function drawPiece(pieceName, c, r, color)
{
	var piece = rawPieces[pieceName];

	for (var h = 0; h < piece.size; h++)
	{
		for (var w = 0; w < piece.size; w++)
		{
			if (piece.squares[h][w])
			{
				drawSquare(c + w, r + h, color);
			}
		}
	}
}

function draw()
{
	context.clearRect(0, 0, canvas.width, canvas.height);

	var i = 0;
	for (var n in rawPieces)
	{
		drawPiece(n, 1, i * 4, 'red');
		i++;
	}
}

function rotate(matrix)
{
	var n = matrix.length - 1;
	var result = matrix.map((row, i) =>
		row.map((_, j) => matrix[n - j][i])
	);
	return result;
}

function rotateRight(piece)
{
	return {
		size: piece.size,
		squares: rotate(piece.squares)
	};
}

function update()
{
	
}

function gameStep(dt)
{
	update();
	draw();
}

var lastStepTime = 0;
function gameLoop(time)
{
	gameStep(time - lastStepTime);
	lastStepTime = time;

	window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

window.onkeydown = function (e)
{

}

document.querySelectorAll("button").forEach(b =>
{
	b.ontouchstart = (e) => { e.preventDefault() };
	b.onclick = () => { };
});

function buildPieces()
{
	for (var n in rawPieces)
	{
		var piece = rawPieces[n];
		var width = piece.size;
		var height = piece.rawSquares.length / piece.size;

		piece.squares = [];
		for (var h = 0; h < height; h++)
		{
			var line = [];
			for (var w = 0; w < width; w++)
			{
				line.push(piece.rawSquares[h * width + w] === "o");
			}
			piece.squares.push(line);
		}
		delete piece.rawSquares;
	}
}

function newGame()
{
	buildPieces();
}

function resizeCanvas()
{
	var targetWidth = document.documentElement.clientWidth - 2;
	var targetHeight = document.documentElement.clientHeight - 80 - 2;
	squareSize = Math.min(Math.floor(targetWidth / colCount), Math.floor(targetHeight / rowCount));

	canvas.width = colCount * squareSize;
	canvas.height = rowCount * squareSize;
}

window.addEventListener('resize', () =>
{
	resizeCanvas();
	newGame();
});

resizeCanvas();
newGame();
