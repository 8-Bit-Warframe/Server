"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(ip, matchmakingPort, udpPort, tcpPort) {
        _classCallCheck(this, Player);

        this.ip = ip;
        this.matchmakingPort = matchmakingPort;
        this.udpPort = udpPort;
        this.tcpPort = tcpPort;
        this.uid = ip + udpPort + tcpPort;
    }

    _createClass(Player, [{
        key: "getJson",
        value: function getJson(id) {
            return {
                ip: this.ip,
                udpPort: this.udpPort,
                tcpPort: this.tcpPort,
                id: id
            };
        }
    }], [{
        key: "fromData",
        value: function fromData(info, message) {
            return new Player(info.address, info.port, message.udpPort, message.tcpPort);
        }
    }]);

    return Player;
}();

exports.default = Player;