import { Component, OnInit } from '@angular/core';
import {BackendService} from "../../backend.service";

@Component({
  selector: 'app-repo-list',
  templateUrl: './repo-list.component.html',
  styleUrls: ['./repo-list.component.css']
})
export class RepoListComponent implements OnInit {
  repos;
  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.repos = this.backendService.repos;
    console.log(this.backendService.repos);
  }
}
