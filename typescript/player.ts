import {AddressInfo} from "dgram";

export default class Player {
    ip: string;
    port: number;
    uid: string;

    constructor(ip: string, port: number) {
        this.ip = ip;
        this.port = port;
        this.uid = ip + port;
    }

    getJson(): string {
        return JSON.stringify({
            ip: this.ip,
            port: this.port
        });
    }

    static fromAddressInfo(info: AddressInfo): Player {
        return new Player(info.address, info.port);
    }
}