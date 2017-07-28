import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {
    private data = {
        alias: undefined,
        email: undefined,
        jwt: undefined
    };
    private observers: StorageListener[] = [];

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
        this.notify('alias', alias);
    }

    get email() {
        return this.data.email;
    }

    set email(email: string) {
        this.data.email = email;
        StorageService.save('email', email);
        this.notify('email', email);
    }

    get jwt() {
        return this.data.jwt;
    }

    set jwt(jwt: string) {
        this.data.jwt = jwt;
        StorageService.save('jwt', jwt);
        this.notify('jwt', jwt);
    }

    subscribe(observer: StorageListener) {
        this.observers.push(observer);
    }

    private notify(key: string, value: string) {
        for (const observer of this.observers) {
            observer(key, value);
        }
    }

    private static save(key: string, value: string) {
        window.localStorage.setItem(key, value);
    }

    private static load(key: string) {
        return window.localStorage.getItem(key);
    }
}

export interface StorageListener {
    (key: string, value: string): void
}