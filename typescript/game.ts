import Player from "./player";

export default class Game {
    id: number;
    players: Array<Player> = [];
    probation: Array<boolean> = [];
    host: Player = null;

    constructor(id: number) {
        this.id = id;
    }

    addPlayer(player: Player, host: boolean = false) {
        if (host) {
            if (this.host != null) {
                console.error("Could not set player as host, as a host already exists");
            } else {
                this.host = player;
            }
        }
        const id = this.getAvailableId();
        this.players[id] = player;
        this.probation[id] = player.uid != this.host.uid;
    }

    removePlayer(player: Player) {
        this.players.splice(this.players.findIndex(p => p.uid == player.uid), 1);
    }

    isHost(player: Player) {
        return player.uid == this.host.uid;
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
        return this.players.find(p => player.uid == p.uid);
    }

    getJson(): string {
        const players = [];
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] == null) {
                players[i] = null;
            } else {
                players[i] = this.players[i].getJson();
            }
        }
        return JSON.stringify({
            id: this.id,
            players: players
        });
    }
}
