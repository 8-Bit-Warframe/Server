import Player from "./player";
import GameManager from "./gamemanager";
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
class Message {
    constructor() {
        this.gameId = null;
    }
}
server.on("message", function (msg, info) {
    const player = Player.fromAddressInfo(info);
    const message = JSON.parse(msg);
    let game = null;
    if (message.gameId != null) {
        game = GameManager.getGameById(message.gameId);
    }
    switch (message.message) {
        case MATCHMAKING_JOIN:
            joinMatchmaking(player);
            break;
        case GAME_CREATE:
            GameManager.createGame().addPlayer(player, true);
            break;
        case GAME_LEAVE:
            if (game.isHost(player)) {
                for (let player of game.getPlayers()) {
                    game.removePlayer(player);
                    const message = {
                        message: GAME_LEAVE,
                        reason: "Host disconnected"
                    };
                    server.send(JSON.stringify(message), player);
                }
                GameManager.destroyGame(game);
            }
            else {
                game.removePlayer(player);
            }
            break;
        case GAME_PING:
            break;
        default:
            break;
    }
});
function joinMatchmaking(player) {
    let game = GameManager.findGame();
    if (game) {
        game.addPlayer(player);
        const message = {
            message: GAME_JOIN,
            players: game.getPlayers(),
            playerId: game.getPlayerId(player)
        };
        sendMessage(JSON.stringify(message), player);
    }
    else {
        const message = {
            message: GAME_CREATE,
        };
        sendMessage(JSON.stringify(message), player);
    }
}
function sendMessage(message, player) {
    server.send(message, player.port, player.ip);
}
//# sourceMappingURL=server.js.map