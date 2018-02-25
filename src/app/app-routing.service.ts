import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {ProfileComponent} from "./profile/profile.component";
import {GithubComponent} from "./github/github.component";
import {LinkedInComponent} from "./linked-in/linked-in.component";
import {ResumeComponent} from "./resume/resume.component";
import {HomeComponent} from "./home/home.component";
import {GithubUserComponent} from "./github-user/github-user.component";
import {RepoDetailsComponent} from "./github-user/repo-details/repo-details.component";
import {AddUserComponent} from "./add-user/add-user.component";

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  // {path: 'profile', component: ProfileComponent},
  {path: 'github', component: GithubComponent},
  {path: 'oauth2/github', component: AddUserComponent},
  {path: 'github/:username', component: GithubUserComponent, children: [
    { path: ':id', component: RepoDetailsComponent}
  ]},
  {path: 'linkedin', component: LinkedInComponent},
  {path: 'resume', component: ResumeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingService{}
