let TILE_SET = document.getElementById("tile_set")

const BLOCK_SPRITE = {src: TILE_SET, sx: 17, sy: 0, sw: 16, sh: 16}
const SCALE_FACTOR = 10

const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
canvas.width = 500
canvas.height = 500


// Block
// Brick
// Bomb
// Item

class Tile {
    constructor (position, sprite) {
        this.position = position
        this.sprite = sprite
    }

    show(context) {
        context.drawImage(
            this.sprite.src,
            this.sprite.sx,
            this.sprite.sy,
            this.sprite.sw,
            this.sprite.sh,
            this.position.x,
            this.position.y,
            SCALE_FACTOR, 
            SCALE_FACTOR)
    }
}

class Block extends Tile {
    constructor (position) {
        super(position, BLOCK_SPRITE)
    }
}


TILE_SET.addEventListener("load", () => {
    
    let block = new Tile({x: 250, y: 250}, BLOCK_SPRITE)
    block.show(context)
    context.drawImage(TILE_SET, 0, 0)

})



