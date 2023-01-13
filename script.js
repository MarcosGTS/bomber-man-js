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

class Map {
    constructor(map) {
        this.map = this.createMap(map)
    }

    symbol_to_tile(symbol) {
        const tiles = {
            "b": Block,
            "#": Brick,
        }
    
        if (tiles[symbol]) return tiles[symbol]
        return Ground
    }

    createMap(map) {
        const row = map.length
        const col = map[0].length
        const tiles = []
    
        for (let i = 0; i < row; i++) {
            const new_row = []
            for (let j = 0; j < col; j++) {
                const symbol = map[i][j]
                const tile = this.symbol_to_tile(symbol)
                const position = {
                    x: j * SCALE_FACTOR, 
                    y: i * SCALE_FACTOR
                }
                
                new_row.push(new tile(position))
            }
            tiles.push(new_row)
        }
    
        return tiles
    }
    
    render(context) {
        for (let row of this.map) {
            for (let tile of row) {
                tile.show(context)
            }
        }
    }
}

let abstract_map = [
    ["b","b","b","b","b","b","b"],
    ["b"," "," "," "," "," ","b"],
    ["b"," ","b","#","b"," ","b"],
    ["b"," ","#","#","#","#","b"],
    ["b"," ","b","#","b"," ","b"],
    ["b"," "," "," "," "," ","b"],
    ["b","b","b","b","b","b","b"],
]

const map = new Map(abstract_map)

function gameloop() {
    map.render(context)
    requestAnimationFrame(gameloop)
}

gameloop()