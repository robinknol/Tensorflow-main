let speechAPI;
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // speech recognition API supported
    speechAPI = true;
  } else {
    // speech recognition API not supported
    speechAPI = false;
    console.log("Speech API is not supported by this browser, use Chrome or Edge");

  }
let myRec = new p5.SpeechRec('en-US', parseResult); // new P5.SpeechRec object
myRec.continuous = true; // do continuous recognition
myRec.interimResults = true; // allow partial recognition (faster, less accurate)

let x, y;
let dx, dy;

function setup()
{
    // graphics stuff:
    createCanvas(800, 600);
    background(220,220,220);
    fill(0, 0, 0, 255);
    x = width/2;
    y = height/2;
    dx = 0;
    dy = 0;

    // instructions:
    textSize(20);
    textAlign(LEFT);
    if(speechAPI){
        text("voice controlled snake", 20, 20);
        text("commands: up, down, left, right, clear, stop", 20, 40);
    }
    else{
        text("Speech API is not supported by this browser, use Chrome or Edge",20,20);
    }

    //myRec.onResult = parseResult; // now in the constructor
    myRec.start(); // start engine
}

function draw()
{
    ellipse(x, y, 5, 5);
    x+=dx;
    y+=dy;
    if(x<0) x = width;
    if(y<0) y = height;
    if(x>width) x = 0;
    if(y>height) y = 0;
}

function parseResult()
{
    // recognition system will often append words into phrases.
    // so hack here is to only use the last word:
    let mostrecentword = myRec.resultString.split(' ').pop();
    if(mostrecentword.indexOf("left")!==-1) { dx=-1;dy=0; }
    else if(mostrecentword.indexOf("right")!==-1) { dx=1;dy=0; }
    else if(mostrecentword.indexOf("yellow")!==-1) { dx=0;dy=-1; }
    else if(mostrecentword.indexOf("up")!==-1) { dx=0;dy=-1; }
    else if(mostrecentword.indexOf("yellow")!==-1) { dx=0;dy=-1; }
    else if(mostrecentword.indexOf("down")!==-1) { dx=0;dy=1; }
    else if(mostrecentword.indexOf("stop")!==-1) { dx=0;dy=0; }
    else if(mostrecentword.indexOf("clear")!==-1) { setup(); }
    console.log(mostrecentword);
}