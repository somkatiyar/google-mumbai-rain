import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperComponent } from 'swiper/angular';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomePage {
  @ViewChild(SwiperComponent) swiper: SwiperComponent;

constructor(private router:Router) {

}
weatherData() {
  this.router.navigate(['dashboard/home-screen']).then().catch(err =>console.log(err)
  )
  
}

swipeNext() {
  this.swiper.swiperRef.slideNext();

}

}
