import * as PIXI from './pixi.mjs'


const app = new PIXI.Application({width: 1110, height: 752, backgroundColor: 0xffffff});
document.body.appendChild(app.view);

PIXI.Loader.shared
  .add("image/russia.png")
  .add("image/UkraineMap.png")
  .add("image/win.jpg")
  .add("image/Pacman_HD2.png")
  .add("image/Pacman_HD.png")
  .load(setup);

let packman, packman2, russia, ukr, countRussia = 0, win, game, animatedSprite, startAnimationPosition = 0;
let rules = new PIXI.Text(`   Using keyboard arrows, 
make russians equal to zero`);
let message = new PIXI.Text(countRussia);
let allRus = [];
let allUkr = [];

function setup() {
        ukr = new PIXI.Sprite(PIXI.Loader.shared.resources["image/UkraineMap.png"].texture);
        app.stage.addChild(ukr);
        ukr.scale.set(0.9, 0.9);

        packman = new PIXI.Sprite(PIXI.Loader.shared.resources["image/Pacman_HD2.png"].texture);

        allUkr.push(packman);

        packman2 = new PIXI.Sprite(PIXI.Loader.shared.resources["image/Pacman_HD.png"].texture);
        allUkr.push(packman2);

        animatedSprite = new PIXI.AnimatedSprite(allUkr);
        animatedSprite.scale.set(0.045, 0.045);
        animatedSprite.anchor.set(0.5, 0.5);
        gsap.fromTo(animatedSprite, {width: 0, height: 0}, {duration: 3, width: 90, height: 90}); 

        animatedSprite.position.set(500, 170);
        app.stage.addChild(animatedSprite);
        
        win = new PIXI.Sprite(PIXI.Loader.shared.resources["image/win.jpg"].texture);
        app.stage.addChild(win);
        win.position.set(-100, 0);
        win.visible = false;
        
        addRusFascist();
        addRusFascist();
        addRusFascist();

        game = setInterval(addRusFascist, 2500);
        
        message.position.set(810, 80);
        app.stage.addChild(message);
        rules.position.set(700, 20);    
        app.stage.addChild(rules);

        app.ticker.add(() => gameLoop());
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
function addRusFascist() {
    russia = new PIXI.Sprite(PIXI.Loader.shared.resources["image/russia.png"].texture);
    russia.scale.set(0.1, 0.1);
    russia.y = getRandom(20, 700);
    if (russia.y < 160) {
        russia.x = getRandom(500, 630);
    } else if (russia.y < 390){
        russia.x = getRandom(650, 960);
    } else russia.x = getRandom(500, 800);
    gsap.fromTo(russia, {x: 1200, width: 0, height: 0}, {x: russia.x, duration: 1.5, width: 51.2, height: 51.2}); 
    russia.anchor.set(0.5, 0.5);
    app.stage.addChild(russia);
    allRus.push(russia);
    countRussia++;
}

function gameLoop() {
    message.text=countRussia;
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

window.addEventListener("keydown", moveFunc);

function moveFunc(event)
{
    stateBorder(animatedSprite, {x: 20, y: 20, width: 1130, height: 760});

    startAnimationPosition == 1 ? startAnimationPosition = 0 : startAnimationPosition = 1;
    animatedSprite.gotoAndStop(startAnimationPosition);

    for (russia of allRus) {
        if (hitTestRectangle(animatedSprite, russia)) {
            russia.visible = false;
            countRussia--;
        }        
    }

        switch (event.code) {
            case 'ArrowLeft':
                animatedSprite.x -= 10;
                animatedSprite.rotation = 3.14;
                break;
            case 'ArrowRight':
                animatedSprite.x += 10;
                animatedSprite.rotation = 0;
                break;
            case 'ArrowUp':
                animatedSprite.y -= 10;
                animatedSprite.rotation = -1.57;
                break;
            case 'ArrowDown':
                animatedSprite.y += 10;
                animatedSprite.rotation = 1.57;
                break;
            default:
                animatedSprite.x += 0;
                animatedSprite.y += 0;
                break;
        } 
    

    if (countRussia === 0){
        gsap.fromTo(win, {x: -1200}, {duration: 2.5, x: -100, ease: "bounce"}); 
        win.visible = true;
        message.visible = false;
        rules.visible = false;
        clearInterval(game);
        window.removeEventListener("keydown", moveFunc);
    }
}

function hitTestRectangle(r1, r2) {
    let hit;
    (Math.abs(r1.x-r2.x) < 60 && Math.abs(r1.y-r2.y) < 70 && russia.visible) ? hit = true : hit = false;
    return hit;
}      