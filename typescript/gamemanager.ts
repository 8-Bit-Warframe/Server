import Game from "./game";

export default class GameManager {
    static MAX_PLAYERS: number = 2;

    static games: Array<Game> = [];

    static createGame(): Game {
        let id = 0;
        while (GameManager.games.some(game => game.id == id)) {
            id++;
        }
        this.games[id] = new Game(id);
        return this.games[id];
    }

    static findGame(): Game {
        return GameManager.games.find(game => game.players.length > 0 && game.players.length < GameManager.MAX_PLAYERS);
    }

    static getGameById(id: number) {
        return GameManager.games.find(game => game.id == id);
    }

    static destroyGame(game: Game) {
        GameManager.games.splice(GameManager.games.findIndex(g => g.id == game.id));
    }
}