"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Message = exports.Server = undefined;

var _player = require("./player");

var _player2 = _interopRequireDefault(_player);

var _gamemanager = require("./gamemanager");

var _gamemanager2 = _interopRequireDefault(_gamemanager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const PING_INTERVAL = 1000;
const PING_TIMEOUT = 10000;
const MATCHMAKING_JOIN = "matchmaking_join";
const MATCHMAKING_PING = "matchmaking_ping";
const MATCHMAKING_LEAVE = "matchmaking_leave";
const GAME_CREATE = "game_create";
const GAME_JOIN = "game_join";
const GAME_PING = "game_ping";
const GAME_LEAVE = "game_leave";
const PLAYER_JOIN = "player_join";
const PLAYER_LEAVE = "player_leave";
class Server {
    static addPlayer(game, player) {
        game.addPlayer(player);
        const playerJoinMessage = {
            message: PLAYER_JOIN,
            player: player.getJson(game.getPlayerId(player))
        };
        for (let p of game.players) {
            if (p.uid != player.uid) {
                sendMessage(JSON.stringify(playerJoinMessage), p);
            }
        }
        const gameJoinMessage = {
            message: GAME_JOIN,
            playerId: game.getPlayerId(player),
            game: game.getJson()
        };
        sendMessage(JSON.stringify(gameJoinMessage), player);
    }
    static removePlayer(game, player) {
        if (game.isHost(player)) {
            for (let player of game.getPlayers()) {
                game.removePlayer(player);
                const message = {
                    message: GAME_LEAVE,
                    reason: "Host disconnected"
                };
                sendMessage(JSON.stringify(message), player);
            }
            _gamemanager2.default.destroyGame(game);
        } else {
            for (let p of game.getPlayers()) {
                if (p.uid != player.uid) {
                    sendMessage(JSON.stringify({ message: PLAYER_LEAVE, player: player.getJson(game.getPlayerId(player)) }), player);
                }
            }
            game.removePlayer(player);
        }
    }
}
class Message {
    constructor() {
        this.gameId = null;
    }
}
exports.Server = Server;
exports.Message = Message;

server.on("message", function (msg, info) {
    const message = JSON.parse(msg);
    const player = _player2.default.fromData(info, message);
    let game = null;
    if (message.gameId != null) {
        game = _gamemanager2.default.getGameById(message.gameId);
    }
    switch (message.message) {
        case MATCHMAKING_JOIN:
            joinMatchmaking(player);
            printState();
            break;
        case GAME_CREATE:
            _gamemanager2.default.confirmGame(game.id);
            printState();
            break;
        case GAME_JOIN:
            game.confirmPlayer(player);
            break;
        case GAME_PING:
            game.confirmPlayer(player);
            break;
        case GAME_LEAVE:
            Server.removePlayer(game, player);
            printState();
            break;
        default:
            break;
    }
});
server.bind(3000);
function joinMatchmaking(player) {
    let game = _gamemanager2.default.findGame();
    if (game) {
        Server.addPlayer(game, player);
    } else {
        const game = _gamemanager2.default.createGame(player);
        const message = {
            message: GAME_CREATE,
            game: game.getJson()
        };
        sendMessage(JSON.stringify(message), player);
    }
}
function sendMessage(message, player) {
    server.send(message, player.matchmakingPort, player.ip);
}
function printState() {
    console.log("Current state:");
    for (let game of _gamemanager2.default.games) {
        let log = "\n";
        log += "+---------------------------------+\n";
        log += "|Game                             |\n";
        log += "+-------+-------------------------+\n";
        log += "|id     |" + pad(game.id, 25) + "|\n";
        log += "+-------+-------------------------+\n";
        log += "|players                          |\n";
        for (let i = 0; i < game.players.length; i++) {
            let player = game.players[i];
            log += "+-------+---------+---------------+\n";
            log += "|       |ip       |" + pad(player.ip, 15) + "|\n";
            log += "|       |UDP port |" + pad(player.udpPort, 15) + "|\n";
            log += "|       |TCP port |" + pad(player.tcpPort, 15) + "|\n";
            log += "|       |MM port  |" + pad(player.matchmakingPort, 15) + "|\n";
            if (game.probation[i]) {
                log += "|       |probation|0              |\n";
            } else {
                log += "|       |probation|" + pad((game.probationTimeout[i] - Date.now()) / 1000, 15) + "|\n";
            }
        }
        log += "+-------+---------+---------------+\n";
        log += "|host   |ip       |" + pad(game.host.ip, 15) + "|\n";
        log += "|       |UDP port |" + pad(game.host.udpPort, 15) + "|\n";
        log += "|       |TCP port |" + pad(game.host.tcpPort, 15) + "|\n";
        log += "|       |MM port  |" + pad(game.host.matchmakingPort, 15) + "|\n";
        log += "+-------+---------+---------------+\n";
        log += "\n";
        console.log(log);
    }
}
function pad(object, targetLength) {
    let str = object.toString();
    while (str.length < targetLength) {
        str += " ";
    }
    return str;
}