import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LinkedInComponent } from './linked-in/linked-in.component';
import { GithubComponent } from './github/github.component';
import { ProfileComponent } from './profile/profile.component';
import {AppRoutingService} from './app-routing.service';
import { ResumeComponent } from './resume/resume.component';
import { HomeComponent } from './home/home.component';
import {BackendService} from './backend.service';
import {Ng2Webstorage} from 'ng2-webstorage';
import { GithubUserComponent } from './github-user/github-user.component';
import { RepoListComponent } from './github-user/repo-list/repo-list.component';
import { RepoItemComponent } from './github-user/repo-list/repo-item/repo-item.component';
import { RepoDetailsComponent } from './github-user/repo-details/repo-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LinkedInComponent,
    GithubComponent,
    ProfileComponent,
    ResumeComponent,
    HomeComponent,
    GithubUserComponent,
    RepoListComponent,
    RepoItemComponent,
    RepoDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingService,
    Ng2Webstorage,
  ],
  providers: [BackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
