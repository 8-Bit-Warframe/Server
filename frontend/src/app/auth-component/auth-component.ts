import {Component} from "@angular/core";

@Component({
    selector: 'auth',
    templateUrl: './auth-component.html',
    styleUrls: ['./auth-component.css']
})

export class AuthComponent {
    selectTab(id: number): void {
        if (id == 0) {
            document.getElementById("login").classList.remove("is-active");
            document.getElementById("loginTab").classList.remove("is-active");
            document.getElementById("register").classList.add("is-active");
            document.getElementById("registerTab").classList.add("is-active");
        } else {
            document.getElementById("register").classList.remove("is-active");
            document.getElementById("registerTab").classList.remove("is-active");
            document.getElementById("login").classList.add("is-active");
            document.getElementById("loginTab").classList.add("is-active");
        }
    }
}