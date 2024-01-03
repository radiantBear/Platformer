import Game from './engine/Game.js';

let myGame = new Game(document.querySelector('canvas'));
prepGame(myGame);
myGame.start();

function prepGame(gameObject) {
    gameObject.scene1 = () => {
        gameObject.clear();
        gameObject.input.updateNewKeys();
        
        gameObject.draw();
        
        gameObject.player.nextFrame();
        gameObject.updateOffset();
    }
  
  
}