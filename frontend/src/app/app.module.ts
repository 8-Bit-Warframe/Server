import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./home-component/home-component";
import {AboutComponent} from "./about-component/about-component";
import {AuthComponent} from "./auth-component/auth-component";
import {ImageCarouselComponent} from "./image-carousel-component/image-carousel-component";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        AuthComponent,
        ImageCarouselComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'auth',
                component: AuthComponent
            }
        ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
