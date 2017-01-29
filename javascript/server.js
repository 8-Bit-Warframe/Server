"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Message = exports.Server = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

var Server = function () {
    function Server() {
        _classCallCheck(this, Server);
    }

    _createClass(Server, null, [{
        key: "addPlayer",
        value: function addPlayer(game, player) {
            game.addPlayer(player);
            var playerJoinMessage = {
                message: PLAYER_JOIN,
                player: player.getJson(game.getPlayerId(player))
            };
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = game.players[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var p = _step.value;

                    if (p.uid != player.uid) {
                        sendMessage(JSON.stringify(playerJoinMessage), p);
                    }
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

            var gameJoinMessage = {
                message: GAME_JOIN,
                playerId: game.getPlayerId(player),
                game: game.getJson()
            };
            sendMessage(JSON.stringify(gameJoinMessage), player);
        }
    }, {
        key: "removePlayer",
        value: function removePlayer(game, player) {
            if (game.isHost(player)) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = game.getPlayers()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _player = _step2.value;

                        game.removePlayer(_player);
                        var message = {
                            message: GAME_LEAVE,
                            reason: "Host disconnected"
                        };
                        sendMessage(JSON.stringify(message), _player);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                _gamemanager2.default.destroyGame(game);
            } else {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = game.getPlayers()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var p = _step3.value;

                        if (p.uid != player.uid) {
                            sendMessage(JSON.stringify({ message: PLAYER_LEAVE, player: player.getJson(game.getPlayerId(player)) }), player);
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                game.removePlayer(player);
            }
        }
    }]);

    return Server;
}();

var Message = function Message() {
    _classCallCheck(this, Message);

    this.gameId = null;
};

exports.Server = Server;
exports.Message = Message;

server.on("message", function (msg, info) {
    var message = JSON.parse(msg);
    var player = _player3.default.fromData(info, message);
    var game = null;
    if (message.gameId != null) {
        game = _gamemanager2.default.getGameById(message.gameId);
    }
    switch (message.message) {
        case MATCHMAKING_JOIN:
            joinMatchmaking(player);
            printState();
            break;
        case GAME_CREATE:
            _gamemanager2.default.createGame(player);
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
    var game = _gamemanager2.default.findGame();
    if (game) {
        Server.addPlayer(game, player);
    } else {
        var _game = _gamemanager2.default.createGame(player);
        var message = {
            message: GAME_CREATE,
            game: _game.getJson()
        };
        sendMessage(JSON.stringify(message), player);
    }
}
function sendMessage(message, player) {
    server.send(message, player.matchmakingPort, player.ip);
}
function printState() {
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = _gamemanager2.default.games[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var game = _step4.value;

            var log = "\nCurrent state:\n";
            log += "+---------------------------------+\n";
            log += "|Game                             |\n";
            log += "+-------+-------------------------+\n";
            log += "|id     |" + pad(game.id, 25) + "|\n";
            log += "+-------+-------------------------+\n";
            log += "|players                          |\n";
            for (var i = 0; i < game.players.length; i++) {
                var player = game.players[i];
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
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }
}
function pad(object, targetLength) {
    var str = object.toString();
    while (str.length < targetLength) {
        str += " ";
    }
    return str;
}