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

class Message {
    message: string;
    gameId: number = null;
}

server.on("message", function (msg: string, info: AddressInfo) {
    const player = Player.fromAddressInfo(info);
    const message = JSON.parse(msg) as Message;

    let game: Game = null;
    if (message.gameId != null) {
        game = GameManager.getGameById(message.gameId);
    }
    switch (message.message) {
        case MATCHMAKING_JOIN:
            joinMatchmaking(player);
            console.log("Player joined matchmaking");
            printState();
            break;
        case GAME_CREATE:
            GameManager.createGame().addPlayer(player, true);
            console.log("Game created");
            printState();
            break;
        case GAME_JOIN:
            game.confirmPlayer(player);
            break;
        case GAME_PING:
            game.confirmPlayer(player);
            break;
        case GAME_LEAVE:
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
                game.removePlayer(player);
                for (let player of game.getPlayers()) {
                    sendMessage(JSON.stringify({message: PLAYER_LEAVE, player: player.getJson(false)}), player);
                }
            }
            console.log("Player left game");
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
        game.addPlayer(player);
        const message = {
            message: GAME_JOIN,
            playerId: game.getPlayerId(player),
            game: game.getJson()
        };
        sendMessage(JSON.stringify(message), player);
    } else {
        const message = {
            message: GAME_CREATE,

        };
        sendMessage(JSON.stringify(message), player);
    }
}

function sendMessage(message: string, player: Player) {
    server.send(message, player.port, player.ip);
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
            log += "|       |port     |" + pad(player.port, 15) + "|\n";
            if (game.probation[i]) {
                log += "|       |probation|0              |\n";
            } else {
                log += "|       |probation|" + pad((game.probationTimeout[i] - Date.now()) / 1000, 15) + "|\n";
            }
        }
        log += "+-------+---------+---------------+\n";
        log += "|host   |ip       |" + pad(game.host.ip, 15) + "|\n";
        log += "|       |port     |" + pad(game.host.port, 15) + "|\n";
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