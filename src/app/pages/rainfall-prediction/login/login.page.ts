import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { RainfallService } from '../rainfall.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild(IonModal) predictedRainModel: IonModal;

  modelIndex:any = 0;
  name;
  mobile;
  otp;
  counter = 90;
  otp_Active:boolean = true;
  temrmsCondiation:boolean = true;
  timers = interval(1000);
  TandC:any = [];
  constructor(private rainfallService:RainfallService, 
    private router: Router,private modalCtrl: ModalController,private route: ActivatedRoute) {
      this.route.queryParams.subscribe((params:any) => {
        if(params && params.index) {
          (this.modelIndex = params.index);
          this.name = '';
          this.mobile ='';
          this.otp ='';
        } 
      })
    if(localStorage.getItem('mimbairain_user_loggedin') =='true') {
      this.router.navigate(['/rainfall-prediction/user-dashboard']);
    }
  }

  ngOnInit() {
    this.getTandC();
    this.name = '';
    this.mobile ='';
    this.otp ='';
  }

  validateMobile() {
    if(this.mobile) {
      return true;
    } else {
      return false;
    }
  }

  validateName() {
    if(this.name) {
      return true;
    } else {
      return false;
    }
  }



  modelIndexChange(index) {
    
    if(index ==1 ) {
     if(this.validateName()) {
            document.getElementById('contestRules-modal').click()

      this.modelIndex = 1;
     } else {
      this.modelIndex = 0;
      this.rainfallService.presentToast('Please enter name');
     }
    }
    if(index == 2) {
      if(this.validateMobile() && this.temrmsCondiation) {
        this.getOtp().then(res => {
              !res && (this.modelIndex =1);
              res && ( this.modelIndex = 2)
            })
      } else if(this.validateMobile() && !this.temrmsCondiation){
          this.rainfallService.presentToast('Please Accept Terms and condiation');
          this.modelIndex = 1;
      }  else {
       this.modelIndex = 1;
       this.rainfallService.presentToast('Please enter valid mobile');
      }
     }

    if(index == 3 && (this.otp == JSON.parse(localStorage.getItem('mumbairain_user')).OTP)) {
     this.router.navigate(['/rainfall-prediction/user-dashboard']).then(() => {
      localStorage.setItem('mimbairain_user_loggedin','true');
     })
    } else {
      localStorage.setItem('mimbairain_user_loggedin','false');

    }
  }

 async getOtp() {
  return new Promise((resolve,reject) => {
    if(this.mobile && this.mobile.toString().length ==10 && this.mobile.toString().match("^[6-9][0-9]{9}$")) {
      let requestJson = {
        name:this.name,
        mobile:this.mobile,
        profile_image:'',
      }      
      this.rainfallService.opt(requestJson).subscribe(res => {
        if(res && res.OTP) {
          resolve(true)
          res['name'] = this.name;
          localStorage.setItem('mumbairain_user',JSON.stringify(res));
        }
      })
    } else {
      this.rainfallService.presentToast('Please enter a valid mobile No.')
      resolve(false)
    }
  })
  }

  sendOtp() {
    if(this.mobile && this.mobile.toString().length ==10 && this.mobile.toString().match("^[6-9][0-9]{9}$")) {
      this.getOtp();
      var counter = 0;
      this.counter = 90;
     var timeInterval =  setInterval((e)=> {
        this.otp_Active = false;
       counter++;
        console.log(counter,'this.counter');
        this.counter --;
        if(counter == 90) {
    
          this.otp_Active = true;
          clearInterval(timeInterval);
        }
      }, 1000);
    } else {
      this.rainfallService.presentToast('Please enter a valid mobile No.')
    }
  }

  goBack() {
    if(this.modelIndex == 0) {
      this.router.navigate(['/dashboard/home-screen'])
    } 
    if(this.modelIndex == 1) {
      this.modelIndex = 0
    }
    if(this.modelIndex == 2) {
      this.modelIndex = 1
    }
  }

  terms(event) {
    if(event.target.checked) {
      this.temrmsCondiation = true;
    } else {
      this.temrmsCondiation = false;
    }
  }

  getTandC() {
    this.rainfallService.termAndCondition().subscribe(res => {
      console.log(res,'tand c');
      res && (this.TandC = res);
    })
  }
  rainfallModalClose() {
    this.modalCtrl.dismiss();
  }

  htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
}
