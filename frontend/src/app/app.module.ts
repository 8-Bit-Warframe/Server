import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./home-component/home-component";
import {AboutComponent} from "./about-component/about-component";
import {AuthComponent} from "./auth-component/auth-component";
import {ImageCarouselComponent} from "./image-carousel-component/image-carousel-component";
import {ForumComponent} from "./forums/forum-component/forum-component";
import {ForumSectionComponent} from "./forums/forum-category-component/forum-category-component";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        ForumComponent,
        ForumSectionComponent,
        AuthComponent,
        ImageCarouselComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
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
                path: 'forums',
                component: ForumComponent
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
