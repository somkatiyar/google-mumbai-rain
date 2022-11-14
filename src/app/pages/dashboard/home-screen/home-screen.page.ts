import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Chart, registerables } from "chart.js";
import { MapService } from "../map/map.service";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Geolocation, PositionOptions } from '@capacitor/geolocation';
import { LoadingController } from "@ionic/angular";
import { AlertController } from '@ionic/angular';
import { SwiperComponent } from "swiper/angular";
import { SwiperOptions } from "swiper";
import { RainfallService } from "../../rainfall-prediction/rainfall.service";

@Component({
  selector: "app-home-screen",
  templateUrl: "./home-screen.page.html",
  styleUrls: ["./home-screen.page.scss"],
})
export class HomeScreenPage implements OnInit {
  alertModelOpened:any = localStorage.getItem('mumbairain_location_popup')
  location: any;
  keys: string[] = [];
  users:any ;
  winners:any = [];
  @ViewChild ('winnerSlider')nSlide:SwiperComponent;
  public nSlider:SwiperOptions={
    speed: 800,
    loop: false,
    autoplay: false,
    initialSlide: 0,
    spaceBetween: 0,
    slidesPerView: 3,
    centeredSlides: false
    
  }
  @ViewChild("lineCanvas") rainFall;
  locId: any;
  lineChart: any;
  p: any = 0;
  dashboardData: any = [];
  weatherData: any = [];
  foreCastData: any = [];
  trendingNews: any = [];
  loader: any;
  contestAlive:boolean = false;
  rainfallTime: any = [
    { time: 'Hourly', value: 'hourly', isActive: true },
    { time: '3 Days', value: 3, isActive: false },
    { time: '7 Days', value: 7, isActive: false },
    // { time: '15 Days', value: 15, isActive: false },
  ];
  selectedRainIndex = 0;
  rainlabeltext ='Daily Rain Prediction';

  ngOnInit() {
    this.getclimatechange();
  }





  formatTime(date) {

    var addElement = 'th';
    if(date.split(',')[2] == '1') {
      addElement = 'st'
    }
    if(date.split(',')[2] == '2') {
      addElement = 'nd'
    }
    if(date.split(',')[2] == '3') {
      addElement = 'rd'
    }
    var day :any = date.split(',')[2] + addElement;
    var month: any = date.split(',')[1];
    var year: any = new Date().getFullYear();
    var dateObj = day +' '+ month +'`'+ year;
    return dateObj;
  }

  getTime() {
    var date = new Date()
    var hours = date.getHours();
    var minutes:any = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  onRainTimeChange(i) {
    this.selectedRainIndex = i;
    var labels = [];
    var data = []


    if (this.selectedRainIndex == 0) {
      this.rainlabeltext = 'Daily Rain Prediction';
      this.weatherData.forEach((item) => {
        labels.push(item.ist);
        data.push(item.rain_qty);
      });
      labels &&
        data &&
        this.createLineChart(labels.slice(0, 5), data.slice(0, 5), this.getMax(data) + 1);
    }
    if (this.selectedRainIndex == 1) {
      this.rainlabeltext = 'Weekly Rain Prediction';
      this.foreCastData.forEach((item) => {
        var fd = item.date.split(',')
        labels.push(fd[1]+','+fd[2]);
        data.push(item.rain_qty);
      });
      labels &&
        data &&
        this.createLineChart(labels.slice(0, 3), data.slice(0, 3), this.getMax(data) + 1);
    }
    if (this.selectedRainIndex == 2) {
      this.rainlabeltext = 'Weekly Rain Prediction';
      this.foreCastData.forEach((item) => {
        var fd = item.date.split(',')
        labels.push(fd[1]+','+fd[2]);
        data.push(item.rain_qty);
      });
      labels &&
        data &&
        this.createLineChart(labels.slice(0, 7), data.slice(0, 7), this.getMax(data) + 20);
    }
    
    if (this.selectedRainIndex == 3) {
      this.foreCastData.forEach((item) => {
        var fd = item.date.split(',')
        labels.push(fd[1]+','+fd[2]);
        data.push(item.rain_qty);
      });
      labels &&
        data &&
        this.createLineChart(labels.slice(0, 15), data.slice(0, 15), this.getMax(data) + 13);
    }


  }

  async getPositions() {
    try {
      this.showLoading();
      var res = await Geolocation.getCurrentPosition();
      
      if (res && res.coords) {
        this.getDashboardData(res.coords.latitude, res.coords.longitude);
      } else {
        console.log('else----------------------');
        this.getDashboardData(19.1075, 72.8263);
      }
    } catch (err) {
      console.error('Failed to get current position.', err);
      this.getDashboardData(19.1075, 72.8263);
      this.rainFallService.presentAlert('Please enable GPS to get current location and pull to refresh page.');
    }


  }

  constructor(
    private route: ActivatedRoute,
    private mapService: MapService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private rainFallService: RainfallService
  ) {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
    this.getContestStatus();
    this.locId = this.route.snapshot.params["id"];
    if (this.locId) {
      this.getWeatherData(this.locId);
      this.dashboardDataById(this.locId);
    } else {
      if(this.alertModelOpened == 'true') {
        this.getPositions()
      } else {
        this.alertForLocation();
      }
    }
  }

  doRefresh(event) {
      window.location.reload();
  }

  getContestStatus() {
    this.rainFallService.contestStatus().subscribe(res => {
      console.log(res,'contest status');
      if(res && res.STATUS =='YES') {
        this.contestAlive = true;
      } else {
        this.contestAlive = false;
      }
      
    })
  }

  async alertForLocation() {
    const alert = await this.alertController.create({
      message: `Mumbai Rain collects location data to enable reporting of water logged areas' near you even when the app is closed or not in use.`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { this.getPositions()}
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => { this.getPositions() }
        }
      ]
    });

    await alert.present();

    await alert.onDidDismiss().then(res => {
      localStorage.setItem('mumbairain_location_popup','true')
      if (res && res.role == 'backdrop') {
        this.getPositions()
      }

    });
  }




  getDashboardData(lat, lng) {
    this.mapService.getDataByLatLng(lat, lng).subscribe((res) => {
      this.dashboardData = res["data"];
      res && res['data']
      this.getWeatherData(
        res["data"] &&
        res["data"]["metainfo"] &&
        res["data"]["metainfo"]["TEHSIL_ID"]
      );
    });
  }

  getAliasName(data) {
    var str = data && data.TEHSIL_ALIAS_NAME + ','+data.DISTRICT_NAME
    if(str.toString().length <= 25) {
      return str;
    } else {
      return str.toString().substring(0,23) + '..'
    }
  }

getImages(condition):string {
  if(condition == 'clearsky') {
    return 'assets/img/background/clearsky-1.png'
  }
  if(condition == 'cloudydrizzle') {
    return 'assets/img/background/isolatedShowers-1.png'
  }
  if(condition == 'hazy') {
    return 'assets/img/background/isolatedShowers-2.png'
  } 
  if(condition.toString().toLowerCase().includes('rain')) {
    return 'assets/img/background/lightRain-1.png'
  }
  if(condition == 'overcastrain') {
    return 'assets/img/background/lightRain-2.png'
  }
  if(condition == 'cloudy') {
    return 'assets/img/background/partlyCloudy-1.png'
  }
  if(condition == 'cloudydrizzle') {
    return 'assets/img/background/partlyCloudy-2.png'
  }
  if(condition == 'cyclonicstorm') {
    return 'assets/img/background/storm-1.png'
  }
  if(condition == 'severethundershowers') {
    return 'assets/img/background/storm-2.png'
  }
  if(condition == 'duststorm') {
    return 'assets/img/background/storm-3.png'
  }
  if(condition == 'overcastmoderatethundershower') {
    return 'assets/img/background/storm-4.png'
  }
}

getBaseImage() {
  return 'assets/img/home-screen-1.svg'
}

  dashboardDataById(id) {
    this.mapService.getDataById(id).subscribe((res) => {
      this.dashboardData = res["data"];
    });
  }

  getclimatechange() {
    let endPoint = "category-articles?slug=weather-news-and-analysis&&limit=10&offset=1";
    this.mapService.newsStories(endPoint).subscribe((result) => {
      this.trendingNews = result["data"];
    });
  }

  getWeatherData(id) {
    this.mapService.getDashboardData(id).subscribe((res) => {
      var labels = [];
      var data = [];
      this.weatherData = res["data"]["hourly"];
      this.foreCastData = res["data"]["forecast"];
      this.weatherData.forEach((item) => {
        labels.push(item.ist);
        data.push(item.rain_qty);
      });
      labels &&
        data &&
        this.createLineChart(labels.slice(0, 5), data.slice(0, 5), this.getMax(data) + 1);
    });
  }


  getMax(arr) {
    return arr.reduce(function (p, v) {
      return (p < v ? v : p);
    });
  }
  ionViewDidEnter() { }

  setMax(arr) {
    return arr.reduce(function (p, v) {
      return (p > v ? p : v);
    });
  };

  getFormatedDate(data) {
    var arr = []
     data.forEach((e:String) =>{
       let dt =  e.split(',');
       arr.push(dt[2]+ dt[1])
        console.log(arr);
      
    })
   
    return arr;
  }

  createLineChart(lables, data, max) {
    console.log(lables,'labele');
    console.log(data,'datatatatat');
    
    
    if (this.lineChart) {
      this.lineChart.destroy()
    }
    this.lineChart = new Chart(this.rainFall.nativeElement, {
      type: "line",
      data: {
        labels:lables,
        datasets: [
          {
            data:data,
            pointRadius: 0,
            backgroundColor: "#4B6995",
            borderColor: "#2BACE3",
            borderWidth: 3,
            tension: 0.4,
            datalabels: {
              font: {
                size: 15,
                weight: 600,
              },
            },
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            align: "end",
            anchor: "start",
          },
          tooltip: {
            intersect: false,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            display: false,
            max: max,

            grid: {
              display: false,
              drawBorder: false,
            },


          },
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
          },
        },
      },
    });


  }

  newsDetail(item) {
    this.router
      .navigate(["dashboard/news-detail"])
      .then(() => {
        this, this.mapService.newsDetailSubject.next(item);
      })
      .catch((err) => console.log(err));
  }

  allNews() {
    this.router
      .navigate(["dashboard/news"])
      .then(() => { })
      .catch((err) => console.log(err));
  }

  mapPage() {
    this.router
      .navigate(["dashboard/map"])
      .then()
      .catch((err) => console.log(err));
  }

  pageChange(event) {
    console.log(event, "asj");
    this.p = event;
  }

  async showLoading() {
    this.loader = await this.loadingCtrl.create({
      message: 'Fetching location...',
      id: 'loader',
      cssClass: 'custom-loading',
      spinner: "circles",
      duration:2000
      
    });

    this.loader.present();

  }


}