import * as PIXI from './pixi.mjs'

const app = new PIXI.Application({width: 1110, height: 752, backgroundColor: 0xffffff});
document.body.appendChild(app.view);

PIXI.Loader.shared
  .add("image/dino.png")
  .add("image/russia.png")
  .add("image/UkraineMap.png")
  .add("image/win.jpg")
  .load(setup);

let packman, russia, ukr, countRussia = 0, win, game;
let rules = new PIXI.Text("Make russians equal to zero");
let message = new PIXI.Text(countRussia);
let allRus = [];

function setup() {
        ukr = new PIXI.Sprite(PIXI.Loader.shared.resources["image/UkraineMap.png"].texture);
        app.stage.addChild(ukr);
        ukr.scale.set(0.9, 0.9);

        packman = new PIXI.Sprite(PIXI.Loader.shared.resources["image/dino.png"].texture);
        packman.scale.set(0.1, 0.1);
        packman.position.set(200, 200);
        app.stage.addChild(packman);
        packman.anchor.set(0.5, 0.5);
        
        win = new PIXI.Sprite(PIXI.Loader.shared.resources["image/win.jpg"].texture);
        app.stage.addChild(win);
        win.position.set(-100, 0);
        win.visible = false;
        
        addRusFascist();
        addRusFascist();
        addRusFascist();


        function addRusFascist() {
                russia = new PIXI.Sprite(PIXI.Loader.shared.resources["image/russia.png"].texture);
                russia.scale.set(0.1, 0.1);
                russia.y = getRandom(20, 700);
                if (russia.y < 160) {
                    russia.x = getRandom(500, 630);
                } else if (russia.y < 390){
                    russia.x = getRandom(650, 960);
                } else russia.x = getRandom(500, 800);

                app.stage.addChild(russia);
                allRus.push(russia);
                countRussia++;
          }
          
        game = setInterval(addRusFascist, 2500);
        
        function getRandom(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
  
        message.position.set(810, 50);
        app.stage.addChild(message);
        rules.position.set(700, 20);    
        app.stage.addChild(rules);

        
        app.ticker.add(() => gameLoop());
}

function gameLoop() {
    stateBorder(packman, {x: 20, y: 20, width: 1130, height: 760});
    message.text=countRussia;
    if (countRussia === 0){
        win.visible = true;
        message.visible = false;
        rules.visible = false;
        clearInterval(game);
    }
    
};


function stateBorder(sprite, container) {          
    if (sprite.x < container.x) {
        sprite.x = container.x;
    }
    if (sprite.y < container.y) {
        sprite.y = container.y;
    }
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
    }
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
    }
}

window.addEventListener("keydown", function(event){
    for (russia of allRus) {
        if (hitTestRectangle(packman, russia)) {
            russia.visible = false;
             countRussia--;
        }        
    }

    switch (event.code) {
        case 'ArrowLeft':
            packman.x -= 10;
            packman.rotation = 3.14;
            break;
        case 'ArrowRight':
            packman.x += 10;
            packman.rotation = 0;
            break;
        case 'ArrowUp':
            packman.y -= 10;
            packman.rotation = -1.57;
            break;
        case 'ArrowDown':
            packman.y += 10;
            packman.rotation = 1.57;
            break;
        default:
            packman.x += 0;
            packman.y += 0;
            break;
    } 
})


function hitTestRectangle(r1, r2) {
    let hit;
    (Math.abs(r1.x-r2.x) < 60 && Math.abs(r1.y-r2.y) < 70 && russia.visible) ? hit = true : hit = false;
    return hit;
}      