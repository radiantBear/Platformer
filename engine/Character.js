import { getTime } from './utils.js';

export default class Character {
    constructor(spritesheetSrc, x, y, width, height, scale) {
        this.spritesheet = new Image();
        this.spritesheet.src = spritesheetSrc;
        this.sx = 0;
        this.sy = 0;
        
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale;
        
        this.createTime = getTime();
    }
    
    draw(offsetX, offsetY) {
        ctx.drawImage(this.spritesheet, this.sx, this.sy, this.width/this.scale, this.height/this.scale, this.x - offsetX, this.y - offsetY, this.width, this.height);
    }
    
    setAnimation(rowNum) {
        this.sy = rowNum * this.height;
    }     // Which row in spritesheet to loop through for animation
    setAnimationFrame(frame) {
        this.sx = frame * this.width;
    } // Which sprite to draw from row in spritesheet -- allows specific choosing of where to enter animation
    updateAnimationFrame() {
        let start = this.createTime;
        let now = getTime();
        
        this.sx = Math.trunc((now - start) / 250) % 4 * this.width;
    }
}