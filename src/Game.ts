import {Bishop, King, Knight, Pawn, Queen, Rook} from "./Chess";
import {Controller} from "./Controller";
import {Map} from "./Map";

export class Game {
    public info: Array<Array<string>>
    public move_color: string
    public possible_moves: number = 0
    public king: King
    public queen: Queen
    public bishop: Bishop
    public knight: Knight
    public rook: Rook
    public pawn: Pawn
    public map: Map
    public controller: Controller

    constructor() {
        this.info = Game.init_info()
        this.move_color = "white"

        this.king = new King()
        this.queen = new Queen()
        this.bishop = new Bishop()
        this.knight = new Knight()
        this.rook = new Rook()
        this.pawn = new Pawn()

        this.map = new Map()
        this.controller = new Controller()
    }

    public start(): void {
        this.mark_moves_from()
        this.map.show_map(this, this.controller, this.set_info())
    }

    private set_info(): Array<Array<string>> {
        return this.info
    }


    public mark_moves_from (): void {
        this.possible_moves = 0
        this.info = Game.init_info()
        for(let sx = 0; sx < 8; sx++)
            for(let sy = 0; sy < 8; sy++)
                for(let dx = 0; dx < 8; dx++)
                    for (let dy = 0; dy < 8; dy++)
                        if (this.can_move(sx, sy, dx, dy)) {
                            this.info[sx][sy] = "1"
                            this.possible_moves += 1
                        }
    }

    public mark_moves_to (move_from_x: number, move_from_y: number): void {
        this.info = Game.init_info()
        for(let x = 0; x < 8; x++) {
            for(let y = 0; y < 8; y++) {
                if(this.can_move (move_from_x, move_from_y, x, y)){
                    this.info[x][y] = "2"
                }
            }
        }
    }


    private is_correct_move(sx: number, sy:number, dx:number, dy: number): boolean{
        let figure  = this.map.map[sx][sy]
        if(this.is_king(figure))
            return this.king.move(sx, sy, dx, dy, this)
        if(this.is_queen(figure))
            return this.queen.move(sx, sy, dx, dy, this)
        if(this.is_bishop(figure))
            return this.bishop.move(sx, sy, dx, dy, this)
        if(this.is_knight(figure))
            return this.knight.move(sx, sy, dx, dy, this)
        if(this.is_rook(figure))
            return this.rook.move(sx, sy, dx, dy, this)
        if(this.is_pawn(figure))
            return this.pawn.move(sx, sy, dx, dy, this)

        return false
    }

    private can_move (sx: number, sy:number, dx:number, dy: number): boolean {
        if (!this.can_move_from(sx, sy))
            return false
        if (!this.can_move_to(dx, dy))
            return false
        if (!this.is_correct_move(sx, sy, dx, dy))
            return false
        return !this.is_check_after_move(sx, sy, dx, dy);
    }

    public is_check_after_move(sx: number, sy:number, dx:number, dy: number): boolean {
        this.controller.move_figure(sx, sy, dx, dy, this)
        let check = this.is_check()
        this.controller.back_figure(sx, sy, dx, dy, this)
        return check
    }

    public is_check(): boolean {
        let king = this.find_figure(this.move_color === "white" ? "K" : "k")

        for(let x = 0; x <= 7; x++)
            for(let y = 0; y <= 7; y++)
                if(this.get_color(x, y) !== this.move_color)
                    if(this.is_correct_move(x, y, king.x, king.y))
                        return true;
        return false
    }

    public is_checkmate(): boolean {
        if(!this.is_check())
            return false
        return this.possible_moves === 0
    }

    public is_stalemate(): boolean {
        if(this.is_check())
            return false
        return this.possible_moves === 0
    }



    private can_move_from (x: number, y: number): boolean {
        if(!(x >= 0 && x <= 7 && y >= 0 && y <= 7))
            return false
        return this.get_color(x, y) === this.move_color
    }

    private can_move_to(x: number, y: number): boolean {
        if(!(x >= 0 && x <= 7 && y >= 0 && y <= 7))
            return false
        if(this.map.map[x][y] === " ")
            return true
        return this.get_color(x, y) !== this.move_color
    }



    private get_color(x: number, y: number): string {
        let figure = this.map.map[x][y]
        if(figure === " ") return figure

        return (figure.toUpperCase() === figure) ? "white" : "black"
    }

    private find_figure(figure: string): {x: number, y: number} {
        for(let x = 0; x <= 7; x++)
            for(let y = 0; y <= 7; y++)
                if(this.map.map[x][y] === figure)
                    return {x, y}

        return {x: -1, y: -1}
    }

    public is_king    (figure: string): boolean { return figure.toUpperCase() === "K" }
    public is_queen   (figure: string): boolean { return figure.toUpperCase() === "Q" }
    public is_bishop  (figure: string): boolean { return figure.toUpperCase() === "B" }
    public is_knight  (figure: string): boolean { return figure.toUpperCase() === "N" }
    public is_rook    (figure: string): boolean { return figure.toUpperCase() === "R" }
    public is_pawn    (figure: string): boolean { return figure.toUpperCase() === "P" }


    private static init_info(): Array<Array<string>> {
        return [
            //y0  y1   y2   y3   y4   y5   y6   y7
            [" ", " ", " ", " ", " ", " ", " ", " "], //x0
            [" ", " ", " ", " ", " ", " ", " ", " "], //x1
            [" ", " ", " ", " ", " ", " ", " ", " "], //x2
            [" ", " ", " ", " ", " ", " ", " ", " "], //x3
            [" ", " ", " ", " ", " ", " ", " ", " "], //x4
            [" ", " ", " ", " ", " ", " ", " ", " "], //x5
            [" ", " ", " ", " ", " ", " ", " ", " "], //x6
            [" ", " ", " ", " ", " ", " ", " ", " "]  //x7
        ]
    }
}