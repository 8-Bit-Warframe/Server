import {Component} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

import {AuthService} from '../services/auth.service';

@Component({
    selector: 'auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [AuthService]
})

export class LoginComponent {
    email = '';
    password = '';

    constructor(private formBuilder: FormBuilder, private authService: AuthService) {
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
