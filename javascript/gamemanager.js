"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _game = require("./game");

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GameManager {
    static createGame(host) {
        let id = 0;
        while (GameManager.games.some(game => game.id == id)) {
            id++;
        }
        GameManager.games[id] = new _game2.default(id);
        GameManager.games[id].addPlayer(host, true);
        GameManager.probation[id] = setTimeout(function () {}, 60000);
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
exports.default = GameManager;
GameManager.MAX_PLAYERS = 2;
GameManager.games = [];
GameManager.probation = [];
GameManager.probationTimeout = [];