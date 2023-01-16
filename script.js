let TILE_SET = document.getElementById("tile_set")
let PLAYER_SET = new Image(); PLAYER_SET.src = "/sprites/player_sprite.png"

const TILE_SIZE = 64

const PLAYER_SPRITE = {src: PLAYER_SET, sx: 137, sy: 1, sw: 16, sh: 32, dw: TILE_SIZE, dh: 2 * TILE_SIZE}
const BLOCK_SPRITE = {src: TILE_SET, sx: 17, sy: 0, sw: 16, sh: 16, dw: TILE_SIZE, dh: TILE_SIZE}
const BRICK_SPRITE = {src: TILE_SET, sx: 34, sy: 0, sw: 16, sh: 16, dw: TILE_SIZE, dh: TILE_SIZE}
const GROUND_SPRITE = {src: TILE_SET, sx: 51, sy: 0, sw: 16, sh: 16, dw: TILE_SIZE, dh: TILE_SIZE}

const INPUT = {pressed: false, key: undefined}

const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
canvas.width = 500
canvas.height = 500

// Block
// Brick
// Bomb
// Item

class Rect {
    constructor (position, width, height) {
        this.position = position
        this.width = width
        this.height = height
    }

    get_vertices() {
        const vertices = []

        vertices.push({x: this.position.x, y: this.position.y})
        vertices.push({x: this.position.x + this.width, y: this.position.y})
        vertices.push({x: this.position.x + this.width, y: this.position.y + this.height})
        vertices.push({x: this.position.x, y: this.position.y + this.height})

        return vertices
    }

    resolve_horizontal_collision(rect) {
        let vertices = this.get_vertices()
        
        for (let i in vertices) {
            if (rect.get_point_rect_collision(vertices[i]) == false) continue
            
            if (i == 0 || i == 3) this.position.x = rect.position.x + rect.width
            if (i == 1 || i == 2) this.position.x = rect.position.x - this.width

            vertices = this.get_vertices()
        }
    }

    resolve_vertical_collision(rect) {
        let vertices = this.get_vertices()
        
        for (let i in vertices) {
            if (rect.get_point_rect_collision(vertices[i]) == false) continue
            
            if (i == 0 || i == 1) this.position.y = rect.position.y + rect.height
            if (i == 2 || i == 3) this.position.y = rect.position.y - this.height

            vertices = this.get_vertices()
        }
    }

    get_point_rect_collision(point) {
        return (
            point.x > this.position.x && point.x < this.position.x + this.width
            && point.y > this.position.y && point.y < this.position.y + this.height
        )
    }

    show(context) {
        context.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }
}

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
            this.sprite.dw, 
            this.sprite.dh)
    }
}

class Block extends Tile {
    constructor (position) {
        super(position, BLOCK_SPRITE)
        this.rect = new Rect(position, TILE_SIZE, TILE_SIZE)
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
                    x: j * TILE_SIZE, 
                    y: i * TILE_SIZE
                }
                
                new_row.push(new tile(position))
            }
            tiles.push(new_row)
        }
    
        return tiles
    }

    convert_to_index(canvas_position, cell_size) {
        const x = Math.floor(canvas_position.x / cell_size)
        const y = Math.floor(canvas_position.y / cell_size)
        return {x, y}
    }

    get_newerest_cells(canvas_position) {
        const cells = []
        const position = this.convert_to_index(canvas_position, TILE_SIZE)

        for (let x = position.x - 1; x <= position.x + 1; x++) {
            if (x < 0 || x >= this.map.length) continue
            for (let y = position.y - 1; y <= position.y + 1; y++) {
                if (y < 0 || y >= this.map[0].length) continue
                
                if (x + y != 0) cells.push(this.map[y][x])
            }
        }

        return cells
    }
    
    render(context) {
        for (let row of this.map) {
            for (let tile of row) {
                tile.show(context)
            }
        }
    }
}

class Player extends Tile {
    constructor(position) {
        super(position, PLAYER_SPRITE)
        this.velocity = 1
        this.direction = {x: 0, y: 0}
        this.rect = new Rect(position, TILE_SIZE/2, TILE_SIZE/2)
    }

    change_direction(direction) {
        // Take a reference CAUTION
        const {position, velocity} = this
        const directions = {
            "up":   {x: 0, y: -1},
            "right":{x: 1, y: 0},
            "down": {x: 0, y: 1},
            "left": {x: -1, y: 0},
            "none": {x: 0, y: 0},
        }

        if (directions[direction]) {
            this.direction = directions[direction]
        }
    }

    move() {
        this.position.x += this.direction.x * this.velocity
        this.position.y += this.direction.y * this.velocity
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
const player = new Player({x: TILE_SIZE, y: TILE_SIZE})

function gameloop() {
    map.render(context)
    player.show(context)

    player.change_direction(INPUT.key)
    player.move()

    const nearest_cells = map.get_newerest_cells(player.position)
    // for (let cell of nearest_cells) {
    //     if (cell.constructor.name != "Block") continue
    //     player.rect.resolve_collision(cell.rect)
    // }
    
    
    requestAnimationFrame(gameloop)
}

//Input handling
const directions = {
    "ArrowUp": "up",
    "ArrowRight": "right",
    "ArrowDown": "down",
    "ArrowLeft": "left",
}

document.addEventListener("keydown", (e) => {
    const direction = directions[e.key]
    if (direction) {
        INPUT.key = direction
    }
})

document.addEventListener("keyup", (e) => {
    const direction = directions[e.key]
    if (direction) {
        INPUT.key = "none"
    }
})



gameloop()