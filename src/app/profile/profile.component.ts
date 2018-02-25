import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private backendService: BackendService) { }
  ngOnInit() {
    this.backendService.showUserProfile().subscribe(
      (response) => {
        console.log(response);
      },
      (error) => { console.log(error);}
    );
  }

}
