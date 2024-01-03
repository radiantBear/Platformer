import Player from './Player.js';
import Game_Map from './GameMap.js';
import { grassArea } from '../grassArea.js';


// Separated from the class so `bind()` works correctly to ensure proper `this` value from callback
function handleEvent(event) {
    switch(event.type) {
        case 'keydown':
            if (event.keyCode==38 || event.keyCode==40 || event.keyCode==91) event.preventDefault();
            
            if (this.keysDown[event.keyCode]) {
                this.newKeysDown[event.keyCode] = false;
            } else {
                this.newKeysDown[event.keyCode] = true;
            }
            
            this.keysDown[event.keyCode] = true;
            break;
        case 'keyup':
            this.keysDown[event.keyCode] = false;
            this.newKeysDown[event.keyCode] = false;
            break;
    }
}


// Separated from the class for the same reason as `handleEvent()`
function updateNewKeys() {
    let myKeys = Object.keys(this.newKeysDown);
    
    for(let i = 0; i < myKeys.length; i++) {
        let key = myKeys[i];
        
        if(this.newKeysDown[key]) {
            if (this.recordedNewKeys[key])
                this.newKeysDown[key] = false;
            else
            this.recordedNewKeys[key] = true;
        }
        if(!this.keysDown[key]) {
            this.recordedNewKeys[key] = false;
            this.newKeysDown[key] = false;
        }
    }
}


export default class Game {
    constructor(canvasElmt, spriteSheetArray) {
        this.canvas = canvasElmt;
        window.ctx = canvasElmt.getContext('2d');
        this.nextFrame = undefined;
        
        this.input = {
            keysDown : {},
            newKeysDown : {},
            recordedNewKeys : {},
        };
        this.input.handleEvent = handleEvent.bind(this.input);
        this.input.updateNewKeys = updateNewKeys.bind(this.input);
        window.addEventListener('keydown', this.input);
        window.addEventListener('keyup', this.input);
        
        this.scene = 1;
        this.grassArea = new Game_Map(grassArea);
        this.currentBiome = this.grassArea;
        
        this.offset = {x: 200, y: 0};
        
        this.player = new Player(200, 270, 20, 30, 1, this.input, this.currentBiome);
    }
    

    start() {
        this.nextFrame = requestAnimationFrame(()=>{this.loop();});
    }
    

    loop() {
        this['scene'+this.scene]();
        
        this.nextFrame = requestAnimationFrame(()=>{this.loop();});
    }
    

    clear() {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }


    draw() {
        let i = 0;
        
        while(this.grassArea.layerToName(i) != 'objects') {
            this.grassArea.draw(i, this.offset.x, this.offset.y, this.canvas.width, this.canvas.height);
            i++;
        }
        this.player.draw(this.offset.x, this.offset.y);
        while(i < this.grassArea.layers.length) {
            this.grassArea.draw(i, this.offset.x, this.offset.y, this.canvas.width, this.canvas.height);
            i++;
        }
    }


    updateOffset() {
        let left = this.canvas.width / 4;
        let right = this.canvas.width - left;
        let top = this.canvas.height / 4;
        let bottom = this.canvas.height - top;
        
        // For debugging camera issues
        // this.drawCameraBounds(left, right, top, bottom);
        
        if (this.player.x - this.offset.x < left)
            this.offset.x = this.player.x - left;
        if (this.player.x - this.offset.x > right)
            this.offset.x = this.player.x - right;
        if (this.player.y - this.offset.y < top)
            this.offset.y = this.player.y - top;
        if (this.player.y - this.offset.y > bottom)
            this.offset.y = this.player.y - bottom;
        
        if (this.offset.x < 0)
            this.offset.x = 0;
        if (this.offset.x + this.canvas.width > this.currentBiome.worldWidth)
            this.offset.x = this.currentBiome.worldWidth - this.canvas.width;
        if (this.offset.y < 0)
            this.offset.y = 0;
        if (this.offset.y + this.canvas.height > this.currentBiome.worldHeight)
            this.offset.y = this.currentBiome.worldHeight - this.canvas.height;
    }


    drawCameraBounds(left, right, top, bottom) {
        ctx.beginPath();
        ctx.moveTo(left, 0)
        ctx.lineTo(left, this.canvas.height)
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(right, 0)
        ctx.lineTo(right, this.canvas.height)
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(0, top)
        ctx.lineTo(this.canvas.width, top)
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.moveTo(0, bottom)
        ctx.lineTo(this.canvas.width, bottom)
        ctx.stroke();
        ctx.closePath();
    }
}