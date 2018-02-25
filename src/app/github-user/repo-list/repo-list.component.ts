import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BackendService} from "../../backend.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.css']
})
export class RepoListComponent implements OnInit {
  username: any;
  errorResponse: any;
  repos;
  @Output() OneResumeUser: EventEmitter<string> = new EventEmitter<string>();
  constructor(private backendService: BackendService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.username = this.route.snapshot.params['username'];
          this.backendService.showGithubUser(this.username)
            .subscribe(
              (response) => {
                  this.OneResumeUser.emit(<string>response.json().data.userRepoData);
                  this.repos = <string>response.json().data.userRepoData[0].githubrepos;
                  console.log(this.OneResumeUser);
                },
              (error) => {
                this.errorResponse = error.json();
                console.log(this.errorResponse.error);
              }
            );
        }
      );
  }
}
