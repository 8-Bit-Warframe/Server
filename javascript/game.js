"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _server = require("./server");

class Game {
    constructor(id) {
        this.players = [];
        this.probation = [];
        this.probationTimeout = [];
        this.host = null;
        this.id = id;
    }
    addPlayer(player, host = false) {
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
            this.probation[id] = setTimeout(function () {
                _server.Server.removePlayer(this, this.players[id]);
            }, 60000);
            this.probationTimeout[id] = Date.now() + 60000;
        }
    }
    confirmPlayer(player) {
        const id = this.players.findIndex(p => p.uid == player.uid);
        clearTimeout(this.probation[id]);
        this.probation[id] = setTimeout(function () {
            _server.Server.removePlayer(this, player);
        }, 10000);
        this.probationTimeout[id] = Date.now() + 10000;
    }
    removePlayer(player) {
        this.players.splice(this.players.findIndex(p => p.uid == player.uid), 1);
    }
    isHost(player) {
        return player.uid == this.host.uid;
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
        return this.players.findIndex(p => player.uid == p.uid);
    }
    getJson() {
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
exports.default = Game;