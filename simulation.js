var renderer;
var sim;
var balls = [];
var numBalls = 50;
var height = 800;
var width = 600;
var gravity = vec2.fromValues(0,8.0);
var dt = 0.05;
var r = 30;
var xRes = Math.ceil(width / (2 * r));
var yRes = Math.ceil(height / (2 * r));
var k = 15;
var run = 1;

function Ball(){
  this.p = vec2.fromValues(Math.random()*(width-r*2)+r, Math.random()*(height-r*2)+r);
  this.v = vec2.fromValues(0,0);
  this.a = vec2.fromValues(0,0);
  this.a0 = vec2.fromValues(0,0);
  this.rgb = vec3.fromValues(Math.round(Math.random()*224+32),Math.round(Math.random()*224+32),Math.round(Math.random()*224+32));
  this.color = "rgb(" + this.rgb[0] + "," + this.rgb[1] + "," + this.rgb[2] + ")";
}

function Simulation(){
  var grid = function(){
    var grid = [];
    for(var i=0; i<xRes; i++){
      grid.push([]);
      for(var j=0; j<yRes; j++){
        grid[i].push([]);
      }
    }
    return grid;
  }();

  function integrateEuler(ball){
    vec2.add(ball.v,ball.v,vec2.scale(vec2.create(),ball.a,dt));
    var damper = 1-Math.atan(vec2.length(ball.v)/5000)/(Math.PI/2);
    vec2.scale(ball.v,ball.v,damper);
    vec2.add(ball.p,ball.p,vec2.scale(vec2.create(),ball.v,dt));
    vec2.set(ball.a,0,0);
  }

  function integrateVelVerlet(ball){
  	var a0 = ball.a0;
  	var a = ball.a;
  	var v = ball.v;
  	var p = ball.p;
  	vec2.add(p,p,vec2.add(vec2.create(),vec2.scale(vec2.create(),v,dt),vec2.scale(vec2.create(),a0,dt*dt*0.5)));
  	vec2.add(v,v,vec2.scale(vec2.create(),vec2.add(vec2.create(),a,a0),0.5*dt));
  }
  
  this.update = function(){
  	for(var i=0; i< balls.length; i++){
  		vec2.copy(balls[i].a0,balls[i].a);
  		vec2.set(balls[i].a,0,0);
  	}
    addGravity();
    checkCollisions();
    moveBalls();
  }
  function moveBalls(){
    for(var i=0; i<balls.length; i++){
      integrateEuler(balls[i]);
    }
  }
  function checkCollisions(){
    checkBallCollisions(balls);
    checkBoundaryCollisions(balls);
  }
  function checkBallCollisions(){
    buildGrid();
    for(var i=0; i<balls.length; i++){
      balls[i].neighbors = getNeighbors(i);
      addForces(i);
    }
    resetGrid();
  }
  function addForces(i,a){
    for(var j=0; j<balls[i].neighbors.length; j++){
      var n = balls[i].neighbors[j];
      var span = vec2.sub(vec2.create(),balls[i].p,balls[n].p);
      var dist = vec2.length(span);
      vec2.normalize(span,span);
      if(dist < r*2){
        var eq = r*2 - dist;
        vec2.add(balls[i].a,balls[i].a,vec2.scale(vec2.create(),span,eq*k));
        vec2.add(balls[n].a,balls[n].a,vec2.scale(vec2.create(),span,-eq*k));
      }
    }
  }

  function resetGrid(){
    for(var i=0; i<grid.length;i++){
      for(var j=0; j<grid[i].length;j++){
        if(grid[i][j].length){
          grid[i][j]=[];
        }
      }
    }
  }

  function buildGrid(){
    for(var i=0; i < balls.length; i++){
      var coords = getCoords(i);
      var x = coords[0];
      var y = coords[1];
      if(y >= 0 && x >= 0 && y < yRes && x < xRes){
        grid[x][y].push(i);
      }
    }
  }

  function getCoords(i){
    var x = balls[i].p[0];
    var y = balls[i].p[1];
    return [Math.floor((x/width) * xRes),Math.floor((y/height) * yRes)];
  }

  function getNeighbors(b){
    var neighbors = [];
    var coords = getCoords(b);
    for(var i=coords[0]-1; i<coords[0]+2 && i<xRes; i++){
      for(var j=coords[1]-1; j<coords[1]+2 && j<yRes; j++){
        if(i>=0 && j>=0 ){
          var cell = grid[i][j];
          for(var k=0; k<cell.length; k++){
            if(cell[k] != b){
              neighbors.push(cell[k]);
            }
          }
        }
      }
    }
    return neighbors;
  }

  function checkBoundaryCollisions(){
    for(var i=0; i<balls.length; i++){
      var x = balls[i].p[0];
      var y = balls[i].p[1];
      if(x <= r){
        balls[i].v[0] = Math.abs(balls[i].v[0]);
        balls[i].a[0] += (r - x)*k;
      }
      if(x >= width-r){
        balls[i].v[0] = -Math.abs(balls[i].v[0]);
        balls[i].a[0] += ((width-r) - x)*k;
      }
      if(y >= height-r){
        balls[i].v[1] = -Math.abs(balls[i].v[1]);
        balls[i].a[1] += ((height-r) - y)*k;
      }
    }
  }     

  function addGravity(){
    for(var i = 0; i < balls.length; i++){
      vec2.add(balls[i].a, balls[i].a, gravity);
    }
  }
}

function startSim(){
  for(var i=0; i< numBalls; i++){
    balls.push(new Ball());
  }
  renderer = new Renderer(width, height);
  sim = new Simulation();
  animate();
}

function animate(){
  window.requestAnimationFrame(animate)
  if(run > 0){
   sim.update(balls);
   renderer.drawBalls(balls);
  }
};
