import {Component} from "@angular/core";

declare const componentHandler: any;

@Component({
    selector: 'auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})

export class AuthComponent {
    alias: string = "";
    email: string = "";
    password: string = "";
    password2: string = "";

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
    ngAfterViewInit() {
        componentHandler.upgradeAllRegistered();
    }
    register() {
        console.log(this.alias + ", " + this.email + ", " + this.password + ", " + this.password2);
    }
    login() {
        console.log(this.email + ", " + this.password);
    }
}