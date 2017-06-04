import Player from "./player";
import {Server} from "./server";
import Timer = NodeJS.Timer;

export default class Game {
    id: number;
    players: Array<Player> = [];
    probation: Array<Timer> = [];
    probationTimeout: Array<number> = [];
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
        if (player.uid != this.host.uid) {
            const game = this;
            this.probation[id] = setTimeout(function(){Server.removePlayer(game, this.players[id])}, 60000);
            this.probationTimeout[id] = Date.now() + 60000;
        }
    }

    confirmPlayer(player: Player) {
        const id = this.players.findIndex(p => p.uid == player.uid);
        clearTimeout(this.probation[id]);
        const game = this;
        this.probation[id] = setTimeout(function(){Server.removePlayer(game, player)}, 10000);
        this.probationTimeout[id] = Date.now() + 10000;
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

    getPlayerId(player: Player): number {
        return this.players.findIndex(p => player.uid == p.uid);
    }

    getJson(): Object {
        const players = [];
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i] == null) {
                players[i] = null;
            } else {
                players[i] = this.players[i].getJson(i);
            }
        }
        return {
            id: this.id,
            players: players
        };
    }
}