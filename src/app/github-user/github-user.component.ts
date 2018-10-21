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
  repos;
  constructor(private backendService: BackendService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if(this.backendService.isAuthenticated() === true){
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    if (this.loggedIn === true) {
      if (this.OneResumeUser == ''){
        this.username = this.route.snapshot.params['username'];
        this.backendService.showGithubUser(this.username)
          .subscribe(
            (response) => {
              this.OneResumeUser = <string>response.json().data.userRepoData;
              this.backendService.setOneResumeUser(this.OneResumeUser);
              this.repos = this.OneResumeUser[0].githubrepos;
            },
            (error) => {
              this.errorResponse = error.json();
              console.log(this.errorResponse.error);
            }
          );
      }
      }
  }
  onNotify(OneResumeUser): void {
    this.backendService.setOneResumeUser(OneResumeUser);
    this.OneResumeUser = OneResumeUser;
    this.repos = this.OneResumeUser[0].githubrepos;
    console.log(this.OneResumeUser);
    this.backendService.setRepos(this.repos);
  }
}
