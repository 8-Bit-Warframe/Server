import Game from "./game";
export default class GameManager {
    static createGame(host) {
        let id = 0;
        while (GameManager.games.some(game => game.id == id)) {
            id++;
        }
        const game = new Game(id);
        GameManager.games[id] = game;
        GameManager.games[id].addPlayer(host, true);
        GameManager.probation[id] = setTimeout(function () { GameManager.destroyGame(game); }, 60000);
        GameManager.probationTimeout[id] = Date.now() + 60000;
        return GameManager.games[id];
    }
    static confirmGame(gameId) {
        clearTimeout(GameManager.probation[gameId]);
        GameManager.probation[gameId] = null;
        GameManager.probationTimeout[gameId] = 0;
    }
    static findGame() {
        return GameManager.games.find(game => game.players.length > 0 && game.players.length < GameManager.MAX_PLAYERS);
    }
    static getGameById(id) {
        return GameManager.games.find(game => game.id == id);
    }
    static destroyGame(game) {
        GameManager.games.splice(GameManager.games.findIndex(g => g.id == game.id), 1);
    }
}
GameManager.MAX_PLAYERS = 2;
GameManager.games = [];
GameManager.probation = [];
GameManager.probationTimeout = [];
//# sourceMappingURL=gamemanager.js.map