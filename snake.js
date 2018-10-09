var ansi = require('ansi')
  ,keypress = require('keypress')
  ,random = require('random')
  ,cursor = ansi(process.stdout)
  ,height = 20
  ,width = 60
  ,snakePosX = (width-2)*0.5
  ,snakePosY = (height-2)*0.5
  ,appleWidth = (height)*0.5
  ,appleHeight = (height)*0.5
  ,direction = 4
  ,points = 0
  ,speed = 1;

process.stdout.write('\x1B[?25l');
keypress(process.stdin); 
// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
    if (key.name == 'escape') {
      gameOver();
    }
    if(key.name == 'right') {
      direction = 4;
    }
    if(key.name == 'left') {
      direction = 3;
    }
    if (key.name == 'up') {
      direction = 1;
    }
    if (key.name == 'down') {
      direction = 2;
    }
    if (key && key.ctrl && key.name == 'c') {
      cursor.reset();
      process.stdin.pause();
    }
  });

process.stdin.setRawMode(true);
process.stdin.resume();


drawField();
drawStatus();
drawApple();
game();




function game() {
  drawSnake();
  setTimeout(game, 1000/speed);
}


function drawField() {
  horizontalLines();
  for(var i=0;i<height-2;i++) {
    verticalLines();
  }
  horizontalLines();
  cursor.reset().write('\n');
}


function horizontalLines() {
  setCursorColor();
  for(var i=0;i<width;i++) {
    cursor.write(' ');
  }
  cursor.write('\n');
}

function verticalLines() {
  cursor
    .write(' ');
    setCursorBackground();
  for(var i=0;i<width-2;i++) {
    cursor.write(' ');
  }
  setCursorColor();
  cursor.write(' \n');
}

function setCursorColor() {
  cursor
    .bg.grey()
    .grey();
}

function setCursorBackground() {
  cursor
    .bg.white()
    .white();
}

function drawApple() {
  appleWidth = random.int(min=2,max=width-1);
  appleHeight = random.int(min=2,max=height-1);
  if(appleWidth == snakePosX && appleHeight == snakePosY) {
    drawApple();
    return;
  }
  cursor.goto(appleWidth,appleHeight).red().bg.red().write(' ');
}

function removeApple() {
 cursor.goto(appleWidth,appleHeight).white().bg.white().write(' ');
}

function drawSnake() {
  removeSnake();
  switch(direction) {
    case 1: snakePosY-=1;break;
    case 2: snakePosY+=1;break;
    case 3: snakePosX-=1;break;
    case 4: snakePosX+=1;break;
  }
  if (snakePosX<2 || snakePosX > width-1 || snakePosY<2 || snakePosY > height-1) {
    gameOver();
  }
  cursor
    .bg.green()
    .green()
    .goto(snakePosX,snakePosY)
    .write(' ');
  if (snakePosX==appleWidth && snakePosY==appleHeight) {
    points++;
    if(speed<20) {
      speed++;
    }
   
    drawStatus();
    drawApple();
  }
}

function removeSnake() {
  cursor.goto(snakePosX,snakePosY).white().bg.white().write(' ');
}

function gameOver() {
  removeApple();
  removeSnake();
  cursor.goto((width-6)*0.5,(height-1)*0.5).bg.grey().black().write('GAME OVER');
  cursor.reset();
  cursor.goto(0,height+2);
  cursor.write('\n');
  cursor.goto(0,height+3);
  process.exit(0);
}

function drawStatus() {
  cursor.goto(0,height+1).reset().write('Points: ' + points);
  cursor.goto(0,height+2).reset().write('Speed: '+speed);
}