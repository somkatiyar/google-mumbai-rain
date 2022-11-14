import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MapService } from '../map/map.service';
import {
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs/operators";
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
})
export class AddLocationPage implements OnInit {
  locations:any = [

  ]

  searchForm: FormGroup;

  constructor(private mapService: MapService,private router: Router) {
    this.searchForm = new FormGroup({
      searchCtrl: new FormControl(""),
    });

    this.searchForm
    .get("searchCtrl")
    ?.valueChanges.pipe(
      filter((text) => text.length >= 2),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((searchTxt) =>
        this.mapService.getLocations({ terms: searchTxt })
      )
    )
    .subscribe((res) => {      
      this.locations = res;
    });

    this.searchForm
    .get("searchCtrl").valueChanges.subscribe(res => {
      if(res == '') {
        this.locations = []
      }
    })
   }

   onLocationSelect(item) {
    item['icon'] = 'location';
    var loc =[];

    if(localStorage.getItem('searched_locations')) {
      JSON.parse(localStorage.getItem('searched_locations')).forEach((item) =>{
        loc.push(item);
      } )
   
      loc.push(item)
    } else {
      loc.push(item)
    }
    this.router.navigate(['dashboard/home-screen',item.tid]).then(()=>{
      localStorage.setItem('searched_locations',JSON.stringify(loc))
      this.mapService.addLocSubject.next((loc));
    }).catch(err=> console.log(err)
    )
   }

   goToHome() {
    this.router.navigate(['dashboard/home-screen'])
   }

   ngOnInit() {


   }



}
