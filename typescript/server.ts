import Player from "./player";
import {AddressInfo} from "dgram";
import GameManager from "./gamemanager";
import Game from "./game";

const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const PING_INTERVAL: number = 1000;
const PING_TIMEOUT: number = 10000;

const MATCHMAKING_JOIN: string = "matchmaking_join";
const MATCHMAKING_PING: string = "matchmaking_ping";
const MATCHMAKING_LEAVE: string = "matchmaking_leave";
const GAME_CREATE: string = "game_create";
const GAME_JOIN: string = "game_join";
const GAME_PING: string = "game_ping";
const GAME_LEAVE: string = "game_leave";
const PLAYER_JOIN: string = "player_join";
const PLAYER_LEAVE: string = "player_leave";

class Server {
    static addPlayer(game: Game, player: Player) {
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

    static removePlayer(game: Game, player: Player) {
        if (game.isHost(player)) {
            for (let player of game.getPlayers()) {
                game.removePlayer(player);
                const message = {
                    message: GAME_LEAVE,
                    reason: "Host disconnected"
                };
                sendMessage(JSON.stringify(message), player);
            }
            GameManager.destroyGame(game);
        } else {
            for (let p of game.getPlayers()) {
                if (p.uid != player.uid) {
                    sendMessage(JSON.stringify({message: PLAYER_LEAVE, player: player.getJson(game.getPlayerId(player))}), player);
                }
            }
            game.removePlayer(player);
        }
    }
}

class Message {
    udpPort: number;
    tcpPort: number;
    message: string;
    gameId: number = null;
}

export {Server, Message};

server.on("message", function (msg: string, info: AddressInfo) {
    const message = JSON.parse(msg) as Message;
    const player = Player.fromData(info, message);

    let game: Game = null;
    if (message.gameId != null) {
        game = GameManager.getGameById(message.gameId);
    }
    switch (message.message) {
        case MATCHMAKING_JOIN:
            joinMatchmaking(player);
            printState();
            break;
        case GAME_CREATE:
            GameManager.createGame(player);
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

function joinMatchmaking(player: Player) {
    let game = GameManager.findGame();
    if (game) {
        Server.addPlayer(game, player);
    } else {
        const game: Game = GameManager.createGame(player);
        const message = {
            message: GAME_CREATE,
            game: game.getJson()
        };
        sendMessage(JSON.stringify(message), player);
    }
}

function sendMessage(message: string, player: Player) {
    server.send(message, player.matchmakingPort, player.ip);
}

function printState() {
    for (let game of GameManager.games) {
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

function pad(object: any, targetLength: number): string {
    let str: string = object.toString();
    while (str.length < targetLength) {
        str += " ";
    }
    return str;
}