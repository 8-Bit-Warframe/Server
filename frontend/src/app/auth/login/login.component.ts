import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../services/auth.service';
import {StorageService} from '../../services/storage.service';
import {Router} from '@angular/router';

@Component({
    selector: 'auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [AuthService]
})

export class LoginComponent implements OnInit {
    form: FormGroup;

    constructor(private formBuilder: FormBuilder, private authService: AuthService, private storageService: StorageService, private router: Router) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            'email': ['', [
                Validators.required,
                Validators.email
            ]],
            'password': ['', [
                Validators.required
            ]]
        });
    }

    onSubmit() {
        let data = this.form.value;
        this.authService.login(data.email, data.password).then(value => {
            if (value.success) {
                this.storageService.alias = value.user.alias;
                this.storageService.email = value.user.email;
                this.storageService.jwt = value.user.jwt;
                // noinspection JSIgnoredPromiseFromCall
                this.router.navigateByUrl('/profile');
            } else {
                alert(`Error: ${value.message}`);
            }
        });
    }
}
