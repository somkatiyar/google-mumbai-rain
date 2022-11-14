
import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as L from "leaflet";
import { SwiperComponent } from "swiper/angular";
import { SwiperOptions } from 'swiper';
import * as windJSLeaflet from "../../../../assets/js/wind.js";
import { MapService } from './map.service';
import { ExpectedConditions } from 'protractor';
@Component({
  selector: "app-map",
  templateUrl: "./map.page.html",
  styleUrls: ["./map.page.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class MapPage implements AfterViewInit, OnInit {
  map: any;
  STATE = 'MH';
  LAT = 19.031;
  LON = 72.8767;
  ZOOM = 10.76;
  MINZOOM = 4;
  X1 = 10.89;
  Y1 = 62.74;
  X2 = 35.8;
  Y2 = 77.04;
  public timeData = [
    {
      time: "Now",
      value: 0,
      visibility: false,
    },
    {
      time: "3 hrs",
      value: 3,
      visibility: false,
    },
    {
      time: "6 hrs",
      value: 6,
      visibility: false,
    },
    {
      time: "12 hrs",
      value: 12,
      visibility: false,
    },
    {
      time: "18 hrs",
      value: 18,
      visibility: false,
    },
    {
      time: "24 hrs",
      value: 24,
      visibility: false,
    },
  ];

  isDirectionLayer = false;
  // layers
  waterLoggLayer: any;
  rainLayer: any;
  heatLayer: any;
  lightningLayer: any;
  cloudLayer: any;
  radarLayer: any;
  directionlayer: any;
  //
  rainIcon: any;

  // layer load flag
  isWaterLayerLoaded: any = false;
  isRainLayerLoaded: any = false;
  isHeatLayerLoaded: any = false;
  isLightningLayerLoaded: any = false;
  isCloudLayerLoaded: any = false;
  isRadarLayerLoaded: any = false;
  //

  // baseM
  isLegend: any = true;
  //
  theameLayerControl: any;
  layerArr = ["water_logging"];
  selectedTimeIndex: number = 0;
  selectdLayer: any = "water_logging";

  layerModel: any = {
    water_logging: true,
    rain_layer: false,
    heat_layer: false,
    cloud_layer: false,
    radar_layer: false,
  };


  @ViewChild("weatherCondition", {}) wSlide: SwiperComponent;
  @ViewChild("weatherCondition") wSlideBtn: SwiperComponent;
  public wSlider: SwiperOptions = {
    speed: 800,
    loop: false,
    autoplay: false,
    initialSlide: 0,
    spaceBetween: 0,
    slidesPerView: 3.1,
    centeredSlides: false,
  };
  @ViewChild("timeSlider") tSlide: SwiperComponent;
  public tSlider: SwiperOptions = {
    speed: 800,
    loop: false,
    autoplay: false,
    initialSlide: 0,
    spaceBetween: 0,
    slidesPerView: 3.5,
    centeredSlides: false,
  };
  constructor(private mapServive: MapService) {

  }

  ngOnInit() {

  }

  goBack() {
    window.history.back();
  }

  initMap() {
    var self = this;
    var bounds = new L.LatLngBounds(new L.LatLng(self.X1, self.Y1), new L.LatLng(self.X2, self.Y2));
    
    self.map = L.map('map', {
      maxBounds: bounds, 
      zoomControl: false, 
      loadingControl: true,
      rotation: 1,
      center: L.latLng([self.LAT, self.LON])
    }).setView([self.LAT, self.LON], self.ZOOM);
    self.map.setMaxBounds(self.map.getBounds());


      var lightTheame = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })
      
    var darkTheame = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(self.map);

    var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });



    var baseMap = {
      "Light": lightTheame,
      "Dark": darkTheame,
      "Satellite":satellite
    }
    this.theameLayerControl = L.control.layers(baseMap, {}).addTo(self.map);


    self.map.createPane('water_mask').style.zIndex = 999;
    self.map.createPane('rain_mask').style.zIndex = 800;
    self.map.createPane('heat_mask').style.zIndex = 500;
    self.map.createPane('cloud_mask').style.zIndex = 500;
    self.map.createPane('radar_mask').style.zIndex = 500;
    



    setTimeout(function(){ self.map.invalidateSize()}, 400);

  //  self.map && self.addDirectionLogo();

  L.control.zoom({
    position: 'bottomright'
  }).addTo(self.map);


  this.plotWind();


  self.map.on('overlayadd', (e)=> {
    console.log(e,'on add');
    this.map && console.log(this.map.hasLayer(this.lightningLayer),'add');
  });


  self.map.on('overlayremove', (e)=> {
    this.map && console.log(this.map.hasLayer(this.lightningLayer),'remove');
  });
  }


  ngAfterViewInit(): void {
    this.initMap();
    this.plotWaterLogging().then(res => {
      console.log(res,'water log');
      this.isWaterLayerLoaded = true;
    });
    this.plotLightning().then(res => {
      this.map && this.theameLayerControl.addOverlay(this.lightningLayer, 'Lightning');
    })
  }


  plotWind() {
    var self = this;
    new windJSLeaflet.init({
      localMode: true,
      map: self.map,
      layerControl: self.theameLayerControl,
      useNearest: false,
        timeISO: null,
        nearestDaysLimit: 7,
        displayValues: true,
        displayOptions: {
            displayPosition: 'bottomleft',
            displayEmptyString: 'No wind data'
        },
        overlayName: 'wind',
        pingUrl: '',
        latestUrl: '',
        nearestUrl: '',
        errorCallback: self.handleError
    });
  }

  addDirectionLogo() {
    var self = this;
    var directionControlLogo= L.control({
      position : 'topleft'
    });
    directionControlLogo.onAdd = (map) => {
      var self = this;
      var directionLogo = L.DomUtil.create('div', 'myControl');
        var img_log = `<div class='myClass' id='direction'>
        <img src='assets/icon/droute.png'></img>
        <span class="fs-6">Navigate</span>
      </div>`;
        directionLogo.innerHTML = img_log;
        directionLogo.onclick = function(){
          self.isDirectionLayer =! self.isDirectionLayer; 
          console.log(self.isDirectionLayer,'self.isDirectionLayer');
        }
        return directionLogo;
    
    }
    directionControlLogo.addTo(self.map);
  }


  async removelayer(layer) {
    var self = this;
    return new Promise((resolve, reject) => {
      self.map && layer && self.map.removeLayer(layer);
      resolve(true)
    })
  }
  getTimeData(value, index) {
    this.selectedTimeIndex = index;
    this.selectdLayer == "rain_layer" && this.plotRainData(value);
    this.selectdLayer == "heat_layer" && this.plotHeatMap(value);
  }
  changeLayer(event, layer,index) {
    var self = this;
    self.selectedTimeIndex = 0;
    
    if (event.target.checked) {
      this.layerArr.push(layer);
      this.selectdLayer = layer;
      console.log(this.layerArr,'select');

      if (layer == 'water_logging') {
        self.plotWaterLogging().then(res => {
          this.isWaterLayerLoaded = true;
        });
      }
      if (layer == 'rain_layer') {
        self.plotRainData(0).then(res => {
          this.isRainLayerLoaded = true;
        });
      }
      if (layer == 'heat_layer') {
        self.plotHeatMap(0).then(res => {
          this.isHeatLayerLoaded = true;
        });
      }
      // if (layer == 'lightning_layer') {
      //   self.plotLightning().then(res => {
      //     this.isLightningLayerLoaded = true;

      //   });
      // }
      if (layer == 'cloud_layer') {
        self.plotCloudLayer().then(res => {
          this.isCloudLayerLoaded = true;
        });
      }
      if (layer == 'radar_layer') {
        self.plotRadarLayer().then(res => {
          this.isRadarLayerLoaded = true;
        });
      }

    } else {
      this.layerArr.splice(this.layerArr.indexOf(layer), 1);
      console.log(this.layerArr,'deselect');

      if (layer == 'water_logging') {
        self.removelayer(this.waterLoggLayer).then(res => {
          self.isWaterLayerLoaded = false;
        })
      }
      if (layer == 'rain_layer') {
        self.removelayer(this.rainLayer).then(res => {
          self.isRainLayerLoaded = false;
        })
      }
      if (layer == 'heat_layer') {
        self.removelayer(this.heatLayer).then(res => {
          self.isHeatLayerLoaded = false;
        })
      }
      // if (layer == 'lightning_layer') {
      //   self.lightningLayer.forEach((marker) => {
      //     marker.remove();
      //   });
      //   self.isLightningLayerLoaded = false;
      // }
      if (layer == 'cloud_layer') {
        self.removelayer(this.cloudLayer).then(res => {
          self.isCloudLayerLoaded = false;
        })
      }
      if (layer == 'radar_layer') {
        self.removelayer(this.radarLayer).then(res => {
          self.isRadarLayerLoaded = false;
        })
      }
    }
  }

  getIcon(iconType: any) {
    var icon = L.icon({
      iconUrl: `assets/icon/${iconType}`,
      iconSize: [30, 30],
    })
    return icon;
  }

  getLightningIcon() {
    var icon = L.icon({
      iconUrl: `assets/img/lightning.svg`,
      iconSize: [10, 10],
    })
    return icon;
  }

  iconCong(data) {
    if (data.style && data.style.rain <= 10) {
      return 'rain-04.png'
    }
    if (data.style && data.style.rain > 10 && data.style.rain <= 20) {
      return 'rain-03.png'
    }
    if (data.style && data.style.rain > 20 && data.style.rain <= 30) {
      return 'rain-02.png'
    }
    if (data.style && data.style.rain > 30) {
      return 'tain-04.png'
    }
  }



  async plotWaterLogging() {
    var self = this;
    self.removelayer(this.waterLoggLayer).then(res => {
      return new Promise((resolve, reject) => {
        self.mapServive.getWaterLogData().subscribe(res => {
          self.waterLoggLayer = L.geoJSON(res,
            {
              pane: "water_mask",
              style: function (feature) {
                return { opacity: 1.0, fill: false, lineJoin: 'round', weight: 3, color: "#FF69B4" };
              }
            }).addTo(self.map)
          resolve(res)
        })
      })
    })
  
  }

  async plotRainData(hr) {
    var self = this;
   return self.removelayer(this.rainLayer).then(res => {
      return new Promise((resolve, reject) => {
        self.mapServive.getRainData(hr).subscribe((res: any) => {
          self.rainLayer = L.geoJSON({
            "type": "FeatureCollection",
            "features": res,
          }, {
            pane: "rain_mask",
            pointToLayer: function (feature, latlng) {
              console.log(feature.properties.style.fillColor,'feature.properties.style.fillColor');
              
              return L.marker(latlng, {
                icon: new L.DivIcon({
                  className: 'rain-marker-icon rain-' + feature.properties.style.fc_level,
                  html: '<div class="rain-marker-icon-inner" style="background-color:' + feature.properties.style.fillColor + '!important">' + feature.properties.style.rain + '<br> mm</div>'
                }), iconSize: [50, 50], type: 'pointMarker'
              });
  
            },
          }).addTo(self.map)
          resolve(res)
        })
      })
    })


  }

  async plotHeatMap(hr) {
    var self = this;
   return self.removelayer(this.heatLayer).then(res => {
      return new Promise((resolve, reject) => {
        var imageBounds = new L.LatLngBounds(new L.LatLng(19.9632414070001012, 72.6481950000000012),new L.LatLng(18.8032414070001010, 73.4031949999999966));
        
        var url;
        if (hr) {
          url = `https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=heatmap&hr=_${hr}`;
        } else {
          url = "https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=heatmap&hr";
  
        }
        this.heatLayer = L.imageOverlay(url, imageBounds, {
          opacity: 0.6,
          interactive: true,
          pane: 'heat_mask',
          attribution: '&copy; A.B.B Corp.'
        }).addTo(self.map);
        resolve(url)
      })
    })
  


  }

  async plotCloudLayer() {
    var self = this;
   return self.removelayer(this.cloudLayer).then(res => {
      return new Promise((resolve, reject) => {
        var imageBounds = new L.LatLngBounds(new L.LatLng(33.8,65.5),new L.LatLng(5.3,94.95));
        var url = `https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=cloud`;
        this.cloudLayer = L.imageOverlay(url, imageBounds, {
          opacity: 0.6,
          pane: 'cloud_mask',
          interactive: true,
          attribution: '&copy; A.B.B Corp.'
        }).addTo(self.map);
        resolve(url)
      })
    })



  }

  async plotRadarLayer() {
    var self = this;
   return self.removelayer(this.radarLayer).then(res => {
      return new Promise((resolve, reject) => {
        var imageBounds = new L.LatLngBounds(new L.LatLng(21.3271838197975256, 70.4861796948087829),new L.LatLng(16.9137618197975215, 75.2462597548087757));
        var url = `https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=radar`;
        this.radarLayer = L.imageOverlay(url, imageBounds, {
          opacity: 0.6,
          interactive: true,
          pane: 'radar_mask',
          attribution: '&copy; A.B.B Corp.'
        }).addTo(self.map);
        resolve(this.radarLayer)
      })
    })




  }


  async plotLightning() {
    var self = this;
   return self.removelayer(this.lightningLayer).then(res => {
      return new Promise((resolve, reject) => {
        this.lightningLayer = L.layerGroup()

        this.mapServive.getLightning().subscribe(res => {
          res && res.forEach((item) => {
            var loc = item.l.split(",");
            var latitude = Number(loc[0]);
            var longitude = Number(loc[1]); 
            var markers = new L.Marker([longitude, latitude], { icon: self.getLightningIcon() })
            this.lightningLayer.addLayer(markers)
            resolve(this.lightningLayer)
          });
          

        })
  
      })
    })



  }

  toggleDisplay() {
    var self = this;
    this.isLegend = !this.isLegend;
    setTimeout(function(){ self.map.invalidateSize()},10);
  }
  getMapState(event) {
    event == 'layerMap' && (this.isDirectionLayer = false)
    console.log(this.isDirectionLayer,'evebt');
    
  }

  enableDisableTimeDiv() {
    if ((this.layerModel["rain_layer"] || this.layerModel["heat_layer"])) {
      return true;
    } else {
      return false;
    }
  }



   handleError = function(err){
    console.log('handleError...');
    console.log(err);
};
}



