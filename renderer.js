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
    balls.forEach(function(ball,i){ ball.draw(ctx); })
    ctx.fill();
  };
}