"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
class Player {
    constructor(ip, matchmakingPort, udpPort, tcpPort) {
        this.ip = ip;
        this.matchmakingPort = matchmakingPort;
        this.udpPort = udpPort;
        this.tcpPort = tcpPort;
        this.uid = ip + udpPort + tcpPort;
    }
    getJson(id) {
        return {
            ip: this.ip,
            udpPort: this.udpPort,
            tcpPort: this.tcpPort,
            id: id
        };
    }
    static fromData(info, message) {
        return new Player(info.address, info.port, message.udpPort, message.tcpPort);
    }
}
exports.default = Player;