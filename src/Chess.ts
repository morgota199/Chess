import {Game} from "./Game";

interface IChess {
    move(sx: number, sy:number, dx:number, dy: number, game: Game): boolean
}

class Chess {
    protected on_map(x: number, y: number): boolean {
        return x >= 0 && x <= 7 && y >= 0 && y <= 7
    }

    protected is_empty(x: number, y: number, game: Game):boolean {
        if(!this.on_map(x, y)) return false
        return game.map.map[x][y] === " "
    }

    protected is_correct_line_move(sx: number, sy: number, dx: number, dy: number, figure: string, game: Game) :boolean {
        let delta_x = Math.sign(dx - sx)
        let delta_y = Math.sign(dy - sy)

        if(!this.is_correct_line_delta(delta_x, delta_y, figure))
            return false

        do {
            sx += delta_x
            sy += delta_y

            if(sx === dx && sy === dy)
                return true
        } while (this.is_empty(sx, sy, game))

        return false
    }

    protected is_correct_line_delta(delta_x: number, delta_y: number, figure: string): boolean {
        switch (figure.toUpperCase()) {
            case "R": return this.is_correct_rook_move(delta_x, delta_y)
            case "B": return this.is_correct_bishop_move(delta_x, delta_y)
            case "Q": return this.is_correct_queen_move()
            default: return false
        }
    }

    protected is_correct_rook_move(delta_x: number, delta_y: number): boolean {
        return Math.abs(delta_x) + Math.abs(delta_y) === 1
    }

    protected is_correct_bishop_move(delta_x: number, delta_y: number): boolean {
        return Math.abs(delta_x) + Math.abs(delta_y) === 2
    }

    protected is_correct_queen_move(): boolean {
        return true
    }

}

export class King   extends Chess implements IChess{
    public move(sx: number, sy:number, dx:number, dy: number, game: Game): boolean {
        if(Math.abs(dx - sx) <= 1 && Math.abs(dy - sy) <= 1)
            return true
        return  this.can_castle(sx, sy, dx, dy, game)
    }

    private can_castle(sx: number, sy:number, dx:number, dy: number, game: Game): boolean {
        let figure = game.map.map[sx][sy]
        if(figure === "K"
            && sx === 4 && sy === 0
            && dx === 6 && dy === 0) return this.can_white_cr(game);
        if(figure === "K"
            && sx === 4 && sy === 0
            && dx === 2 && dy === 0) return this.can_white_cl(game);
        if(figure === "k"
            && sx === 4 && sy === 7
            && dx === 6 && dy === 7) return this.can_black_cr(game);
        if(figure === "k"
            && sx === 4 && sy === 7
            && dx === 2 && dy === 7) return this.can_black_cl(game);
        return false
    }

    private can_white_cr(game: Game):boolean {
        if(!game.controller.can_white_castle_right) return false
        if(game.is_check()) return false
        if(game.is_check_after_move(4, 0, 5, 0)) return false
        if(!this.is_empty(5, 0, game)) return false
        if(!this.is_empty(6, 0, game)) return false
        return game.map.map[7][0] === "R";

    }

    private can_white_cl(game: Game):boolean {
        if(!game.controller.can_white_castle_left) return false
        if(game.is_check()) return false
        if(game.is_check_after_move(4, 0, 3, 0)) return false
        if(!this.is_empty(3, 0, game)) return false
        if(!this.is_empty(2, 0, game)) return false
        if(!this.is_empty(1, 0, game)) return false
        return game.map.map[0][0] === "R";

    }

    private can_black_cr(game: Game): boolean {
        if(!game.controller.can_black_castle_right) return false
        if(game.is_check()) return false
        if(game.is_check_after_move(4, 7, 5, 7)) return false
        if(!this.is_empty(5, 7, game)) return false
        if(!this.is_empty(6, 7, game)) return false
        return game.map.map[7][7] === "r";

    }

    private can_black_cl(game: Game): boolean {
        if(!game.controller.can_black_castle_left) return false
        if(game.is_check()) return false
        if(game.is_check_after_move(4, 7, 3, 7)) return false
        if(!this.is_empty(3, 7, game)) return false
        if(!this.is_empty(2, 7, game)) return false
        if(!this.is_empty(1, 7, game)) return false
        return game.map.map[0][7] === "r";

    }

}

export class Queen  extends Chess implements IChess{
    public move(sx: number, sy:number, dx:number, dy: number, game: Game): boolean{
        return this.is_correct_line_move(sx, sy, dx, dy, "Q", game)
    }
}

export class Bishop extends Chess implements IChess{
    public move(sx: number, sy:number, dx:number, dy: number, game: Game): boolean {
        return this.is_correct_line_move(sx, sy, dx, dy, "B", game)
    }
}

export class Knight extends Chess implements IChess{
    public move(sx: number, sy:number, dx:number, dy: number, game: Game): boolean {
        if(Math.abs(dx - sx) === 1 && Math.abs(dy - sy) === 2)
            return true
        return Math.abs(dx - sx) === 2 && Math.abs(dy - sy) === 1;
    }
}

export class Rook   extends Chess implements IChess{
    public move(sx: number, sy:number, dx:number, dy: number, game: Game): boolean {
        return this.is_correct_line_move(sx, sy, dx, dy, "R", game)
    }
}

export class Pawn   extends Chess implements IChess{
    public pawn_attack_x: number = -1
    public pawn_attack_y: number = -1
    public save_pawn_figure: string = " "
    public save_pawn_x: number = -1
    public save_pawn_y: number = -1

    public move(sx: number, sy:number, dx:number, dy: number, game: Game): boolean {
        if(sy < 1 || sy > 6)
            return false
        if(game.map.map[sx][sy].toUpperCase() === game.map.map[sx][sy])
            return this.is_correct_sign_pawn_move(sx, sy, dx, dy, game, 1)
        if(game.map.map[sx][sy].toUpperCase() !== game.map.map[sx][sy])
            return this.is_correct_sign_pawn_move(sx, sy, dx, dy, game, -1)
        return false
    }

    public is_correct_sign_pawn_move(sx: number, sy:number, dx:number, dy: number, game: Game, sign: number): boolean {
        if(this.is_pawn_passant(sx, sy, dx, dy, sign))
            return true
        if(!this.is_empty(dx, dy, game)) {
            if (Math.abs(dx - sx) !== 1)
                return false
            return dy - sy === sign
        }
        if(dx !== sx)
            return false
        if(dy - sy === sign)
            return true
        if(dy - sy === sign * 2) {
            if(sy !== 1 && sy !== 6)
                return false
            return this.is_empty(sx, sy + sign, game)
        }

        return false
    }

    public is_pawn_passant(sx: number, sy:number, dx:number, dy: number, sign: number): boolean {
        if(!(dx === this.pawn_attack_x && dy === this.pawn_attack_y))
            return false
        if(sign === 1 && sy !== 4)
            return false
        if(sign === -1 && sy !== 3)
            return false
        if(dy - sy !== sign)
            return false
        return (Math.abs(dx - sx) === 1)
    }
}
