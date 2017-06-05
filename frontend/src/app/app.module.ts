import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./home-component/home-component";
import {ImageCarouselComponent} from "./image-carousel/image-carousel-component";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ImageCarouselComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot([
            {
                path: '/',
                component: HomeComponent
            }
        ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
