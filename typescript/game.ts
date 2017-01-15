import Player from "./player";

export default class Game {
    id: number;
    players: Array<Player> = [];
    probation: Array<boolean> = [];
    host: Player = null;

    constructor(id: number) {
        this.id = id;
    }

    addPlayer(player: Player, host: boolean = false, probation: boolean = true) {
        if (host) {
            if (this.host != null) {
                console.error("Could not set player as host, as a host already exists");
            } else {
                this.host = player;
            }
        }
        const id = this.getAvailableId();
        this.players[id] = player;
        this.probation[id] = true;
    }

    removePlayer(player: Player) {
        this.players.splice(this.players.findIndex(p => p.ip == player.ip && p.port == player.port));
    }

    isHost(player: Player) {
        return player.ip == this.host.ip && player.port == this.host.port;
    }

    private getAvailableId(): number {
        let id = 0;
        while (this.players[id] != null) {
            id++;
        }
        return id;
    }

    getPlayers(): Array<Player> {
        return this.players.filter(player => player != null);
    }

    getPlayerId(player: Player) {
        return this.players.find(p => player.ip == p.ip && player.port == p.port);
    }
}
