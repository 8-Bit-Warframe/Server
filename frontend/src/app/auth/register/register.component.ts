import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {AuthService} from '../services/auth.service';
import {StorageService} from '../../services/storage.service';

@Component({
    selector: 'auth-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    providers: [AuthService]
})

export class RegisterComponent implements OnInit {
    form: FormGroup;
    formErrors = {
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

    constructor(private formBuilder: FormBuilder, private authService: AuthService, private storageService: StorageService, private router: Router) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
                'alias': ['', [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(24)
                ]],
                'email': ['', [
                    Validators.required,
                    Validators.email
                ]],
                'password': ['', [
                    Validators.required,
                    Validators.minLength(5)
                ]],
                'password2': ['', [
                    Validators.required
                ]]
            },
            {
                validator: RegisterComponent.matchingPasswords
            });
        this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    }

    onValueChanged(data?: FocusEvent) {
        if (!this.form) return;

        if (data && data.target) {
            this.form.get((<HTMLElement>data.target).attributes.getNamedItem('formControlName').value).markAsDirty();
        }

        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = this.form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] = messages[key];
                }
            }
        }
        if (this.form.errors && this.form.errors.matchingPasswords) {
            this.formErrors.password2 = this.validationMessages.password2.matchingPasswords;
            this.form.get('password2').setErrors({
                matchingPasswords: {
                    valid: false
                }
            });
        }
    }

    onSubmit() {
        let data = this.form.value;
        this.authService.register(data.alias, data.email, data.password, data.password2).then(value => {
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

    private static matchingPasswords(c: FormGroup) {
        return c.value.password === c.value.password2 ? null : {
            matchingPasswords: {
                valid: false
            }
        };
    }
}