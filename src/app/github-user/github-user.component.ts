import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-github-user',
  templateUrl: './github-user.component.html',
  styleUrls: ['./github-user.component.css']
})
export class GithubUserComponent implements OnInit {
  loggedIn;
  username;
  errorResponse;
  OneResumeUser;
  constructor(private backendService: BackendService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if(this.backendService.isAuthenticated() === true){
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    if (this.loggedIn === true) {
      this.username = this.route.snapshot.params['username'];
      this.backendService.showGithubUser(this.username)
        .subscribe(
          (response) => {
            // console.log(response.json());
            this.OneResumeUser = <string>response.json().data.userRepoData;
            this.backendService.setOneResumeUser(this.OneResumeUser);
            this.backendService.setRepos(this.OneResumeUser[0].githubrepos);
            //////////////////////////////////////
            console.log(this.backendService.repos);
          },
          (error) => {
            this.errorResponse = error.json();
            console.log(this.errorResponse.error);
            if (this.errorResponse.code === 401) {
              this.backendService.logout();
              this.loggedIn = false;
              this.router.navigate(['/']);
            }
          }
        );
    }
  }

  // getUserFromGithub(){
  //   this.backendService.makeGithubRequest();
  // }

}
