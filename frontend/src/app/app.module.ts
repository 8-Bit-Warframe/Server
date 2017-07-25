import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {MdInputModule} from '@angular/material';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {AuthComponent} from './auth/auth.component';
import {ImageCarouselComponent} from './image-carousel/image-carousel.component';
import {ForumComponent} from './forums/forum/forum.component';
import {ForumSectionComponent} from './forums/forum-category/forum-category.component';
import {ForumService} from './forums/services/forum-service';
import {RegisterComponent} from './auth/register/register.component';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        ForumComponent,
        ForumSectionComponent,
        AuthComponent,
        RegisterComponent,
        ImageCarouselComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpModule,
        MdInputModule,
        ReactiveFormsModule,
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
