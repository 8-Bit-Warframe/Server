import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppComponent} from "./app.component";
import {HomeComponent} from './home-component/home-component';
import {ImageCarouselComponent} from './image-carousel/image-carousel-component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ImageCarouselComponent
    ],
    imports: [
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
