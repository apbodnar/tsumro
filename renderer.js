//babymen use three.js

function Renderer(width, height){
  var canvas = document.getElementById("c");
  canvas.width = width;
  canvas.height = height;
  this.ctx = canvas.getContext("2d");
  this.drawBalls = function(balls){
    var ctx = this.ctx;
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for(var i=0; i< balls.length; i++){
      drawBall(balls[i],ctx);
    }
  }
  function drawBall(ball,ctx){
    ctx.beginPath();
    ctx.fillStyle = ball.color;
    ctx.arc(ball.p[0],ball.p[1],r,0,Math.PI*2);
    ctx.fill();
  }
}