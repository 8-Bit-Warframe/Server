export default class Game {
    constructor(id) {
        this.idCounter = 0;
        this.players = [];
        this.host = null;
        this.id = id;
    }
    addPlayer(player, host = false) {
        if (host) {
            if (this.host != null) {
                console.error("Could not set player as host, as a host already exists");
            }
            else {
                this.host = player;
            }
        }
        player.setId(this.idCounter++);
        this.players.push(player);
    }
    removePlayer(player) {
        this.players.splice(this.players.findIndex(p => p.ip == player.ip && p.port == player.port));
    }
    isHost(player) {
        return player.ip == this.host.ip && player.port == this.host.port;
    }
}
//# sourceMappingURL=game.js.map