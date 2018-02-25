import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BackendService} from "../backend.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
declare var $: any;
@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})
export class ResumeComponent implements OnInit {

  constructor(private backendService: BackendService, private router: Router) { }
  loggedIn = false;
  OneResumeResponse;
  noUser = false;
  graduation = false;
  postGraduation = false;
  diploma = false;
  phd = false;
  noEducation = true;

  educationDegreeForm: FormGroup;
  skillForm: FormGroup;
  achievementForm: FormGroup;
  workForm: FormGroup;

  @ViewChild ('addEduModal') addEduModal: ElementRef;
  @ViewChild ('addSkillModal') addSkillModal: ElementRef;
  @ViewChild ('addWorkModal') addWorkModal: ElementRef;
  @ViewChild ('addAchModal') addAchModal: ElementRef;
  ngOnInit() {
      this.educationDegreeForm = new FormGroup({
      college: new FormControl(null),
      degree: new FormControl(null),
      stream: new FormControl(null),
      type: new FormControl(null),
      educationFrom: new FormControl(null),
      educationTo: new FormControl(null),
      marks: new FormControl(null),
    });
    this.workForm = new FormGroup({
      'positionOfWork': new FormControl(null),
      'company': new FormControl(null),
      'location': new FormControl(null),
      'workFrom': new FormControl(null),
      'workTo': new FormControl(null),
      'workDesc': new FormControl(null),
    });

    this.skillForm = new FormGroup({
      'inputSkill': new FormControl(null),
    });

    this.achievementForm = new FormGroup({
      'achDesc': new FormControl(null),
    });
    if (this.backendService.isAuthenticated() === true) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
    if (this.loggedIn === true) {
      console.log('here');
      this.getAllData();
    }else {
      this.backendService.loggedIn = false;
      this.loggedIn = false;
      this.router.navigate(['/']);
    }
  }
  addEducation() {
    $(this.addEduModal.nativeElement).modal('show');
  }
  addWork() {
    $(this.addWorkModal.nativeElement).modal('show');
  }
  addSkill() {
    $(this.addSkillModal.nativeElement).modal('show');
  }
  addAchievement() {
    $(this.addAchModal.nativeElement).modal('show');
  }
 printResume(){
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>          
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
openAddGraduation(){
   this.noEducation = false;
   this.graduation = true;
   this.postGraduation  = false;
   this.phd  = false;
   this.diploma  = false;
}
openAddPhD(){
  this.noEducation = false;
   this.graduation = false;
   this.postGraduation  = false;
   this.phd  = true;
   this.diploma  = false;
}
openAddPostGraduation(){
  this.noEducation = false;
   this.graduation = false;
   this.postGraduation  = true;
   this.phd  = false;
   this.diploma  = false;
}
openAddDiploma(){
  this.noEducation = false;
   this.graduation = false;
   this.postGraduation  = false;
   this.phd  = false;
   this.diploma  = true;
}
refreshEducation(){
  this.noEducation = true;
  this.graduation = false;
  this.postGraduation  = false;
  this.phd  = false;
  this.diploma  = false;
}
onEducationSubmit(){
  if (this.diploma){
    this.educationDegreeForm.patchValue({
      type: 'diploma'
    });
  } else if (this.graduation) {
    this.educationDegreeForm.patchValue({
      type: 'graduation'
    });
  } else if (this.postGraduation) {
      this.educationDegreeForm.patchValue({
        type: 'post_graduation'
      });
  } else if (this.phd){
    this.educationDegreeForm.patchValue({
      type: 'post_graduation'
    });
  }
  console.log(this.educationDegreeForm);
  const sendJson  = (JSON.parse(JSON.stringify(this.educationDegreeForm.value)));
  this.backendService.onEducationSubmit(JSON.stringify(sendJson))
    .subscribe(
      (response) => {
        this.educationDegreeForm.reset();
        console.log(response.json());
        $(this.addEduModal.nativeElement).modal('hide');
        this.getAllData();
      },
      (error) => {console.log(error.json()); }
    );
}
onWorkSubmit(){
 console.log(this.workForm);
  const sendJson  = (JSON.parse(JSON.stringify(this.workForm.value)));
  this.backendService.onWorkSubmit(JSON.stringify(sendJson))
    .subscribe(
      (response) => {
        this.workForm.reset();
        console.log(response.json());
        $(this.addWorkModal.nativeElement).modal('hide');
        this.getAllData();
      },
      (error) => {console.log(error.json()); }
    );
}
onSkillSubmit() {
  console.log(this.skillForm);
  this.backendService.onSkillSubmit(JSON.stringify(this.skillForm.value)).subscribe(
      (response) => {
        this.skillForm.reset();
        console.log(response.json());
        $(this.addSkillModal.nativeElement).modal('hide');
        this.getAllData();
      },
      (error) => {console.log(error.json()); }
    );
}
onAchievementSubmit() {
  console.log(this.achievementForm);
  console.log(this.achievementForm);
  const sendJson  = (JSON.parse(JSON.stringify(this.achievementForm.value)));
 this.backendService.onAchievementSubmit(JSON.stringify(sendJson))
    .subscribe(
      (response) => {
        this.achievementForm.reset();
        console.log(response.json());
        $(this.addAchModal.nativeElement).modal('hide');
        this.getAllData();
      },
      (error) => {console.log(error.json()); }
    );
  }

  getAllData(){
    this.backendService.showGithubData()
      .subscribe(
        (response) => {
          this.OneResumeResponse = <string>response.json().data.userRepoData;
          console.log(this.OneResumeResponse);
          if (this.OneResumeResponse.githubusers == '') {
            this.noUser = true;
            console.log(this.noUser);
          }else {
            this.noUser = false;
            console.log(this.noUser);
            this.backendService.setOneResumeResponse(this.OneResumeResponse);
          }
        },
        (error) => {
          console.log(error.json().error);
          if (error.json().code === 401) {
            this.backendService.logout();
            this.loggedIn = false;
            this.router.navigate(['/']);
          }
        }
      );
  }
  deleteEducation(id){
    console.log(id);
    this.backendService.onDeleteEducation(id).subscribe(
      (response) => {
        console.log(response.json());
        this.getAllData();
        },
      () => {}
      );
  }
  deleteWork(id){
    console.log(id);
    this.backendService.onDeleteWork(id).subscribe(
      (response) => {
        console.log(response.json());
        this.getAllData();
      },
      () => {}
      );
  }
  deleteSkill(id){
    console.log(id);
    this.backendService.onDeleteSkill(id).subscribe(
      (response) => {
        console.log(response.json());
        this.getAllData();
      },
      (error) => {console.log(error.json());}
    );
  }
  deleteAchievement(id){
    console.log(id);
    this.backendService.onDeleteAchievement(id).subscribe(
      (response) => {
        console.log(response.json());
        this.getAllData();
      },
      (error) => {console.log(error.json());}
    );
  }
}
