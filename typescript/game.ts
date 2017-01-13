import Player from "./player";

export default class Game {
    id: number;
    players: Array<Player> = [];
    host: Player = null;

    constructor(id: number) {
        this.id = id;
    }

    addPlayer(player: Player, host: boolean = false) {
        if (host) {
            if (this.host != null) {
                console.error("Could not set player as host, as a host already exists");
            }
        }
    }

    removePlayer(player: Player) {
        this.players.splice(this.players.findIndex(p => p.ip == player.ip && p.port == player.port));
    }

    isHost(player: Player) {
        return player.ip == this.host.ip && player.port == this.host.port;
    }
}
