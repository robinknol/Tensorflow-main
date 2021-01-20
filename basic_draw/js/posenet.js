let posenetOk = false;

const screenWidth = screen.width;
const screenHeight = screen.height;
const canvas2 = document.getElementById('canvas2');
canvas2.style.zIndex = 1;
let ctx2 = canvas2.getContext('2d');
let pose;//debug global
let showVideoStream = true; // show video on / off
let videoStreamAlpha = 0.4; // opacity of video stream

function setupContext()
{
  canvas2.width = screenWidth;
  canvas2.height = screenHeight;
  ctx2.translate(screenWidth, 0); // flip screen horizontal
  ctx2.scale(-1, 1); // flip screen horizontal
}

async function start()
{
  setupContext();
  //https://github.com/tensorflow/tfjs-models/tree/master/posenet
  const net = await posenet.load(
  {
    architecture: 'MobileNetV1',
    outputStride: 16,
    //inputResolution: { width: 640, height: 480 },
    multiplier: 0.5 // 0.75
    //outputstride 32 lower resolution = higher speed
  });

  let video;
  try
  {
    video = await loadVideo();
  }
  catch (e)
  {
    console.error(e);
    return;
  }
  detectPoseInRealTime(video, net);
}

function detectPoseInRealTime(video, net)
{
  async function poseDetectionFrame()
  {
    //pose = await net.estimateSinglePose(video, 0.5, false, 16);
    pose = await net.estimateSinglePose(video,
    {
      //flipHorizontal: false
    });
  showSkeleton(pose);
  requestAnimationFrame(poseDetectionFrame);
  }
  poseDetectionFrame();
}

async function loadVideo()
{
  const video = await setupCamera();
  video.play();
  return video;
}

async function setupCamera()
{
  const video = document.getElementById('video');
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
  {
    const stream = await navigator.mediaDevices.getUserMedia(
    {
      'audio': false,
      'video':
      {
        width: screenWidth,
        height: screenHeight
      }
    });

    video.width = screenWidth;
    video.height = screenHeight;
    video.srcObject = stream;
    return new Promise(resolve =>
      {
      video.onloadedmetadata = () =>
      {
        resolve(video);
      };
    });
  }
  else
  {
    const errorMessage = "This browser does not support video capture, or this device does not have a camera";
    alert(errorMessage);
    return Promise.reject(errorMessage);
  }
}


function showSkeleton(poseArray)
{
  ctx2.clearRect(0, 0, screenWidth, screenHeight);
  // show video stream
  if(showVideoStream)
  {
    ctx2.globalAlpha = videoStreamAlpha; // opacity
    ctx2.drawImage(video, 0, 0, screenWidth, screenHeight);
  }

  //left ear index 3 right ear index 4. left eye 1  right eye 2 nose 0
  //full table: https://www.tensorflow.org/lite/models/pose_estimation/overview

  if(poseArray.keypoints[0].score>0.8)
  {// see the nose? pobability > 80%
    posenetOk = true; // start controlling
    // nose index 0, left eye index 1, right eye index 2  left ear index 3, right ear index 4.  

    // show nose, left eye & right eye
    ellipse(poseArray.keypoints[0].position, 30, 'blue'); // coordinates nose, draw circle    
    ellipse(poseArray.keypoints[1].position, 20, 'green'); // coordinates leftEye, draw circle
    ellipse(poseArray.keypoints[2].position, 20, 'red'); // coordinates rightEye, draw circle

    
    
    drawPosenet(poseArray.keypoints[0].position); // communicate position nose to game
    drawTriangle(poseArray.keypoints); // communicate to second game
  }
  else
  {
    posenetOk = false; // stop controlling
  }
}

//draw a circle
const ellipse = ( XY, radius, color) =>
{
  //XY = object   { x: value, y: value }
  ctx2.fillStyle  =  color;
  ctx2.beginPath();
  ctx2.arc(XY.x, XY.y, radius, radius, 0, 2 * Math.PI);
  ctx2.fill();
}

function drawTriangle(XY)
{  
  //XY = object  
  ctx2.lineJoin = 'round';
  ctx2.lineCap = 'round';
  ctx2.lineWidth = 5;
  ctx2.strokeStyle = '#ff00ff';
  ctx2.beginPath();
  ctx2.moveTo( XY[0].position.x, XY[0].position.y)
  ctx2.lineTo( XY[1].position.x, XY[1].position.y )
  ctx2.stroke();
  ctx2.moveTo( XY[0].position.x, XY[0].position.y)
  ctx2.lineTo( XY[2].position.x, XY[2].position.y )
  ctx2.stroke();    
}

start();
