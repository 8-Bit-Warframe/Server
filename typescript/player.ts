import {AddressInfo} from "dgram";

export default class Player {
    ip: string;
    port: number;


    constructor(ip: string, port: number) {
        this.ip = ip;
        this.port = port;
    }

    static fromAddressInfo(info: AddressInfo): Player {
        return new Player(info.address, info.port);
    }
}