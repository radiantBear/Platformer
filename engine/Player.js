import Character from './Character.js';

export default class Player extends Character {
    constructor(x, y, width, height, scale, inputObject, biomeObject) {
        super('img/player.png', x, y, width, height, scale);
        this.input = inputObject;
        this.map = biomeObject;
        
        this.gravity = 0.2;
        this.vSpeed = 1;
        this.speed = 4;
        this.jump = -7;
    }
    
    newBiome(biomeObject) {
        this.map = biomeObject;
    }
    
    nextFrame() {
        let vX = 0;
        
        if (this.input.keysDown[39]) {
            if (!this.collision(this.x+this.speed, this.y))
                vX = this.speed;
            else if (!this.collision(this.x+1, this.y))
                vX = this.speed - this.pxShift('right', this.x-this.speed, this.y);
        } // Go right, as close to max distance as possible
        if (this.input.keysDown[37]) {
            if (!this.collision(this.x-this.speed, this.y))
                vX = -this.speed;
            else if (!this.collision(this.x-1, this.y))
                vX = -(this.speed - this.pxShift('left', this.x-this.speed, this.y));
        } // Go left, as close to max distance as possible
        
        if (this.input.newKeysDown[38])
            this.vSpeed = this.jump; // Start 'falling' up to jump when press up key
        
        if (!this.collision(this.x, this.y+this.vSpeed)) {
            this.y += this.vSpeed;
            this.vSpeed += this.gravity;
        } else if (!this.collision(this.x, this.y+1)) {
            this.y += this.vSpeed - this.pxShift('bottom', this.x, this.y+this.vSpeed);
            this.vSpeed += this.gravity;
        } // Fall down as close to max fall as possible
        
        if (this.collision(this.x, this.y+1))
            this.vSpeed = 1; // Reset fall speed when on ground
        
        this.x += vX;
        if (vX)
            this.updateAnimationFrame();
        
        // Ensure correct animation is playing
        if (vX>0)
            this.setAnimation(0);
        if (vX<0)
            this.setAnimation(1);
        
        // *** Note: 'as close to max ___ as possible' means go *speed* distance unless obstacle prevents moving that far
    }
    
    collision(x, y) {
        let values = this.map.whatOn(this.map.layerToNum('obstacles'), x, y, this.width, this.height);
        
        return Math.max(...values) > -1;
    } // Returns true if collision w/ obstacle, false if no collision
    
    pxShift(areaToAvoid, x, y) {
        let pxOn = this.map.pxOn(x, y, this.width, this.height);
        
        let segmentOfReturn = 0;
        switch(areaToAvoid) {
            case 'right':
                segmentOfReturn = 1;
                break;
            case 'top':
                segmentOfReturn = 2;
                break;
            case 'bottom':
                segmentOfReturn = 3;
                break;
            default:
                console.error('invalid argument passed to playerObj.pxShift(), "areaToAvoid"=');
        }
        
        return pxOn[segmentOfReturn];
    } // arg='left', 'right', 'top', 'bottom'; returns how many pixels to shift to get out of current place
}