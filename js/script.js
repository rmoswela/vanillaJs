
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

var score = 0;
var lives = 3;
var level = 0;

//define dimension for object that hits the ball
var paddleWidth = 200;
var paddleHeight = 25;
var paddleEdgeY = canvas.height - paddleHeight;
var paddleStartPointX = (canvas.width - paddleWidth) / 2;
var paddleStartPointY = paddleEdgeY;
var paddleMiddlePoint = canvas.height * 0.40;
var ballSpeed = 5;

//keyhook properties
var rightPress = false;
var leftPress = false;
var upPress = false;
var downPress = false;

//define dimentions of the bricks
var brickRowCount = 8;
var brickColumnCount = 6;
var brickWidth = 132;
var brickHeight = 30;
var brickPadding = 20;
var brickOffsetTop = 40;
var brickOffsetLeft = 40;

//initialize bricks
var bricks = [];
for (col = 0; col < brickColumnCount; col++){
	bricks[col] = [];
	for (row = 0; row < brickRowCount; row++) {
		bricks[col][row] = { x: 0, y: 0, status: 1 };
	}
}

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

	//top and bottom boundaries
	if (y + dy < 0){
		dy = -dy;
		color = ballColors[Math.floor(Math.random() * (ballColors.length - 1) + 0)];
	}
	//logic for the ball to bounce off the paddle that is at any height
	else if ((x > paddleStartPointX && x < (paddleStartPointX + paddleWidth)) && (paddleStartPointY - y) < 5 && (paddleStartPointY - y > 0)){
		dy = -dy;
		color = ballColors[Math.floor(Math.random() * (ballColors.length - 1) + 0)];

		//making the ball move faster
		/*ballSpeed < 0 ? ballSpeed = 10 : ballSpeed--;
		console.log("interval: " + interval)
		var interval = setInterval(draw, ballSpeed);
		clearInterval(interval);
		/*console.log("x: " + x);
		console.log("paddleStartPointX: " + paddleStartPointX);
		console.log("paddleWidth and x: " + (paddleStartPointX+paddleWidth));
		console.log("paddleStartPointY: " + paddleStartPointY);
		console.log("y: " + y);
		console.log("ballSpeed: " + ballSpeed);*/
	}
	else if (y + dy > canvas.height){
		lives--;
		if (!lives){
			//no lives game over
			alert("GAME OVER!!!\nSCORE: " +score);
			document.location.reload();
			clearInterval(interval);
		}
		else{
			//restart the ball and paddle from initial position
			x = canvas.width/2;
			y = canvas.height-30;
			dx = 2;
			dy = -2;
			paddleStartPointX = (canvas.width-paddleWidth)/2;
			paddleStartPointY = paddleEdgeY;
		}
	}
}

function collisionDetection(){
	for (col=0; col < brickColumnCount; col++){
		for (row=0; row < brickRowCount; row++){
			var b = bricks[col][row];
			if (b.status == 1){
				//collision of brick and ball change direction and destroy brick
				if (x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
					dy = -dy;
					b.status = 0;
					score++;
					color = ballColors[Math.floor(Math.random() * (ballColors.length - 1) + 0)];
					if (score == brickRowCount * brickColumnCount){
						alert("CONGRATULATIONS, YOU WON!!!\nSCORE: " + score);
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawLives(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Lives: " +lives, canvas.width-65, 15);
}

function drawScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Score: "+score, 8, 15);
}

function drawLevels(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "white";
	ctx.fillText("Level: "+level, 8, 32);
}

function drawBall() {

	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle(){

	ctx.beginPath();
	ctx.rect(paddleStartPointX, paddleStartPointY, paddleWidth, paddleHeight);
	ctx.fillStyle = "white";
	ctx.fill();
	ctx.closePath();
}

function drawBricks(){
	for (col=0; col < brickColumnCount; col++){
		for (row=0; row < brickRowCount; row++){
			if (bricks[col][row].status == 1){
				var brickX = (row*(brickWidth+brickPadding) + brickOffsetLeft);
				var brickY = (col*(brickHeight+brickPadding) + brickOffsetTop);
				bricks[col][row].x = brickX;
				bricks[col][row].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function draw(){
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawScore();
	drawLives();
	drawLevels();
	drawBall();
	drawPaddle();
	collisionDetection();
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

//logic for paddle movement mouse click event
function mouseMoveHandler(e){
	var relativeX = e.clientX - canvas.offsetLeft;
	var relativeY = e.clientY - canvas.offsetTop;
	if (relativeX > 0 && relativeX < canvas.width && relativeY > paddleMiddlePoint && relativeY < paddleEdgeY){
		paddleStartPointX = relativeX - paddleWidth/2;
		paddleStartPointY = relativeY;
	}
}

//keyhook event listeners
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//mouse event listeners
document.addEventListener("mousemove", mouseMoveHandler, false);

//redraw after set time
var interval = setInterval(draw, ballSpeed);
//draw();
//requestAnimationFrame(draw);