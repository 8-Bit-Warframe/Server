import {Component} from '@angular/core';
import {StorageService} from './services/storage.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    private loggedIn: boolean;

    constructor(private storageService: StorageService) {
        storageService.subscribe((key, value) => {
            if (key === 'jwt') {
                this.loggedIn = value && value.length > 0;
            }
        });
        this.loggedIn = storageService.jwt && storageService.jwt.length > 0;
    }

    logout() {
        this.storageService.alias = '';
        this.storageService.email = '';
        this.storageService.jwt = '';
    }
}
