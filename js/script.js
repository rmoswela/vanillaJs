
//grab reference of the canvas
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");

//ball start point and size property
var x = canvas.width / 2;
var y = canvas.height - 30;
var ballRadius = 20;

//direction of the ball
var dx =-2;
var dy =-2;

//ball color property
var ballColors = [	"navy", "red", "yellow", "blue", "purple", "brown", "black", "orange"];
var color = ballColors[0];

//define dimension for object that hits the ball
var paddleWidth = 200;
var paddleHeight = 25;
var paddleEdgeY = canvas.height - paddleHeight;
var paddleStartPointX = (canvas.width - paddleWidth) / 2;
var paddleStartPointY = paddleEdgeY;
var paddleMiddlePoint = canvas.height * 0.40;

//keyhook properties
var rightPress = false;
var leftPress = false;
var upPress = false;
var downPress = false;

function paddleBoundaries(){

	if (leftPress){
		paddleStartPointX -= 10;
		if (paddleStartPointX < 0){
			paddleStartPointX = 0;
		}
	}
	else if (rightPress){
		paddleStartPointX += 10;
		if (paddleStartPointX + paddleWidth > canvas.width){
			paddleStartPointX = canvas.width - paddleWidth;
		}
	}
	else if (upPress){
		paddleStartPointY -= 10;
		if (paddleStartPointY < paddleMiddlePoint){
			paddleStartPointY = paddleMiddlePoint;
		}
	}
	else if (downPress){
		paddleStartPointY += 10;
		if (paddleStartPointY > paddleEdgeY){
			paddleStartPointY = paddleEdgeY;
		}
	}
}

function ballBoundaries(){

	//left and right boundaries
	if (x + dx < 0 || x + dx > canvas.width){
		dx = -dx;
		color = ballColors[Math.floor(Math.random() * (ballColors.length - 1) + 0)];
	}

			console.log("x: " + x);
		console.log("pad: " + paddleStartPointX);

	//top and bottom boundaries
	if (y + dy < 0){
		dy = -dy;
		color = ballColors[Math.floor(Math.random() * (ballColors.length - 1) + 0)];
	}
	else if ((x+paddleWidth/2 > paddleStartPointX && x*paddleWidth/2 < (paddleStartPointX + paddleWidth)) && y + dy > paddleStartPointY){
		dy = -dy;
		color = ballColors[Math.floor(Math.random() * (ballColors.length - 1) + 0)];
	}
	else if (y + dy > canvas.height){
		alert("GAME OVER!!!");
		document.location.reload();
		clearInterval(interval); 
	}
}

function drawBall() {

	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function paddleDraw(){

	ctx.beginPath();
	ctx.rect(paddleStartPointX, paddleStartPointY, paddleWidth, paddleHeight);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function draw(){
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBall();
	paddleDraw();
	ballBoundaries();
	paddleBoundaries();

	x +=dx;
	y +=dy;
}

//logic for button press events
function keyDownHandler(e){

	if (e.key == "Right" || e.key == "ArrowRight"){
		rightPress = true;
	}
	else if (e.key == "Left" || e.key == "ArrowLeft"){
		leftPress = true;
	}
	else if (e.key == "Up" || e.key == "ArrowUp"){
		upPress = true;
	}
	else if (e.key == "down" || e.key == "ArrowDown"){
		downPress = true;
	}
}

//logic for button release events
function keyUpHandler(e){

	if (e.key == "Right" || e.key == "ArrowRight"){
		rightPress = false;
	}
	else if (e.key == "Left" || e.key == "ArrowLeft"){
		leftPress = false;
	}
	else if (e.key == "Up" || e.key == "ArrowUp"){
		upPress = false;
	}
	else if (e.key == "down" || e.key == "ArrowDown"){
		downPress = false;
	}
}

//keyhook event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//redraw after set time
var interval = setInterval(draw, 10);