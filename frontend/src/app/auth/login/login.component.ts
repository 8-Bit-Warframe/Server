import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../services/auth.service';

@Component({
    selector: 'auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [AuthService]
})

export class LoginComponent implements OnInit {

    email = '';
    password = '';

    form: FormGroup;

    constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'email': [this.email, [
                Validators.required,
                Validators.email
            ]],
            'password': [this.password, [
                Validators.required
            ]]
        });
    }

    onSubmit() {
        this.authService.login(this.email, this.password).then(value => {
            if (value.success) {
                window.localStorage.setItem('alias', value.user.alias);
                window.localStorage.setItem('email', value.user.email);
                window.localStorage.setItem('jwt', value.user.jwt);
            } else {
                alert(`Error: ${value.message}`);
            }
        });
    }
}
