import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ModalController, PopoverController } from '@ionic/angular';
import { interval } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { RainfallService } from '../rainfall.service';
import { Camera, CameraResultType } from '@capacitor/camera';
import { AnimationController } from '@ionic/angular';
declare var $: any;
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserDashboardPage implements OnInit {



users:any ;
availableContest:any;
rainPreValue:any = null;
leaderBoard:any = [];
winners:any = [];
notifications:any = [];
leaderboardTime:any = 'daily';
winnerTime:any = 'daily';
imageUrl:any;
voucherStatus:boolean = false;
@ViewChild(IonModal) ionModel: IonModal;
@ViewChild ('winnerSlider')nSlide:SwiperComponent;
@ViewChild('popover') popover;
public nSlider:SwiperOptions={
  speed: 800,
  loop: false,
  autoplay: false,
  initialSlide: 0,
  spaceBetween: 0,
  slidesPerView: 3,
  centeredSlides: false
  
}

patternForRain  = "^\d{0,2}+\.\d{0,2}$";
TandC:any = [];
submitRainStatus;

  constructor(private rainfallService: RainfallService,private modalCtrl: ModalController,
    private router:Router,private animationCtrl:AnimationController,public popoverController: PopoverController) { 
      this.getTandC();
  //     this.ionModel.backdropDismiss = false; 
  }


  isOpen = false;

   presentPopover() {
    (document.getElementById('success-popover') as HTMLElement).click();
  }

  rainfallModalClose(){
    this.modalCtrl.dismiss();
  }
  

  ngOnInit() {
    this.getLeaderBoard('daily');
    this.getUserProfile().then(res => {
      this.getStatus(res['contestant_mobile']);
    });
    this.getWinner('daily');
    this.getNotification();
  }

  getStatus(mobile) {
    this.rainfallService.submitedRainStatus(mobile).subscribe(res => {
      this.submitRainStatus = res[0];
    })
  }

  getNameChar(value) {
    
      return value && value.charAt(0).toUpperCase();
  }
  getNameChar2(value) {
    
    return value && value.charAt(0).toUpperCase() + value.charAt(1).toLowerCase();
}

  onChangeLeaderbordTime(value) {
      this.leaderboardTime = value;
      this.getLeaderBoard(value);
  }

  onChangeWinnerTime(value) {
    this.winnerTime = value;
    this.getWinner(value);
}

  async getUserProfile() {
    return new Promise((resolve,reject) => {
      this.rainfallService.getProfile(JSON.parse(localStorage.getItem('mumbairain_user')).Mobile).subscribe(res => {
        res && (this.users = res); 
        if(res && res['video'] && res['video'].length) {
          this.voucherStatus = true;
        } else {
          this.voucherStatus = false;

        }
        resolve(res)
      })
    })
 
  }

  getWinner(timeperiod) {
    this.winners = [];
    this.rainfallService.getWinner(timeperiod).subscribe(res => {
      res && (this.winners = res);  
    })
    
  }
  winnerPage(item) {
    this.router.navigate(['/rainfall-prediction/winner/'],{ queryParams:{data: JSON.stringify(item)}});
  }
  videoUpload(item) {
    this.router.navigate(['/rainfall-prediction/video-preview/'],{ queryParams:{data: JSON.stringify(item)}});
  }
  refresh() {
    this.getLeaderBoard('daily');
    this.getUserProfile().then(res => {
      this.getStatus(res['contestant_mobile']);
    });
    this.getWinner('daily');
    this.getNotification();
  }

  getNotification() {
    this.notifications = [];
    this.rainfallService.getNotification(JSON.parse(localStorage.getItem('mumbairain_user')).Mobile).subscribe(res => {
      this.notifications = res;
    })
  }

  getLeaderBoard(timeperiod) {
    this.leaderBoard = [];
    this.rainfallService.leaderBoard(timeperiod).subscribe(res => {
      this.leaderBoard = res;
    })
  }

  startPrediction() {
    this.rainfallService.prediction().subscribe(res => {
      if(res && res[0]) {
        this.availableContest = res[0];
        if(this.availableContest) {
          (document.getElementById("start-prediction-modal") as HTMLElement).click();
        }
      } else {
        this.rainfallService.contestNotAvailabe('Alert','','Contest window is closed right now, it opens between 8:30am to 8:30pm.');
      }
    })
  }
  chkRainContest(data) {
    var from = new Date(data && data.valid_from_date).getTime();
    var to = new Date(data && data.valid_to_date).getTime();
    var currentTime = new Date().getTime();
     if(currentTime <=to && currentTime>=from) {
      return false;
     } else {
      return true;
     }
  }

  submitRainPred() {
      let reqJson = {
        predicted_rain:this.rainPreValue,
        contest_id:this.availableContest.contest_id,
        station_id:this.availableContest.station_id,
        mobile:this.users.contestant_mobile
      }
      if(this.rainPreValue == 0 ) {
        this.rainfallService.alertMsg('Alert',`You can't enter 0`);
      } else if(this.rainPreValue =='' || this.rainPreValue == undefined || this.rainPreValue == null) {
        this.rainfallService.alertMsg('Alert',`Please enter atleast one number`)
      }else if(this.rainPreValue >=1000) {
        this.rainfallService.alertMsg('Alert',`Please enter any number less then 1000`)
      } else {
        this.rainfallService.submitPred(reqJson).subscribe(res => {
          this.modalCtrl.dismiss()
          if(res.MSG == 'SUCCESS' || res.MSG =='Forecast value modified successfully.') {
            this.presentPopover();
            this.getUserProfile().then(res => {
              this.getStatus(res['contestant_mobile']);
            });
            this.rainPreValue = '';   
          } else {
            this.rainfallService.alertMsg('',res.MSG);  
             
          }
        })
      }
   
  }




  
   htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  
  onChangerainVal(event) {
    if((event.target.value).startsWith(0)) {
      this.rainPreValue = '';
    }
  }

  logOut() {
    this.rainfallService.presentAlert('Do you really want to logout.?').then((res) => {
      if (res.role == 'confirm') {
        this.router.navigate(["rainfall-prediction/login"],{queryParams:{index:0}}).then(() => {
          localStorage.removeItem('mumbairain_user');
          localStorage.removeItem('mimbairain_user_loggedin');
        })
      }
    });
  }
  getTandC() {
    this.rainfallService.termAndCondition().subscribe(res => {
      console.log(res,'tand c');
      res && (this.TandC = res);
    })
  }
   takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      width:200,
      height:200,
      allowEditing: false,
      resultType: CameraResultType.Base64
    });
     this.imageUrl = "data:image/jpeg;base64," + image.base64String;
  };

  removePicture() {
    this.imageUrl = null;
  }

uploadPic() {

  if(this.imageUrl) {
    let requestJson = {
      name:this.users.contestant_name,
      mobile:this.users.contestant_mobile,
      profile_image:this.imageUrl
    }
    this.rainfallService.opt(requestJson).subscribe(res => {
      if(res.OTP == "Profile image updated.") {
        this.rainfallService.presentToast(`Profile updated`);
        this.getUserProfile().then(res => {          
          if(res){
            this.modalCtrl.dismiss();
            (this.imageUrl=null);
          } 
          
        });

      } else {
        this.rainfallService.presentToast(`Profile not updated at this time.Please try again later`)
      }
    })
  } else {
    this.rainfallService.presentToast(`Please capture image or upload from gallery`)
  }
 
}


getCoupleStatus(data) {
  return data && data.length
}


}
