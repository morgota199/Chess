import {Game} from "./Game";
import {Controller} from "./Controller";

export class Map {
    public map: Array<Array<string>>

    constructor() {
        this.map = [
            //y0  y1   y2   y3   y4   y5   y6   y7
            ["R", "P", " ", " ", " ", " ", "p", "r",], //x0
            ["N", "P", " ", " ", " ", " ", "p", "n",], //x1
            ["B", "P", " ", " ", " ", " ", "p", "b",], //x2
            ["Q", "P", " ", " ", " ", " ", "p", "q",], //x3
            ["K", "P", " ", " ", " ", " ", "p", "k",], //x4
            ["B", "P", " ", " ", " ", " ", "p", "b",], //x5
            ["N", "P", " ", " ", " ", " ", "p", "n",], //x6
            ["R", "P", " ", " ", " ", " ", "p", "r",]  //x7
        ]
    }

    public show_map (game: Game, controller: Controller, info: Array<Array<string>>): void {
        let html = '<table border="1" cellpadding="2" cellspacing="0">'
        for (let y = 7; y >= 0; y--) {
            html += '<tr>'
            html += '<td>' + y + '</td>'

            for (let x = 0; x <= 7; x++) {
                let color: string;
                if(info[x][y] === " ") {
                    color = (x + y) % 2 ? "#edca8e" : "#b5822a"
                } else {
                    color = info[x][y] === "1" ? "rgba(169, 207, 120, 0.85)" : "#eeeeee"
                }

                html += `<td style=' 
                            height: 50px;
                            width: 50px;
                            background: ${color};
                            font-size: 36px;'>`
                html += Map.figure_to_html(this.map[x][y])
                html += '</td>'
            }

            html += '</tr>'
        }

        html += '<tr>'
        html += '<td>&nbsp;</td>'

        for (let x = 0; x <= 7; x++) {
            html += '<td>' + x + '</td>'
        }
        const board:HTMLElement | null = document.getElementById("board")

        if(board)
            board.innerHTML = html

        controller.add_onClick(game)
        this.show_info(game)
    }

    public show_info(game: Game): void {
        let html = "Ход: "
        html += game.move_color === "white" ? "Белых" : "Черных"

        if(game.is_checkmate())
            html += " Мат"
        else
            if (game.is_stalemate())
                html += " Пат"
            else
                if (game.is_check())
                    html += " Шах"

        const info: HTMLElement | null = document.getElementById("info")

        if(info)
            info.innerHTML = html
    }

    private static figure_to_html(figure: string): string {
        switch (figure) {
            case "K": return "&#9812";      case "k": return "&#9818";
            case "Q": return "&#9813";      case "q": return "&#9819";
            case "R": return "&#9814";      case "r": return "&#9820";
            case "B": return "&#9815";      case "b": return "&#9821";
            case "N": return "&#9816";      case "n": return "&#9822";
            case "P": return "&#9817";      case "p": return "&#9823";

            default: return " "
        }
    }
}