// Declaring HTML variable
let textHere = document.getElementById('textHere'); // display data
let score = 0;
let goLeft = true;
let topLineX = 300;
let timer = 5;

const canvas1 = document.getElementById('canvas1');
const ctx1 = canvas1.getContext('2d');

let point1 = new Point(new Vector2d(1500, 350), 30);
let point2 = new Point(new Vector2d(50, 350), 30);
// Canvas 1

canvas1.style.zIndex = 2;
canvas1.width = screen.width;
canvas1.height = screen.height;
canvas1.style.zIndex = 2;

ctx1.translate(screen.width, 0); // flip screen horizontal
ctx1.scale(-1, 1); // flip screen horizontal

ctx1.lineJoin = 'round';
ctx1.lineCap = 'round';
ctx1.lineWidth = 5;
ctx1.strokeStyle = '#ac0000';

let isDrawing = false;
let lastX = 0;
let lastY = 0;

const clearDrawing = () =>
{
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
}

// Canvas 2

canvas2.addEventListener('mousedown', () => isDrawing = true);
canvas2.addEventListener('mouseup', () => isDrawing = false);

function drawPosenet(XY)
{
  point1.draw(ctx2);
  point2.draw(ctx2);
  ctx2.fillRect(0, point1.pos.dy + 50, canvas1.width, 10);
  ctx2.fillRect(0, point1.pos.dy - 50, canvas1.width, 10);
  //XY = object   { x: value, y: value }
  let X = Math.floor(XY.x);
  let Y = Math.floor(XY.y);
  // textHere.innerHTML = Math.floor(XY.x) + " " + Math.floor(XY.y) + " Score: " + score;
  textHere.innerHTML = X + " " + Y + " Score: " + score;// + " " + timer;
  
  if (Y <= point2.pos.dy + point2.radius && Y >= point2.pos.dy - point2.radius)
  {
    if(X <= point1.pos.dx + point1.radius && X >= point1.pos.dx - point1.radius && goLeft == true)
    {
      score += 1;
      goLeft = false;
    }
    if(X <= point2.pos.dx + point2.radius && X >= point2.pos.dx - point2.radius && goLeft == false)
    {
      score += 1;
      goLeft = true;
    }
  }
  
  console.log(timer);
  if (Y > point1.pos.dy + 50 || Y < point1.pos.dy - 50 )
  {
    score -= 1;
  }
  if (score < 0)
  {
    
    score = 0;
  }

  // stop the function if not mouse down
  if(!isDrawing) return;
 
  //console.log(XY);
  ctx1.beginPath();
  ctx1.moveTo(lastX, lastY);
  ctx1.lineTo(XY.x,XY.y);
  ctx1.stroke();
  [lastX, lastY] = [XY.x, XY.y];
}

