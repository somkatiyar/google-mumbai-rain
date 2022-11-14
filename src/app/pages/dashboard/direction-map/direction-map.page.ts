import {
  Component,
  AfterViewInit,
  Output,
  Input,
  OnChanges,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { SwiperOptions } from "swiper";
import { SwiperComponent } from "swiper/angular";
import { MapService } from "../map/map.service";
declare var moment: any;
declare var $: any;
declare var mapboxgl: any;
declare var MapboxDirections: any;
(window as any).type = undefined;
@Component({
  selector: 'app-direction-map',
  templateUrl: './direction-map.page.html',
  styleUrls: ['./direction-map.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DirectionMapPage implements OnInit,AfterViewInit {
  @ViewChild("directionMap", { static: false }) mapElement: ElementRef;
  map: any;
  SELECTED_ROADS_SOURCE;
  directionControl: any;
  isRoute:boolean = false;
  isInstructionShow = 'yes';

  @Output() mapState = new EventEmitter<any>();
  constructor(public mapService: MapService) {
      
  }


  ngOnInit() {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic29ta3RyIiwiYSI6ImNsNHRvZ2l2MTBzYXYzY251YjF2NDkwbGsifQ.N7BYlHM73rtEU-n_OdpPcw";
  }
  ngAfterViewInit() {

    var self = this;

    const bound = new mapboxgl.LngLatBounds([72, 19], [73.4, 19.189]);
    self.map = new mapboxgl.Map({
      container: self.mapElement.nativeElement,
      style: "mapbox://styles/somktr/cl4wbpt4s004l14qr59ou2nbb",
      hash: true,
      center: [72.8833435, 19.0502346],
      zoom: 11,
      minZoom: 5,
     // maxBounds: bound,
      zoomControl: true,
  
    });

    self.map.on("idle", function () {
      self.map.resize();
    });

   self.map.on('error', (err) => {
    console.log(err,'error');
  
   })

self.map.on('styledata', (e) => {
  console.log(e,'A styledata event occurred.');
  });

    self.map.on("style.load", function (e) {
      // layer
      self.waterLogging();
      self.addDirectionControl();
      // controls
    });

  }


  waterLogging() {
    var self = this;
      self.map.addSource("water_logging", {
        type: "geojson",
        data: "https://projects.skymetweather.com/WeatherAPI/api/MumbaiRainAPI?type=roadjson",
      });
      self.map.addLayer({
        id: "water_logging",
        type: "line",
        source: "water_logging",
        layout: {
          "line-join": "round",
          "line-cap": "round",
  
        },
        paint: {
          "line-color": "#FF1493",
          "line-width": 3,
          "line-opacity": 0.8,
        },
      });
    

  }


  removeDirectionControl() {
    this.map.removeControl(this.directionControl);
  }
  addDirectionControl() {
    this.directionControl = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      congestion:true,
      alternatives:true,
      controls: {
        profileSwitcher: true,
        instructions: true,
        
  
      },
      flyTo: true,
    });

    this.map.addControl(this.directionControl, "top-right");
    this.directionControl.on("route", (event) => {
      if(event.route) {
        this.isRoute = true;
        console.log(event,'pppp');
        
      }
    });
    
  }

  layerMap() {
    this.mapState.next('layerMap')
  }

  getStatus() {
   let el = (document && document.getElementsByClassName('mapbox-directions-instructions')[0] as HTMLElement)
    if(el.style.getPropertyValue('display') == 'none' || el.style.getPropertyValue('display') == '') {
      return true
    } else {
      return false
    }
  }
  


  onInstructionToggleChange() {
    let el = (document && document.getElementsByClassName('mapbox-directions-instructions')[0] as HTMLElement)
    if(el.style.getPropertyValue('display') == 'none' || el.style.getPropertyValue('display') == '') {
     (document.getElementsByClassName('mapbox-directions-instructions')[0] as HTMLElement).style.display ='block'

    } else {
      (document.getElementsByClassName('mapbox-directions-instructions')[0] as HTMLElement).style.display ='none'

    }

  }
 
}

