const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

let engine;
let world;
var ground, bridge;
var leftWall, rightWall;
var jointPoint;
var jointLink;
var zombie1, zombie2, zombie3, zombie4, sadzombie, sadzombie2;
var breakButton;
var backgroundImage;

var stones = [];
var collided = false;
var left = false;
var right = true;
var isGameover = false;
var isVictory = false;
var time = 61, timeX, timeY = 45, timeTextSize = 45;

function preload() {
  zombie1 = loadImage("./assets/zombie/zombie1.png");
  zombie2 = loadImage("./assets/zombie/zombie2.png");

  zombie3 = loadImage("./assets/zombie/zombie3.png");
  zombie4 = loadImage("./assets/zombie/zombie4.png");
  
  sadzombie = loadImage("./assets/zombie/sad_zombie.png");
  sadzombie2 = loadImage("./assets/zombie/sad_zombie2.png");

  backgroundImage = loadImage("./assets/background.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  timeX = windowWidth / 2;
  
  engine = Engine.create();
  world = engine.world;
  frameRate(80);
  
  ground = new Base(0, height - 10, width * 2, 20);
  leftWall = new Base(100, height - 300, 200, height / 2 + 100);
  rightWall = new Base(width - 100, height - 300, 200, height / 2 + 100);
  
  if(!isMobile && windowWidth > 1227){
    bridge = new Bridge(30, { x: 50, y: height / 2 - 140 });
    jointPoint = new Base(width - 250, height / 2 - 100, 40, 20);
    console.log(windowWidth);
  }else if(!isMobile && windowWidth <= 1227 && windowWidth > 566 || isMobile){
    bridge = new Bridge(15, { x: 50, y: height / 2 - 140 });
    jointPoint = new Base(width - 250, height / 2 - 100, 40, 20);
    console.log(windowWidth);
  }//else if(isMobile){
    //bridge = new Bridge(15, { x: 50, y: height / 2 - 140 });
    //jointPoint = new Base(width - 250, height / 2 - 100, 40, 20);
    //console.log(windowWidth);
  //}
  else if(!isMobile && windowWidth <= 566){
    //textAlign("center");
    //text("Desculpa, Sua Tela Do Computador Está Muito Pequena Para Jogar.", 
    //windowWidth / 2, windowHeight / 2);
    cantplay();
    bridge = new Bridge(15, { x: 50, y: height / 2 - 140 });
    jointPoint = new Base(width - 250, height / 2 - 100, 40, 20);
    var backgroundscreenerror = createSprite(windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
    backgroundscreenerror.shapeColor = "black";
    zombie = createSprite(width / 2, height - 100, 50, 50);
    zombie.visible = false;
    console.log(windowWidth);
  }
  else{

  }
  
  Matter.Composite.add(bridge.body, jointPoint);
  jointLink = new Link(bridge, jointPoint);

  for (var i = 0; i <= 8; i++) {
    var x = random(width / 2 - 200, width / 2 + 300);
    var y = random(-100, 100);
    var stone = new Stone(x, y, 80, 80);
    
    stones.push(stone);
  }
  if(!isMobile && windowWidth > 566){
    zombie = createSprite(width / 2, height - 100, 50, 50);
  }

  zombie.addAnimation("lefttoright", zombie1, zombie2, zombie1);
  zombie.addAnimation("righttoleft", zombie3, zombie4, zombie3);
  zombie.addImage("sad", sadzombie);
  zombie.addImage("sad2", sadzombie2);
  
  zombie.scale = 0.1;
  zombie.velocityX = 10;

  breakButton = createButton("");
  breakButton.position(width - 200, height / 2 - 50);
  breakButton.class("breakbutton");
  breakButton.mousePressed(handleButtonPress);
}

function draw() {
  background(backgroundImage);
  Engine.update(engine);
  if(time >= 0){
    //textSize(45);
    TimeDisplay();
    time = time - 0.014;//0.014
    //text(""+time, windowWidth / 2, 45);
  }
  if(isVictory == false){
    setTimeout(() => {
      if(isVictory == false){
        restart();
        isGameover = true;
      }
    }, 60000);
  }
  
  bridge.show();
  
  for (var stone of stones) {
    stone.show();
    //stone.outofzone();
    var pos = stone.body.position;
    //if(stone.x >= windowWidth || stone.x <= 0){
    //  stone.x = random(width / 2, 30);
    //  console.log("Stone Is Back");
    //}
    var distance = dist(zombie.position.x, zombie.position.y, pos.x, pos.y);
    
    if (distance <= 50) {
      zombie.velocityX = 0;
      Matter.Body.setVelocity(stone.body, { x: 10, y: -10 });
      if(left == true){
        zombie.changeImage("sad", sadzombie);
      }
      if(right == true){
        zombie.changeImage("sad2", sadzombie2);
      }
      
      collided = true;
    }
    
  }

  if (zombie.position.x >= width - 300 && !collided) {
    zombie.velocityX = -10;
    zombie.changeAnimation("righttoleft");
    right = false;
    left = true;
  }

  if (zombie.position.x <= 300 && !collided) {
    zombie.velocityX = 10;
    zombie.changeAnimation("lefttoright");
    left = false;
    right = true;
  }

  drawSprites();
}

function handleButtonPress() {
  isVictory = true;
  jointLink.dettach();
  setTimeout(() => {
    bridge.break();
  }, 1500);
  setTimeout(() => {
    restart();
  }, 2000);
}

function restart() {
  if(isGameover == true && isVictory == false){
      swal(
      {
        title: `Fim De Jogo!`, 
        text: "O Zumbi Chegou Na Vila!", 
        //imageUrl:
          //"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
        imageSize: "150x150", 
        confirmButtonText: "Tentar Novamente"
      },
      function(isConfirm) {
        if (isConfirm) {
          location.reload();
        }
      }
    );
  }
  else if(isGameover == false && isVictory == true){
    swal(
      {
        title: `Parabéns!`, 
        text: "Você Impediu O Zumbi De Chegar Na Vila!", 
        //imageUrl:
          //"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
        imageSize: "150x150", 
        confirmButtonText: "Jogar Novamente"
      },
      function(isConfirm) {
        if (isConfirm) {
          location.reload();
        }
      }
    );
  }else{

  }
}

function cantplay(){
  swal(
    {
      title: `Oops!`, 
      text: "Sua Tela De Computador É Muito Pequena.", 
      //imageUrl:
        //"https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150", 
      confirmButtonText: "Tentar Novamente"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}

function TimeDisplay(){//1 Minuto.
  if(isVictory == false){
    textSize(timeTextSize);
    fill('darkred');
    stroke('red');
    if(time <= 61 && time >= 60){//60.
      text("60", timeX, timeY);
    }
    if(time <= 60 && time >= 59){//59.
      text("59", timeX, timeY);
    }
    if(time <= 59 && time >= 58){//58.
      text("58", timeX, timeY);
    }
    if(time <= 58 && time >= 57){//57.
      text("57", timeX, timeY);
    }
    if(time <= 57 && time >= 56){//56.
      text("56", timeX, timeY);
    }
    if(time <= 56 && time >= 55){//55.
      text("55", timeX, timeY);
    }
    if(time <= 55 && time >= 54){//54.
      text("54", timeX, timeY);
    }
    if(time <= 54 && time >= 53){//53.
      text("53", timeX, timeY);
    }
    if(time <= 53 && time >= 52){//52.
      text("52", timeX, timeY);
    }
    if(time <= 52 && time >= 51){//51.
      text("51", timeX, timeY);
    }
    if(time <= 51 && time >= 50){//50.
      text("50", timeX, timeY);
    }
    if(time <= 50 && time >= 49){//49.
      text("49", timeX, timeY);
    }
    if(time <= 49 && time >= 48){//48.
      text("48", timeX, timeY);
    }
    if(time <= 48 && time >= 47){//47.
      text("47", timeX, timeY);
    }
    if(time <= 47 && time >= 46){//46.
      text("46", timeX, timeY);
    }
    if(time <= 46 && time >= 45){//45.
      text("45", timeX, timeY);
    }
    if(time <= 45 && time >= 44){//44.
      text("44", timeX, timeY);
    }
    if(time <= 44 && time >= 43){//43.
      text("43", timeX, timeY);
    }
    if(time <= 43 && time >= 42){//42.
      text("42", timeX, timeY);
    }
    if(time <= 42 && time >= 41){//41.
      text("41", timeX, timeY);
    }
    if(time <= 41 && time >= 40){//40.
      text("40", timeX, timeY);
    }
    if(time <= 40 && time >= 39){//39.
      text("39", timeX, timeY);
    }
    if(time <= 39 && time >= 38){//38.
      text("38", timeX, timeY);
    }
    if(time <= 38 && time >= 37){//37.
      text("37", timeX, timeY);
    }
    if(time <= 37 && time >= 36){//36.
      text("36", timeX, timeY);
    }
    if(time <= 36 && time >= 35){//35.
      text("35", timeX, timeY);
    }
    if(time <= 35 && time >= 34){//34.
      text("34", timeX, timeY);
    }
    if(time <= 34 && time >= 33){//33.
      text("33", timeX, timeY);
    }
    if(time <= 33 && time >= 32){//32.
      text("32", timeX, timeY);
    }
    if(time <= 32 && time >= 31){//31.
      text("31", timeX, timeY);
    }
    if(time <= 31 && time >= 30){//30.
      text("30", timeX, timeY);
    }
    if(time <= 30 && time >= 29){//29.
      text("29", timeX, timeY);
    }
    if(time <= 29 && time >= 28){//28.
      text("28", timeX, timeY);
    }
    if(time <= 28 && time >= 27){//27.
      text("27", timeX, timeY);
    }
    if(time <= 27 && time >= 26){//26.
      text("26", timeX, timeY);
    }
    if(time <= 26 && time >= 25){//25.
      text("25", timeX, timeY);
    }
    if(time <= 25 && time >= 24){//24.
      text("24", timeX, timeY);
    }
    if(time <= 24 && time >= 23){//23.
      text("23", timeX, timeY);
    }
    if(time <= 23 && time >= 22){//22.
      text("22", timeX, timeY);
    }
    if(time <= 22 && time >= 21){//21.
      text("21", timeX, timeY);
    }
    if(time <= 21 && time >= 20){//20.
      text("20", timeX, timeY);
    }
    if(time <= 20 && time >= 19){//19.
      text("19", timeX, timeY);
    }
    if(time <= 19 && time >= 18){//18.
      text("18", timeX, timeY);
    }
    if(time <= 18 && time >= 17){//17.
      text("17", timeX, timeY);
    }
    if(time <= 17 && time >= 16){//16.
      text("16", timeX, timeY);
    }
    if(time <= 16 && time >= 15){//15.
      text("15", timeX, timeY);
    }
    if(time <= 15 && time >= 14){//14.
      text("14", timeX, timeY);
    }
    if(time <= 14 && time >= 13){//13.
      text("13", timeX, timeY);
    }
    if(time <= 13 && time >= 12){//12.
      text("12", timeX, timeY);
    }
    if(time <= 12 && time >= 11){//11.
      text("11", timeX, timeY);
    }
    if(time <= 11 && time >= 10){//10.
      text("10", timeX, timeY);
    }
    if(time <= 10 && time >= 9){//9.
      text("9", timeX, timeY);
    }
    if(time <= 9 && time >= 8){//8.
      text("8", timeX, timeY);
    }
    if(time <= 8 && time >= 7){//7.
      text("7", timeX, timeY);
    }
    if(time <= 7 && time >= 6){//6.
      text("6", timeX, timeY);
    }
    if(time <= 6 && time >= 5){//5.
      text("5", timeX, timeY);
    }
    if(time <= 5 && time >= 4){//4.
      text("4", timeX, timeY);
    }
    if(time <= 4 && time >= 3){//3.
      text("3", timeX, timeY);
    }
    if(time <= 3 && time >= 2){//2.
      text("2", timeX, timeY);
    }
    if(time <= 2 && time >= 1){//1.
      text("1", timeX, timeY);
    }
  }
}
