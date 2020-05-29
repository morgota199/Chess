import {Game} from "./Game";

export class Controller {
    private move_from_x: number = -1
    private move_from_y: number = -1
    private from_figure: string = " "
    private to_figure:   string = " "
    public can_white_castle_left: boolean  = true
    public can_white_castle_right: boolean = true
    public can_black_castle_left: boolean  = true
    public can_black_castle_right: boolean = true

    public add_onClick(game: Game): void {
        const map = document.getElementById("board")!.children[0].children[0]

        for(let y = 1; y <= 8; y++) {
            for(let x = 1; x <= 8; x++) {

                map.children[y-1].children[x]
                    .addEventListener("click", () => {
                        this.click_box(x-1, Math.abs(y-8), game)
                    })
            }
        }
    }



    public click_box(x: number, y: number, game: Game): void {
        if(game.info[x][y] === "1"){
            this.click_box_from(x, y, game)
        } else if (game.info[x][y] === "2") {
            this.click_box_to(x, y, game)
        }
    }

    private click_box_from (x: number, y:number, game: Game): void {
        this.move_from_x = x
        this.move_from_y = y

        game.mark_moves_to(this.move_from_x, this.move_from_y);
        game.map.show_map(game, this, game.info)
    }

    private click_box_to (to_x: number, to_y:number, game: Game): void {
        this.move_figure(this.move_from_x, this.move_from_y, to_x, to_y, game)

        Controller.promote_figure(this.from_figure, to_x, to_y, game)

        this.check_pawn_attack(this.from_figure, to_y, game)

        this.update_castle_flags(this.move_from_x, this.move_from_y, to_x, to_y, game)
        Controller.move_castling_rook(this.move_from_x, to_x, to_y, game)

        this.turn_move(game)
        game.mark_moves_from()
        game.map.show_map(game, this, game.info)
    }


    public turn_move (game: Game): void {
        game.move_color = game.move_color === "white" ? "black" : "white"
    }

    public move_figure(sx: number, sy: number, dx: number, dy: number, game: Game): void {
        this.from_figure = game.map.map[sx][sy]
        this.to_figure = game.map.map[dx][dy]
        game.map.map[dx][dy] = this.from_figure
        game.map.map[sx][sy] = " "
        this.move_pawn_attack(this.from_figure, dx, dy, game)
    }

    public back_figure(sx: number, sy: number, dx: number, dy: number, game: Game): void {
        game.map.map[sx][sy] = this.from_figure
        game.map.map[dx][dy] = this.to_figure

        this.back_pawn_attack(game)
    }

    public move_pawn_attack(from_figure: string, to_x: number, to_y:number, game: Game): void {
        if(game.is_pawn(from_figure))
            if(to_x === game.pawn.pawn_attack_x && to_y === game.pawn.pawn_attack_y) {
                let y = game.move_color === "white" ? to_y - 1 : to_y + 1
                game.pawn.save_pawn_figure = game.map.map[to_x][y]
                game.pawn.save_pawn_x = to_x
                game.pawn.save_pawn_y = y
                game.map.map[to_x][y] = " "
            }

    }

    public back_pawn_attack(game: Game): void {
        if(game.pawn.save_pawn_x === -1) return
        game.map.map[game.pawn.save_pawn_x][game.pawn.save_pawn_y] = game.pawn.save_pawn_figure
    }

    private check_pawn_attack(from_figure: string, to_y:number, game: Game): void {
        game.pawn.pawn_attack_x     = -1
        game.pawn.pawn_attack_y     = -1
        game.pawn.save_pawn_x       = -1
        game.pawn.save_pawn_y       = -1
        game.pawn.save_pawn_figure  = " "

        if (game.is_pawn(from_figure))
            if(this.move_from_y !== null && this.move_from_x !== null)
                if (Math.abs(to_y - this.move_from_y)) {
                    game.pawn.pawn_attack_x = this.move_from_x
                    game.pawn.pawn_attack_y = (this.move_from_y + to_y) / 2
                }
    }



    private update_castle_flags(from_x: number, from_y: number, to_x: number, to_y: number, game: Game): void {
        let figure = game.map.map[to_x][to_y]

        if(figure === "K") {
            this.can_white_castle_right = false
            this.can_white_castle_left  = false
        }

        if(figure === "k") {
            this.can_black_castle_right = false
            this.can_black_castle_left  = false
        }

        if(figure === "R" && from_x === 0 && from_y === 0)
            this.can_white_castle_left  = false
        if(figure === "R" && from_x === 7 && from_y === 0)
            this.can_white_castle_right  = false
        if(figure === "r" && from_x === 0 && from_y === 7)
            this.can_black_castle_left  = false
        if(figure === "r" && from_x === 7 && from_y === 7)
            this.can_black_castle_right  = false
    }

    private static move_castling_rook(from_x: number, to_x: number, to_y: number, game: Game): void {
        if(!game.is_king(game.map.map[to_x][to_y])) return
        if(Math.abs(to_x - from_x) !== 2) return

        if(to_x === 6 && to_y === 0) {  game.map.map[7][0] = " ";    game.map.map[5][0] = "R" }
        if(to_x === 2 && to_y === 0) {  game.map.map[0][0] = " ";    game.map.map[3][0] = "R" }
        if(to_x === 6 && to_y === 7) {  game.map.map[7][7] = " ";    game.map.map[7][7] = "r" }
        if(to_x === 2 && to_y === 7) {  game.map.map[0][7] = " ";    game.map.map[3][7] = "r" }
    }



    private static promote_figure(from_figure: string, to_x: number, to_y: number, game: Game): void{
        if(!game.is_pawn(from_figure))
            return
        if(!(to_y === 7 || to_y === 0)) {
            return
        }

        let figure
        do {
            figure = prompt("Выберите фигуру: Q, R, B, N", "Q")!
        } while (!(
            game.is_queen(figure) ||
            game.is_bishop(figure) ||
            game.is_rook(figure) ||
            game.is_knight(figure)
        ))

        if (game.move_color === "white")
            figure = figure.toUpperCase()
        else
            figure = figure.toLowerCase()
        game.map.map[to_x][to_y] = figure
    }
}