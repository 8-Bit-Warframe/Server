import {AfterViewInit, Component} from '@angular/core';

import {AuthService} from './services/auth.service';

declare const componentHandler: any;

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    providers: [AuthService]
})

export class AuthComponent implements AfterViewInit {
    alias = '';
    email = '';
    password = '';
    password2 = '';

    constructor(private authService: AuthService) {}
    selectTab(id: number): void {
        if (id === 0) {
            document.getElementById('login').classList.remove('is-active');
            document.getElementById('loginTab').classList.remove('is-active');
            document.getElementById('register').classList.add('is-active');
            document.getElementById('registerTab').classList.add('is-active');
        } else {
            document.getElementById('register').classList.remove('is-active');
            document.getElementById('registerTab').classList.remove('is-active');
            document.getElementById('login').classList.add('is-active');
            document.getElementById('loginTab').classList.add('is-active');
        }
    }
    ngAfterViewInit() {
        componentHandler.upgradeAllRegistered();
    }
    register() {
        this.authService.register(this.alias, this.email, this.password, this.password2).then(value => {
            if (value.success) {
                window.localStorage.setItem('alias', value.user.alias);
                window.localStorage.setItem('email', value.user.email);
                window.localStorage.setItem('jwt', value.user.jwt);
            } else {
                // error
            }
        });
    }
    login() {
        this.authService.login(this.email, this.password).then(value => {
            if (value.success) {
                window.localStorage.setItem('alias', value.user.alias);
                window.localStorage.setItem('email', value.user.email);
                window.localStorage.setItem('jwt', value.user.jwt);
            } else {
                // error
            }
        });
    }
}
