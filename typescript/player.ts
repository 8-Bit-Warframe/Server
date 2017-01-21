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

    getJson(host: boolean = false): Object {
        return {
            ip: this.ip,
            port: this.port,
            host: host
        };
    }

    static fromAddressInfo(info: AddressInfo): Player {
        return new Player(info.address, info.port);
    }
}