import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RainfallService } from '../rainfall.service';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-video-preview',
  templateUrl: './video-preview.page.html',
  styleUrls: ['./video-preview.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideoPreviewPage implements OnInit {
  video:any;
  userData:any;
  url;
  format;
  videoStatus: boolean = false;
  fileName:any;


  constructor(private rainfallService:RainfallService,private route:ActivatedRoute) { 
    this.route.queryParams.subscribe(res => {
      console.log(res,'params');
      
      var mobile = JSON.parse(res && res.data);
      mobile && this.getProfile(mobile)
    })
  }

   writeToClipboard = async (data) => {
    await Clipboard.write({
      string: data
    });
    this.rainfallService.presentToast('Link copied..')

  };

  ngOnInit() {
  }

    getProfile(mobile) {
      this.rainfallService.getProfile(mobile).subscribe(res =>{
        res && (this.userData = res);
        console.log(this.userData,'userData');
        
      })
    }

  onSelectFile(event) {
    this.fileName = event.target.files[0].name;
    this.url ='';
    const file = event.target.files && event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      if(file.type.indexOf('image')> -1){
        this.format = 'image';
      } else if(file.type.indexOf('video')> -1){
        this.format = 'video';
      }
      reader.onload = (event) => {
        this.url = (<FileReader>event.target).result;
        var base64str = this.url.substring(this.url.indexOf(',') + 1)
        var decoded = atob(base64str);
        if(decoded.length < 10485760 ) {
          console.log(decoded.length,'valid size');
        } else {
          console.log(decoded.length,'invalid valid size');
          this.rainfallService.alertMsg(`Alert`,`You can't upload video more then 10MB`).then(res => {
            this.url = '';
          })
        }
      }
    }
  }

  //  clipBoard() {
  //   var copyText:any = (document.getElementById("myInput") as HTMLElement);
  //   copyText.select();
  //   copyText.setSelectionRange(0, 99999);
  //   navigator.clipboard.writeText(copyText.value);
  //   this.rainfallService.presentToast('Link copied..')
  // }


  submitFile(item,users) {
    let requestJson = {
      date:item.contest_date,
      mobile:users.contestant_mobile,
      video:this.url.split(',')[1],
      filename:this.fileName
    }
    this.rainfallService.submitVideo(requestJson).subscribe(res => {
      if(res.Res == 'Success') {
        this.videoStatus = true;
        this.getProfile(this.userData.contestant_mobile) 
      } else {
        this.rainfallService.alertMsg('Alert',`Video not uploaded`);
        this.videoStatus = false;
      }
      
    })
  }

  anotherFile() {
    this.url = '';
  }

  refresh() {
    this.getProfile(this.userData.contestant_mobile);
  }


}




