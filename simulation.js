var renderer;
var sim;
var balls = [];
var numBalls = 200;
var height = 800;
var width = 600;
var gravity = vec2.fromValues(0,8.0);
var dt = 0.1;
var r = 10;
var k = 15;
var grid = [[]];

function Ball(){
	this.p = vec2.fromValues(Math.random()*(width-r*2)+r, Math.random()*(height-r*2)+r);
	this.v = vec2.fromValues(0,0);
  this.a = vec2.fromValues(0,0);
	this.move = function(){
    vec2.add(this.v,this.v,vec2.scale(vec2.create(),this.a,dt));
    var damper = 1-Math.atan(vec2.length(this.v)/10000)/(Math.PI/2);
    vec2.scale(this.v,this.v,damper);
    vec2.add(this.p,this.p,vec2.scale(vec2.create(),this.v,dt));
    vec2.set(this.a,0,0);
	};
	this.draw = function(ctx){
		ctx.beginPath();
		ctx.arc(this.p[0],this.p[1],r,0,Math.PI*2);
		ctx.fill();
		ctx.stroke();
	}
}

function Simulation(){
   var grid = function(){
    var grid = [];
    var xRes = Math.ceil(width / (2 * r));
    var yRes = Math.ceil(height / (2 * r));
    for(var i=0; i<xRes; i++){
      grid.push([]);
      for(var j=0; j<yRes; j++){
        grid[i].push({});
      }
    }
    return grid;
  }();
  
  this.update = function(balls){
  	addGravity(balls);
    checkCollisions(balls);
    moveBalls(balls);
  }
  function moveBalls(balls){
    balls.forEach(function(ball){ ball.move(); })
  }
  function checkCollisions(balls){
		checkBallCollisions(balls);
		checkBoundaryCollisions(balls);
  }
  function checkBallCollisions(balls){
    buildGrid(balls);
  	for(var i=0; i<balls.length; i++){
  		for(var j=0; j<balls.length; j++){
  			if(i === j) continue;
  			var span = vec2.sub(vec2.create(),balls[i].p,balls[j].p);
  			var dist = vec2.length(span);
  			vec2.normalize(span,span);
  			if(dist < r*2){
  				var eq = r*2 - dist;
  				vec2.add(balls[i].a,balls[i].a,vec2.scale(vec2.create(),span,eq*k));
  				vec2.add(balls[j].a,balls[j].a,vec2.scale(vec2.create(),span,-eq*k));
  			}
  		}
  	}
  }

  function buildGrid(balls){
    for(var i=0; i < balls.length; i++){
      var x = balls[i].p[0];
      var y = balls[i].p[1];
      var xi = Math.floor((x/width) * (r*2));
      var yi = Math.floor((y/height) * (r*2));
      if(yi <= 0 && xi <= 0){
        grid[xi][yi][""+i] = true;
      }
    }
  }

  function getCoords(i){
      var x = balls[i].p[0];
      var y = balls[i].p[1];
      var xi = Math.floor((x/width) * (r*2));
      var yi = Math.floor((y/height) * (r*2));
      return [xi,yi];
  }

  function getNeighbors(){

  }; 

  function checkBoundaryCollisions(balls){
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
  function addGravity(balls){
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
	sim.update(balls);
	renderer.drawBalls(balls);
};
