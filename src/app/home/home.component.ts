import { Component, OnInit } from '@angular/core';
import {BackendService} from "../backend.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loggedIn;
  constructor(private backendService: BackendService) { }

  ngOnInit() {
    this.loggedIn = false;
    if(this.backendService.loggedIn){
      this.loggedIn = true;
    }
  }
}
