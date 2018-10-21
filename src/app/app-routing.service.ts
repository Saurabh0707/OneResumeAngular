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
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {AuthGuard} from "./auth-guard.service";

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'github', canActivate: [AuthGuard], component: GithubComponent},
  {path: 'oauth2/github', component: AddUserComponent},
  {path: 'github/:username', canActivate: [AuthGuard], component: GithubUserComponent, children: [
    { path: ':id', component: RepoDetailsComponent}
  ]},
  {path: 'linkedin', canActivate: [AuthGuard], component: LinkedInComponent},
  {path: 'resume', canActivate: [AuthGuard], component: ResumeComponent},
  {path: 'page-not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/page-not-found'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})

export class AppRoutingService{}
