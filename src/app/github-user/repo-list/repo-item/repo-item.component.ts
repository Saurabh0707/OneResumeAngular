import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-repo-item',
  templateUrl: './repo-item.component.html',
  styleUrls: ['./repo-item.component.css']
})
export class RepoItemComponent implements OnInit {
  @Input() repo;
  @Input() index: number;
  constructor() { }

  ngOnInit() {
    console.log(this.repo);
  }
}
