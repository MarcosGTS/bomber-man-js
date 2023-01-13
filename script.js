let TILE_SET = document.getElementById("tile_set")

const BLOCK_SPRITE = {src: TILE_SET, sx: 17, sy: 0, sw: 16, sh: 16}
const BRICK_SPRITE = {src: TILE_SET, sx: 34, sy: 0, sw: 16, sh: 16}
const GROUND_SPRITE = {src: TILE_SET, sx: 51, sy: 0, sw: 16, sh: 16}

const SCALE_FACTOR = 64

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

class Brick extends Tile {
    constructor (position) {
        super(position, BRICK_SPRITE)
    }
}

class Ground extends Tile {
    constructor(position) {
        super(position, GROUND_SPRITE)
    }
}

let map = [
    ["b","b","b","b","b","b","b"],
    ["b"," "," "," "," "," ","b"],
    ["b"," ","b","#","b"," ","b"],
    ["b"," ","#","#","#"," ","b"],
    ["b"," ","b","#","b"," ","b"],
    ["b"," "," "," "," "," ","b"],
    ["b","b","b","b","b","b","b"],
]

const tile_converter = {
    "b": Block,
    "#": Brick,
}

document.addEventListener("click", () => {
    const ground = new Ground({x: 0, y:0})
    ground.show(context)
    const tile_map = createMap(map)
    for (let tile of tile_map) {
        tile.show(context)
    }
})




function createMap(map) {
    const row = map.length
    const col = map[0].length
    const tiles = []

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            const tile_type = map[i][j]
            const tile_class = tile_converter[tile_type]
            const position = {
                x: j * SCALE_FACTOR, 
                y: i * SCALE_FACTOR
            }
            
            if (tile_class) {
                tiles.push(new tile_class(position)) 
            } else {
                tiles.push(new Ground(position)) 
            }
        }
    }

    return tiles
}
    




