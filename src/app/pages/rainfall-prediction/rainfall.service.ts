import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RainfallService {
 url = "https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainContest?type=";

  header = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  })

  constructor(private http:HttpClient,
    public toastController: ToastController,
    private alertController: AlertController) {}


  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      cssClass: 'custom-alert',
      duration: 2000,
      position:'top'
    });
    toast.present();
  }

  async alertMsg(header,message) {
    const alert = await this.alertController.create({
      header: header,
      cssClass: 'custom-alert',
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }


  async contestNotAvailabe(header,subHeader,message) {
    const alert = await this.alertController.create({
      header: header,
      cssClass: 'custom-alert',
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });

    await alert.present();
  }


  async presentAlert(message) {
    const alert = await this.alertController.create({
      message: message,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
        }
      ]
    });
    await alert.present();
 return  await alert.onDidDismiss().then((res) => {
    console.log(res,'jj');
    return res
   });
  }

  opt(body): Observable<any> {
    const data = new HttpParams()
    .set('name', body.name)
    .set('mobile', body.mobile)
    .set('profile_image',body.profile_image)
    return this.http.post(this.url+'otp',data,{headers:this.header})
  }

  prediction(): Observable<any> {
    return this.http.get(this.url+'livecontest',{headers:this.header})
  }

  leaderBoard(timeperiod): Observable<any> {
    return this.http.get(this.url+`contestantranking&param=${timeperiod}`,{headers:this.header})
  }

  getWinner(timeperiod): Observable<any> {
    return this.http.get(this.url+`contestantwinners&param=${timeperiod}`,{headers:this.header})
  }

  getProfile(mobile): Observable<any> {
    return this.http.get(this.url+`contestantprofile&param=${mobile}`,{headers:this.header})
  }

  getNotification(mobile): Observable<any> {
    return this.http.get(this.url+`notifications&param=${mobile}`,{headers:this.header})
  }
    
termAndCondition():Observable<any> {
  return this.http.get('https://projects.skymetweather.com/weatherAPI/API/MumbaiRainContest?type=tnc');
}

submitedRainStatus(mobile):Observable<any> {
  return this.http.get(`https://projects.skymetweather.com/weatherapi/api/MumbaiRainContest?type=stats&param=${mobile}`);
}

  submitPred(body): Observable<any> {
     const data = new HttpParams()
    .set('contest_id', body.contest_id)
    .set('station_id', body.station_id)
    .set('predicted_rain', body.predicted_rain)
    .set('mobile', body.mobile);
    return this.http.post(this.url+'contestsubmission',data,{headers:this.header})
  }

  contestStatus(): Observable<any> {
    return this.http.get('https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainContest?type=conteststatus')
  }

  submitVideo(body): Observable<any> {
    const data = new HttpParams()
    .set('date', body.date)
    .set('mobile', body.mobile)
    .set('video',body.video)
    .set('filename',body.filename)
    return this.http.post(this.url+'video',data,{headers:this.header})
  }

  
}
