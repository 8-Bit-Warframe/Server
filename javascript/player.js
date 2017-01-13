export default class Player {
    constructor(ip, port) {
        this.id = -1;
        this.ip = ip;
        this.port = port;
    }
    setId(id) {
        this.id = id;
    }
    static fromAddressInfo(info) {
        return new Player(info.address, info.port);
    }
}
//# sourceMappingURL=player.js.map