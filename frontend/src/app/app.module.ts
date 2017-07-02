import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./home-component/home-component";
import {AboutComponent} from "./about-component/about-component";
import {AuthComponent} from "./auth-component/auth-component";
import {ImageCarouselComponent} from "./image-carousel-component/image-carousel-component";
import {ForumComponent} from "./forums/forum/forum.component";
import {ForumSectionComponent} from "./forums/forum-category/forum-category.component";
import {ForumService} from "./forums/services/ForumService";

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
        HttpModule,
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
    providers: [ForumService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
