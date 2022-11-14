import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapService } from './pages/dashboard/map/map.service';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token
} from '@capacitor/push-notifications';
import { RainfallService } from './pages/rainfall-prediction/rainfall.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  isAppOpenbefore: any = localStorage.getItem('mumbairain_open_before')
  searchedLoc: any = [];
  contestAlive:boolean = false;
  constructor(private router: Router,
     private mapService: MapService,
     private raifallService:RainfallService) {
    if (this.isAppOpenbefore == 'true') {
      router.navigate(['dashboard/home-screen'])
    } else {
      router.navigate(['welcome']).then(() => {
        localStorage.setItem('mumbairain_open_before', 'true');
      })
    }
    this.mapService.addLocSubject.subscribe((res) => {
      this.searchedLoc = res;
    })
    this.getContestStatus();
  }

  getContestStatus() {
    this.raifallService.contestStatus().subscribe(res => {
      console.log(res,'777777777777777777');
      if(res && res.STATUS =='YES') {
        this.contestAlive = true;
      } else {
        this.contestAlive = false;
      }
      
    })
  }

  async ngOnInit(): Promise<void> {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log(token,'token________');
      
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log(error,'token_error_______');

    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log(notification,'notification recived');
        
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log(notification,'action performed');
      },
    );  
  }

  dataById(item) {
    console.log(item, 'item');
    this.router.navigate(['dashboard/home-screen', item.tid]).then().catch(err => console.log(err))
  }

  removeLocation(index) {
    this.searchedLoc.splice(index,1);
    localStorage.setItem('searched_locations',JSON.stringify(this.searchedLoc));
        
  }

  goToAddLocation() {
    if((this.searchedLoc && this.searchedLoc.length <5 )|| this.searchedLoc == null) {
      this.router.navigate(['/dashboard/add-location'])
    } else {
      this.raifallService.presentToast(`You can't add more then five location`)
    }
  }
}

