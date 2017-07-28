import {Injectable, isDevMode} from '@angular/core';
import {Http, Response} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {AuthResponse} from '../shared/auth-response';

@Injectable()
export class AuthService {
    private baseUrl = isDevMode() ? 'http://localhost:3333' : 'https://api.8bitwarframe.com';

    constructor(private http: Http) {
    }

    register(alias: string, email: string, password: string, password2: string): Promise<AuthResponse> {
        return this.http.post(`${this.baseUrl}/register`, {alias: alias, email: email, password: password, password2: password2})
                   .toPromise()
                   .then(AuthService.extractData)
                   .catch(console.error);
    }

    login(email: string, password: string): Promise<AuthResponse> {
        return this.http.post(`${this.baseUrl}/login`, {email: email, password: password})
                   .toPromise()
                   .then(AuthService.extractData)
                   .catch(console.error);
    }

    private static extractData(res: Response) {
        return <AuthResponse>res.json() || null;
    }
}
