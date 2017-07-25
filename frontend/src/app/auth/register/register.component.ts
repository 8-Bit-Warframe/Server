import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {AuthService} from '../services/auth.service';

@Component({
    selector: 'auth-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    providers: [AuthService]
})

export class RegisterComponent implements OnInit {
    alias = '';
    email = '';
    password = '';
    password2 = '';

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

    constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
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

    private static matchingPasswords(c: FormGroup) {
        return c.value.password === c.value.password2 ? null : {
            matchingPasswords: {
                valid: false
            }
        };
    }
}