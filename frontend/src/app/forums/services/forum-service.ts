import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http'
import 'rxjs/add/operator/toPromise';

import {ForumCategory} from '../shared/forum-category';

@Injectable()
export class ForumService {
    constructor(private http: Http) {}

    getCategories(): Promise<ForumCategory[]> {
        return this.http.get('https://api.8bitwarframe.com/forums/')
            .toPromise()
            .then(response => response.json().data as ForumCategory[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}