// Creates a game map for Tiled-formatted(ish) data with only 1 tileset per map. Use http://riskylab.com/tilemap/# to guarantee proper formatting of JSON file


export default class Game_Map {
    constructor(jsonMap) {
        this.tileHeight = jsonMap.tilesets[0].tileheight;
        this.tileWidth = jsonMap.tilesets[0].tilewidth;
        this.worldHeight = jsonMap.canvas.height;
        this.worldWidth = jsonMap.canvas.width;
        this.worldTileHeight = Math.ceil(this.worldHeight / this.tileHeight);
        this.worldTileWidth = Math.ceil(this.worldWidth / this.tileWidth);
        
        this.tilesetColumns = jsonMap.tilesets[0].imagewidth / this.tileWidth;
        
        this.layers = [];
        jsonMap.layers.forEach(tiledLayer => {
            let layerGroup = {};
            Object.keys(tiledLayer).forEach(key => {
                layerGroup[key] = tiledLayer[key];
            });
            this.layers.push(layerGroup);
        });
        
        this.spritesheet = new Image();
        this.spritesheet.src = 'img/' + jsonMap.tilesets[0].image;
    }
    

    drawSprite(gid, x, y) {
        if(gid < 0)
            return;
        let sx = Math.trunc(gid) * this.tileWidth;
        let sy = Math.round((gid % 1) * 10) * this.tileHeight;
        ctx.drawImage(this.spritesheet, sx, sy, this.tileWidth, this.tileHeight, Math.round(x), Math.round(y), this.tileWidth, this.tileHeight);
    }


    draw(layer, offsetX, offsetY, drawWidth, drawHeight) {
        ctx.save();
        
        ctx.beginPath();
        ctx.rect(0, 0, drawWidth, drawHeight);
        ctx.clip();
        ctx.closePath();
        
        let startingX = Math.floor(offsetX / this.tileWidth);
        let endingX = Math.ceil((drawWidth+offsetX) / this.tileHeight);
        
        let startingY = Math.floor(offsetY / this.tileHeight);
        let endingY = Math.ceil((drawHeight+offsetY) / this.tileHeight);
        // ^ are in tiles
        
        // x, y are in tiles
        for(let y = startingY; y <= endingY; y++) {
            for(var x = startingX; x <= endingX; x++)
                this.drawSprite(this.layers[layer].data[x+y*this.worldTileWidth], x*this.tileWidth-offsetX, y*this.tileHeight-offsetY);
        }
        
        ctx.restore();
    } // Args in pixels
    

    layerToNum(layerName) {
        for(let i = 0; i < this.layers.length; i++) {
            if (this.layers[i].name == layerName)
                return i;
        }
        console.error('layerName not found in Game_Map object');
    }
    

    layerToName(layerNum) {
        return this.layers[layerNum].name;
    }
    

    whatOn(layer, x, y, width, height) {
        x--; y--;
        let left = Math.floor((x+1) / this.tileWidth);
        let right = Math.floor((x+width) / this.tileWidth);
        let top = Math.floor((y+1) / this.tileHeight);
        let bottom = Math.floor((y+height) / this.tileHeight);
        
        let tilesTouched = [];
            tilesTouched.push({x:left, y:top});
        if (top != bottom)
            tilesTouched.push({x:left, y:bottom});
        if (left != right)
            tilesTouched.push({x:right, y:top});
        if (left != right && top != bottom)
            tilesTouched.push({x:right, y:bottom});
        
        let tileValues = [];
        for(let i = 0; i < tilesTouched.length; i++) {
            let myTile = tilesTouched[i];
            
            tileValues.push(this.layers[layer].data[myTile.x+myTile.y*this.worldTileWidth]);
        }
        
        return tileValues;
    }// x, y, width, height in pixels; returns list of what on each tile in square from (x,y) to (x+width, y+height)


    pxOn(x, y, width, height) {
        let pxInLeft = x % this.tileWidth;
        let pxInRight = (x+width) % this.tileWidth;
        let pxInTop = y % this.tileHeight;
        let pxInBottom = (y+height) % this.tileHeight;
        return [pxInLeft, pxInRight, pxInTop, pxInBottom];
    } // returns how many pixels to shift to not be in a given section (l,r,top,bottom)
    
}