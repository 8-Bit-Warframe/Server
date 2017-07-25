import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
    private data = {
        alias: undefined,
        email: undefined,
        jwt: undefined
    };

    constructor() {
        this.data.alias = StorageService.load('alias');
        this.data.email = StorageService.load('email');
        this.data.jwt = StorageService.load('jwt');
    }

    get alias() {
        return this.data.alias;
    }

    set alias(alias: string) {
        this.data.alias = alias;
        StorageService.save('alias', alias);
    }

    get email() {
        return this.data.email;
    }

    set email(email: string) {
        this.data.email = email;
        StorageService.save('email', email);
    }

    get jwt() {
        return this.data.jwt;
    }

    set jwt(jwt: string) {
        this.data.jwt = jwt;
        StorageService.save('jwt', jwt);
    }

    private static save(key: string, value: string) {
        window.localStorage.setItem(key, value);
    }

    private static load(key: string) {
        window.localStorage.getItem(key);
    }
}