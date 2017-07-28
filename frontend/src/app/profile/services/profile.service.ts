import {Injectable, isDevMode} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {StorageService} from '../../services/storage.service';

@Injectable()
export class ProfileService {
    private baseUrl = isDevMode() ? 'http://localhost:3333' : 'https://api.8bitwarframe.com';
    private headers = new Headers();

    constructor(private http: Http, private storageService: StorageService) {
        storageService.subscribe((key, value) => {
            if (key === 'jwt') this.onJwtChange(value);
        });
        this.onJwtChange(storageService.jwt);
    }

    private onJwtChange(jwt: string) {
        this.headers.set('Authorization', `Bearer ${jwt}`);
    }

    addFriend(alias: string) {
        return this.http.post(`${this.baseUrl}/user/friends`, {alias: alias}, {headers: this.headers})
                   .toPromise()
                   .catch(console.error);
    }

    acceptFriendRequest(id: string) {
        return this.http.post(`${this.baseUrl}/user/friends/accept`, {id: id}, {headers: this.headers})
                   .toPromise()
                   .catch(console.error);
    }

    rejectFriendRequest(id: string) {
        return this.http.post(`${this.baseUrl}/user/friends/reject`, {id: id}, {headers: this.headers})
                   .toPromise()
                   .catch(console.error);
    }

    getFriends(): Promise<any> {
        return this.http.get(`${this.baseUrl}/user/friends`, {headers: this.headers})
                   .toPromise()
                   .then(value => value.json())
                   .catch(console.error);
    }
}
