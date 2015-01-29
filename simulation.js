var renderer;
var sim;
var balls = [];
var numBalls = 400;
var height = 800;
var width = 600;
var gravity = vec2.fromValues(0,8.0);
var dt = 0.1;
var r = 10;
var xRes = Math.ceil(width / (2 * r));
var yRes = Math.ceil(height / (2 * r));
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
    for(var i=0; i<xRes; i++){
      grid.push([]);
      for(var j=0; j<yRes; j++){
        grid[i].push([]);
      }
    }
    return grid;
  }();
  
  this.update = function(){
  	addGravity(balls);
    checkCollisions(balls);
    moveBalls(balls);
  }
  function moveBalls(){
    balls.forEach(function(ball){ ball.move(); })
  }
  function checkCollisions(){
		checkBallCollisions(balls);
		checkBoundaryCollisions(balls);
  }
  function checkBallCollisions(){
    buildGrid();
  	for(var i=0; i<balls.length; i++){
  		var neighbors = getNeighbors(i);
  		for(var j=0; j<neighbors.length; j++){
  			var n = neighbors[j];
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
  	resetGrid();
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

  console.log(grid);

  function getCoords(i){
    var x = balls[i].p[0];
    var y = balls[i].p[1];
    var xi = Math.floor((x/width) * xRes);
    var yi = Math.floor((y/height) * yRes);
    return [xi,yi];
  }

  function getNeighbors(b){
  	var neighbors = [];
  	var coords = getCoords(b);
    for(var i=coords[0]-1; i<coords[0]+2 && i<xRes; i++){
			for(var j=coords[1]-1; j<coords[1]+2 && j<yRes; j++){
				if(i>=0 && j>=0 ){
					var cell = grid[i][j];
					for(var k=0; k<cell.length; k++){
						if(k != b){
							neighbors.push(k);
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
	sim.update(balls);
	renderer.drawBalls(balls);
};
