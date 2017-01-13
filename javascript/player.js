export default class Player {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
    }
    static fromAddressInfo(info) {
        return new Player(info.address, info.port);
    }
}
//# sourceMappingURL=player.js.map