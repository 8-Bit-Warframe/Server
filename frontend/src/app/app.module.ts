import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import {AboutComponent} from "./about/about.component";
import {AuthComponent} from "./auth/auth.component";
import {ImageCarouselComponent} from "./image-carousel/image-carousel.component";
import {ForumComponent} from "./forums/forum/forum.component";
import {ForumSectionComponent} from "./forums/forum-category/forum-category.component";
import {ForumService} from "./forums/services/forum-service";

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
