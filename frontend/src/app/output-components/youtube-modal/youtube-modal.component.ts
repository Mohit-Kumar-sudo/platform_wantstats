import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube-modal.component.html',
  styleUrls: ['./youtube-modal.component.scss']
})

export class YoutubeDailogComponent implements OnInit {

  urlData: any;
  title: any;
  url: string;

  constructor(public dialogRef: MatDialogRef<YoutubeDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer,
    private userService:UserService) {
      this.dialogRef.disableClose = true;
     }

  ngOnInit() {
    let id = this.data.url.videoid?this.data.url.videoid:(this.data.url.videoId?this.data.url.videoId:this.data.url.id.videoId);
    this.title = this.data.url.title?this.data.url.title:this.data.url.snippet.title;
    this.url = "https://www.youtube.com/embed/" + id + "?autoplay=1";
    this.sendYTHistory();
    this.getSafeUrl();
   window.scroll(0,0)
  }

  doClose() {
    this.urlData = {};
    this.sendYTHistory();
    this.dialogRef.close();
  }

  getSafeUrl() {
    if(this.url){
    this.urlData = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
  }

  sendYTHistory(){
    if(this.title && this.url){
    this.userService.saveYoutubeUserHistory(this.title,this.url).subscribe(data=>{
      // console.log(data);

    },err=>{
      console.log(err);

    })
  }
  }
}
