import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
    private data = {
        alias: undefined,
        email: undefined,
        jwt: undefined
    };

    constructor() {
        this.data.alias = this.load('alias');
        this.data.email = this.load('email');
        this.data.jwt = this.load('jwt');
    }

    get alias() {
        return this.data.alias;
    }

    set alias(alias: string) {
        this.data.alias = alias;
        this.save('alias', alias);
    }

    get email() {
        return this.data.email;
    }

    set email(email: string) {
        this.data.email = email;
        this.save('email', email);
    }

    get jwt() {
        return this.data.jwt;
    }

    set jwt(jwt: string) {
        this.data.jwt = jwt;
        this.save('jwt', jwt);
    }

    private save(key: string, value: string) {
        window.localStorage.setItem(key, value);
    }

    private load(key: string) {
        window.localStorage.getItem(key);
    }
}