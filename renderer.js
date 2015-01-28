//babymen use three.js

function Renderer(width, height){
  var canvas = document.getElementById("c");
  canvas.width = width;
  canvas.height = height;
  this.ctx = canvas.getContext("2d");
  this.drawBalls = function(balls){
    var ctx = this.ctx;
    ctx.fillStyle = "#ddd"
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fill();
    ctx.fillStyle = "#ff0000"
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 3;
    balls.forEach(function(ball){ ball.draw(ctx); })
  };
}