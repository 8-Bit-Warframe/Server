export default class Game {
    constructor(id) {
        this.players = [];
        this.probation = [];
        this.host = null;
        this.id = id;
    }
    addPlayer(player, host = false, probation = true) {
        if (host) {
            if (this.host != null) {
                console.error("Could not set player as host, as a host already exists");
            }
            else {
                this.host = player;
            }
        }
        const id = this.getAvailableId();
        this.players[id] = player;
        this.probation[id] = true;
    }
    removePlayer(player) {
        this.players.splice(this.players.findIndex(p => p.ip == player.ip && p.port == player.port));
    }
    isHost(player) {
        return player.ip == this.host.ip && player.port == this.host.port;
    }
    getAvailableId() {
        let id = 0;
        while (this.players[id] != null) {
            id++;
        }
        return id;
    }
    getPlayers() {
        return this.players.filter(player => player != null);
    }
    getPlayerId(player) {
        return this.players.find(p => player.ip == p.ip && player.port == p.port);
    }
}
//# sourceMappingURL=game.js.map