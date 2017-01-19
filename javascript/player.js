"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function () {
    function Player(ip, port) {
        _classCallCheck(this, Player);

        this.ip = ip;
        this.port = port;
        this.uid = ip + port;
    }

    _createClass(Player, [{
        key: "getJson",
        value: function getJson() {
            var host = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            return JSON.stringify({
                ip: this.ip,
                port: this.port,
                host: host
            });
        }
    }], [{
        key: "fromAddressInfo",
        value: function fromAddressInfo(info) {
            return new Player(info.address, info.port);
        }
    }]);

    return Player;
}();

exports.default = Player;