console.clear();

// ----------------------------------------------
// Do not modify this code.
// ----------------------------------------------

let canvas = document.getElementById("game");
let context2d = canvas.getContext("2d");
let pacman_model = null;
let snack_pellets = null;
let time_index = 0;
let key = null;
let radius = 20; 
let displacement = 5;
let score = 0;
let paused = true;
let x_pacman = 0;
let y_pacman = 0; 
let walls = null; //NEW

function createWalls() {//NEW
  walls = [
    { x: 45, y: 65, width: 110, height: 15 },
    { x: 265, y: 95, width: 20, height: 160 }
    // add more if needed
  ];
}

function collidesWithWall(x, y) { //NEW
  for (let wall of walls) {
    if (x + radius > wall.x &&
        x - radius < wall.x + wall.width &&
        y + radius > wall.y &&
        y - radius < wall.y + wall.height) {
      return true;
    }
  }
  return false;
}

function hypotenus( a, b ) {
  return Math.sqrt( Math.pow( a, 2 ) + Math.pow(  b, 2 ) );
}

function createSnackPellets() { 
  let index = 0;
  let pellet_radius = 3;
  let space = 25;
  let path = null; 
  
  for ( let y_pellet = space; y_pellet < canvas.height; y_pellet+= space ) {
  
    for ( let x_pellet = space; x_pellet < canvas.width; x_pellet+= space ) {
    
      if ( hypotenus( ( x_pellet - canvas.width/2 ), ( y_pellet - canvas.height/2 ) )  >  ( radius + space/2 ) ) {
      
        path = new Path2D();
        path.arc( x_pellet, y_pellet, pellet_radius, 0, 2*Math.PI );
        snack_pellets[index++] = { x: x_pellet, y: y_pellet, circle:path };
      }
     
    }
    
  }
  
}

function createModel() {

  pacman_model[0] = new Path2D();
  pacman_model[0].moveTo( 0, 0 );
  pacman_model[0].arc( 0, 0, radius, 0, 2*Math.PI );
  pacman_model[0].lineTo( 0, 0 );
  
  pacman_model[1] = new Path2D();
  pacman_model[1].moveTo( 0, 0 );
  pacman_model[1].lineTo( radius*Math.cos( 25*Math.PI)/180, radius*Math.sin( 25*Math.PI)/180);
  pacman_model[1].arc( 0, 0, radius, 25*Math.PI/180, -25*Math.PI/180 );
  pacman_model[1].lineTo( 0, 0 );
  
  pacman_model[2] = new Path2D();
  pacman_model[2].moveTo( 0, 0 );
  pacman_model[2].lineTo( radius*Math.cos( 45*Math.PI/180), radius*Math.sin( 45*Math.PI/180));
  pacman_model[2].arc( 0, 0, radius, 45*Math.PI/180, -45*Math.PI/180 );
  pacman_model[2].lineTo( 0, 0 );
  
  pacman_model[3] = pacman_model[1];

}

// ----------------------------------------------
// Task 1: Todo - put JS code below.
// ----------------------------------------------

function startGame() {
  x_pacman = canvas.width/2;
  y_pacman = canvas.height/2;
  time_index = 0;
  score = 0;
  key = "ArrowRight";
  paused = true;
  createSnackPellets();
  createModel();
  createWalls();
}








// ----------------------------------------------
// Task 2: Todo - modify the JS code below.
// ----------------------------------------------
document.addEventListener( "keyup", keyEvent );

function keyEvent( event ) {
  if (event.key=='s'){
    startGame();
  }

  if (event.key==' '){
    paused=!paused;
  }

  if (!paused){
    key=event.key;
  }

  
}


// ----------------------------------------------
// Task 3: Todo - put JS code below.
// ----------------------------------------------

function draw(){
  const scoreEl = document.getElementById('score');
  scoreEl.innerText= "score: "+ String(score);
  context2d.clearRect(0,0,canvas.width,canvas.height);
  context2d.fillStyle = "black";
  context2d.strokeStyle = "black";
  context2d.save();
  let consumed_arr=[];
  for(let p=0;p<snack_pellets.length;p++){
    curr_p=snack_pellets[p];
    let hyp_calc=Math.abs(hypotenus((curr_p.x-x_pacman),(curr_p.y-y_pacman)));
    if (hyp_calc < (radius/2)){
      consumed_arr.push(true);
      score+=10;
    } else{
      consumed_arr.push(false);
    }
  }
  
  context2d.fillStyle='blue';
  for(let w=0;w<walls.length;w++){
    curr_w=walls[w];
    context2d.fillRect(curr_w.x,curr_w.y,curr_w.width,curr_w.height);
  }

  let right_check=Math.min((canvas.width-radius),x_pacman);
  x_pacman=Math.max(radius,right_check);
  let down_check=Math.min((canvas.height-radius),y_pacman);
  y_pacman=Math.max(radius,down_check);

  context2d.translate(x_pacman,y_pacman);

  if(!paused && (collidesWithWall(x_pacman,y_pacman)==false)){
    if (key=="ArrowRight"){
      context2d.scale(1,1);
      x_pacman+=displacement;
    } else if (key=="ArrowLeft"){
      context2d.scale(-1,1);
      x_pacman-=displacement;
    } else if (key=="ArrowDown"){
      context2d.rotate(Math.PI/2);
      y_pacman+=displacement;
    } else if (key=="ArrowUp"){
      context2d.rotate(-Math.PI/2);
      y_pacman-=displacement;
    }
  }
  
  context2d.fill(pacman_model[time_index]);
  context2d.stroke(pacman_model[time_index]);
  context2d.restore();
  time_index=(time_index+1)%4;

}













// ----------------------------------------------
// Task 4: Todo - put JS code below.
// ----------------------------------------------

startGame();
setTimeout(draw, 100);




