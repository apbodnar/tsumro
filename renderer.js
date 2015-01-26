//babymen use three.js

function Renderer(){
  var canvas = document.getElementById("c");
  canvas.width = 800;
  canvas.height = 1000;
  this.ctx = canvas.getContext("2d");
  this.drawBalls = function(balls){
    var ctx = this.ctx;
    ctx.fillStyle = "#00ff00"
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fill();
    ctx.fillStyle = "#ff0000"
    ctx.strokeStyle = "#000000"
    for(var i=0; i< balls.length; i++){
      balls[i].draw(ctx);
    }
  }
}