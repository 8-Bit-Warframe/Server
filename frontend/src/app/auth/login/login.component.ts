import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../services/auth.service';
import {StorageService} from '../../services/storage.service';

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

    constructor(private formBuilder: FormBuilder, private authService: AuthService, private storageService: StorageService) {
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
                this.storageService.alias = value.user.alias;
                this.storageService.email = value.user.email;
                this.storageService.jwt = value.user.jwt;
            } else {
                alert(`Error: ${value.message}`);
            }
        });
    }
}
