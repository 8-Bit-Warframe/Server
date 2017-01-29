import Game from "./game";
import Player from "./player";
import Timer = NodeJS.Timer;

export default class GameManager {
    static MAX_PLAYERS: number = 2;

    static games: Array<Game> = [];
    static probation: Array<Timer> = [];
    static probationTimeout: Array<number> = [];

    static createGame(host: Player): Game {
        let id = 0;
        while (GameManager.games.some(game => game.id == id)) {
            id++;
        }
        const game: Game = new Game(id);
        GameManager.games[id] = game;
        GameManager.games[id].addPlayer(host, true);
        GameManager.probation[id] = setTimeout(function () {GameManager.destroyGame(game)}, 60000);
        GameManager.probationTimeout[id] = Date.now() + 60000;
        return GameManager.games[id];
    }

    static confirmGame(gameId: number) {
        clearTimeout(GameManager.probation[gameId]);
        GameManager.probation[gameId] = null;
        GameManager.probationTimeout[gameId] = 0;
    }

    static findGame(): Game {
        return GameManager.games.find(game => game.players.length > 0 && game.players.length < GameManager.MAX_PLAYERS);
    }

    static getGameById(id: number) {
        return GameManager.games.find(game => game.id == id);
    }

    static destroyGame(game: Game) {
        GameManager.games.splice(GameManager.games.findIndex(g => g.id == game.id), 1);
    }
}