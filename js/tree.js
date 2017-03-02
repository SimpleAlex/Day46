var canvas = document.getElementById('canvas');
canvas.setAttribute('id', 'canvas');
document.body.appendChild(canvas);

var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var ctx = canvas.getContext('2d');

var branches = [];
var branchLength = 100,
branchWidth = 20,
branchAngle = 45,
branchSplitFactor = 0.75;

var order = 0,
maxOrder = 100;
var	branchColors = Gradient("#000","#000",maxOrder);

init();

function init() {
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = branchWidth;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  var trunk = {x : canvasWidth / 2, y : branchLength + 60, angle : 90 };
  branches.push(trunk);

  ctx.beginPath();
  ctx.moveTo(trunk.x, canvasHeight - 60);
  ctx.lineTo(trunk.x, canvasHeight - trunk.y);
  ctx.stroke();

  drawBranches(branchAngle);
}

function drawBranches(angle) {
  if (angle == undefined) {
    angle = branchAngle;
  }
  branchWidth = branchWidth * branchSplitFactor;
  branchLength = branchLength * branchSplitFactor;

  var newBranches = [];
  ctx.beginPath();
  ctx.lineWidth = branchWidth;

  for (var i=0; i < branches.length; i++) {
    var startPoint = branches[i];
    var endPoint1 = getEndPoint(startPoint.x, startPoint.y, startPoint.angle + angle, branchLength);
    var endPoint2 = getEndPoint(startPoint.x, startPoint.y, startPoint.angle - angle, branchLength);

    ctx.moveTo(startPoint.x, canvasHeight - startPoint.y);
    ctx.lineTo(endPoint1.x, canvasHeight - endPoint1.y);
    ctx.moveTo(startPoint.x, canvasHeight - startPoint.y);
    ctx.lineTo(endPoint2.x, canvasHeight - endPoint2.y);

    endPoint1.angle = startPoint.angle + angle;
    endPoint2.angle = startPoint.angle - angle;

    newBranches.push(endPoint1);
    newBranches.push(endPoint2);

  }

  branches = newBranches;
  ctx.stroke();

  if (branchLength > 10) {
    if (order > maxOrder) {
      order = maxOrder;
    }
    ctx.strokeStyle = branchColors[Math.floor(order)];
    order++;
  } else {
    ctx.strokeStyle = '#008000';
  }

  if (branchLength > 2) {
    window.setTimeout(drawBranches, 60);
  }
}

window.addEventListener('mousemove', function(e) {
  if (branchLength < 1) return false;
});

canvas.addEventListener('click', function(e) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  branches = [];
  branchLength = randomRange(160, 180);
  branchWidth = randomRange(8, 14);
  branchAngle = randomRange(20, 60);
  branchSplitFactor = randomDecimalRange(0.70, 0.77);

  order = 0;
  maxOrder = 100;
  branchColors = Gradient("#000","#000",maxOrder);

  init();

});

function getEndPoint(x, y, angle, length) {
  return {
    x : x + length * Math.cos(angle * Math.PI / 180),
    y : y + length * Math.sin(angle * Math.PI / 180)
  };
}

function getAngle(x){
  return  parseInt(1 + 89 * x /canvasWidth);
}

function randomRange(min, max) {
  return ~~(Math.random() * (max - min + 1)) + min;
}

function randomDecimalRange(min, max) {
  return Math.random() * (max - min) + min;
}

function Gradient(stop1_hex, stop2_hex, num){
  stop1_hex = stop1_hex.replace("#","").toUpperCase();
  stop2_hex = stop2_hex.replace("#","").toUpperCase();

  var stops = new Array(num),
  stop1_rgb = {r:0,g:0,b:0},
  stop2_rgb = {r:0,g:0,b:0},
  steps = {r:0,g:0,b:0},
  i,r,g,b;

  stop1_rgb.r = parseInt(stop1_hex.substr(0,2),16);
  stop1_rgb.g = parseInt(stop1_hex.substr(2,2),16);
  stop1_rgb.b = parseInt(stop1_hex.substr(4,2),16);

  stop2_rgb.r = parseInt(stop2_hex.substr(0,2),16);
  stop2_rgb.g = parseInt(stop2_hex.substr(2,2),16);
  stop2_rgb.b = parseInt(stop2_hex.substr(4,2),16);

  steps.r = (stop2_rgb.r - stop1_rgb.r)/num;
  steps.g = (stop2_rgb.g - stop1_rgb.g)/num;
  steps.b = (stop2_rgb.b - stop1_rgb.b)/num;

  stops[0] = "#"+stop1_hex;

  for(i=1; i<num-1; i++){
    r = Math.round(stop1_rgb.r+(i*steps.r)).toString(16);
    g = Math.round(stop1_rgb.g+(i*steps.g)).toString(16);
    b = Math.round(stop1_rgb.b+(i*steps.b)).toString(16);

    r = (r.length != 2)?"0"+r:r;
    g = (g.length != 2)?"0"+g:g;
    b = (b.length != 2)?"0"+b:b;

    stops[i] = "#"+(r+g+b).toUpperCase();
  }

  stops[num-1] = "#"+stop2_hex;
  return stops;
}
