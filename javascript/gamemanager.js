import Game from "./game";
export default class GameManager {
    static createGame() {
        let id = 0;
        while (GameManager.games.some(game => game.id == id)) {
            id++;
        }
        return new Game(id);
    }
    static findGame() {
        return GameManager.games.find(game => game.players.length > 0 && game.players.length < GameManager.MAX_PLAYERS);
    }
    static getGameById(id) {
        return GameManager.games.find(game => game.id == id);
    }
    static destroyGame(game) {
        GameManager.games.splice(GameManager.games.findIndex(g => g.id == game.id));
    }
}
GameManager.MAX_PLAYERS = 2;
GameManager.games = [];
//# sourceMappingURL=gamemanager.js.map