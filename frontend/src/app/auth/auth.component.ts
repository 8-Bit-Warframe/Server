import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from './services/auth.service';

declare const componentHandler: any;

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    providers: [AuthService]
})

export class AuthComponent implements OnInit, AfterViewInit {
    alias = '';
    email = '';
    password = '';
    password2 = '';

    registerForm: FormGroup;
    registerFormErrors = {
        'alias': '',
        'email': '',
        'password': '',
        'password2': ''
    };

    validationMessages = {
        'alias': {
            'required': 'Alias is required',
            'minlength': 'Alias must be at least 4 characters long',
            'maxlength': 'Alias cannot be longer than 24 characters long'
        },
        'email': {
            'required': 'Email is required',
            'email': 'Email must be valid'
        },
        'password': {
            'required': 'Password is required',
            'minlength': 'Password must be at least 5 characters long'
        },
        'password2': {
            'required': 'Confirm password is required',
            'matchingPasswords': 'Passwords must match'
        }
    };

    constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    }

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

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
                'alias': [this.alias, [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(24)
                ]],
                'email': [this.email, [
                    Validators.required,
                    Validators.email
                ]],
                'password': [this.password, [
                    Validators.required,
                    Validators.minLength(5)
                ]],
                'password2': [this.password2, [
                    Validators.required
                ]]
            },
            {
                validator: this.matchingPasswords
            });
        this.registerForm.valueChanges.subscribe(data => this.onRegisterValueChanged(data));
    }

    ngAfterViewInit() {
        componentHandler.upgradeAllRegistered();
    }

    onRegisterValueChanged(data?: FocusEvent) {
        if (!this.registerForm) return;

        if (data && data.target) {
            this.registerForm.get((<HTMLElement>data.target).attributes.getNamedItem('formControlName').value).markAsDirty();
        }

        for (const field in this.registerFormErrors) {
            this.registerFormErrors[field] = '';
            const control = this.registerForm.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.registerFormErrors[field] = messages[key];
                }
            }
        }
        if (this.registerForm.errors && this.registerForm.errors.matchingPasswords) {
            this.registerFormErrors.password2 = this.validationMessages.password2.matchingPasswords;
            this.registerForm.get('password2').setErrors({
                matchingPasswords: {
                    valid: false
                }
            });
        }
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

    private matchingPasswords(c: FormGroup) {
        return c.value.password === c.value.password2 ? null : {
            matchingPasswords: {
                valid: false
            }
        };
    }
}
