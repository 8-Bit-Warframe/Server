"use strict";

var _player2 = require("./player");

var _player3 = _interopRequireDefault(_player2);

var _gamemanager = require("./gamemanager");

var _gamemanager2 = _interopRequireDefault(_gamemanager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dgram = require("dgram");
var server = dgram.createSocket("udp4");
var PING_INTERVAL = 1000;
var PING_TIMEOUT = 10000;
var MATCHMAKING_JOIN = "matchmaking_join";
var MATCHMAKING_PING = "matchmaking_ping";
var MATCHMAKING_LEAVE = "matchmaking_leave";
var GAME_CREATE = "game_create";
var GAME_JOIN = "game_join";
var GAME_PING = "game_ping";
var GAME_LEAVE = "game_leave";
var PLAYER_JOIN = "player_join";
var PLAYER_LEAVE = "player_leave";

var Message = function Message() {
    _classCallCheck(this, Message);

    this.gameId = null;
};

server.on("message", function (msg, info) {
    var player = _player3.default.fromAddressInfo(info);
    var message = JSON.parse(msg);
    var game = null;
    if (message.gameId != null) {
        game = _gamemanager2.default.getGameById(message.gameId);
    }
    switch (message.message) {
        case MATCHMAKING_JOIN:
            joinMatchmaking(player);
            break;
        case GAME_CREATE:
            _gamemanager2.default.createGame().addPlayer(player, true);
            break;
        case GAME_LEAVE:
            if (game.isHost(player)) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = game.getPlayers()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _player = _step.value;

                        game.removePlayer(_player);
                        var _message = {
                            message: GAME_LEAVE,
                            reason: "Host disconnected"
                        };
                        server.send(JSON.stringify(_message), _player);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                _gamemanager2.default.destroyGame(game);
            } else {
                game.removePlayer(player);
            }
            break;
        case GAME_PING:
            break;
        default:
            break;
    }
});
server.bind(3000);
function joinMatchmaking(player) {
    var game = _gamemanager2.default.findGame();
    if (game) {
        game.addPlayer(player);
        var message = {
            message: GAME_JOIN,
            playerId: game.getPlayerId(player),
            game: game.getJson()
        };
        sendMessage(JSON.stringify(message), player);
    } else {
        var _message2 = {
            message: GAME_CREATE
        };
        sendMessage(JSON.stringify(_message2), player);
    }
}
function sendMessage(message, player) {
    server.send(message, player.port, player.ip);
}