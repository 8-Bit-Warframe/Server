import {AddressInfo} from "dgram";

export default class Player {
    ip: string;
    port: number;
    id: number = -1;


    constructor(ip: string, port: number) {
        this.ip = ip;
        this.port = port;
    }

    setId(id: number) {
        this.id = id;
    }

    static fromAddressInfo(info: AddressInfo): Player {
        return new Player(info.address, info.port);
    }
}