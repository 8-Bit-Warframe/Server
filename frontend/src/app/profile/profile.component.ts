import {Component, OnInit} from '@angular/core';
import {ProfileService} from './services/profile.service';
import {StorageService} from '../services/storage.service';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    providers: [ProfileService]
})

export class ProfileComponent implements OnInit {
    private user = {
        alias: '',
        email: '',
        friends: [],
        incomingFriendRequests: [],
        outgoingFriendRequests: []
    };
    friendAlias: string;

    constructor(private storageService: StorageService, private profileService: ProfileService) {
        this.user.alias = storageService.alias;
        this.user.email = storageService.email;
    }

    ngOnInit() {
        this.getFriends();
    }

    addFriend() {
        this.profileService.addFriend(this.friendAlias)
            .then(value => this.getFriends())
            .catch(console.error);
    }

    acceptFriend(id: string) {
        this.profileService.acceptFriendRequest(id)
            .then(value => this.getFriends())
            .catch(console.error);
    }

    rejectFriend(id: string) {
        this.profileService.rejectFriendRequest(id)
            .then(value => this.getFriends())
            .catch(console.error);
    }

    getFriends() {
        this.profileService.getFriends().then(value => {
            this.user.friends = value.friends;
            this.user.incomingFriendRequests = value.incomingFriendRequests;
            this.user.outgoingFriendRequests = value.outgoingFriendRequests;
        });
    }
}