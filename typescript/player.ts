import {AddressInfo} from "dgram";
import {Message} from "./server";

export default class Player {
    ip: string;
    matchmakingPort:number;
    udpPort: number;
    tcpPort: number;
    uid: string;

    constructor(ip: string, matchmakingPort: number, udpPort: number, tcpPort: number) {
        this.ip = ip;
        this.matchmakingPort = matchmakingPort;
        this.udpPort = udpPort;
        this.tcpPort = tcpPort;
        this.uid = ip + udpPort + tcpPort;
    }

    getJson(host: boolean = false): Object {
        return {
            ip: this.ip,
            udpPort: this.udpPort,
            tcpPort: this.tcpPort,
            host: host
        };
    }

    static fromData(info: AddressInfo, message: Message): Player {
        return new Player(info.address, info.port, message.udpPort, message.tcpPort);
    }
}