import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewsPage implements OnInit {
  news:any;
  currentNews = 'all';
  constructor(private mapService:MapService,private router:Router) { }

  ngOnInit() {
    this.getNews('weather-news-and-analysis');
  }
  getNews(title) {
    let endPoint = `category-articles?slug=${title}&&limit=10&offset=1`;
    this.mapService.newsStories(endPoint).subscribe(result =>{
      console.log(result,'news');
      this.news = result['data'];
    })
  }
  @ViewChild ('newsSlider')nSlide:SwiperComponent;
  public nSlider:SwiperOptions={
    speed: 800,
    loop: false,
    autoplay: false,
    initialSlide: 0,
    spaceBetween: 0,
    slidesPerView: 4,
    centeredSlides: false
    
  }
  goBack() {
    window.history.back();
  }
  newsDetail(item) {
    this.router.navigate(['dashboard/news-detail']).then(()=>{
      this,this.mapService.newsDetailSubject.next(item);
    })
    .catch(err =>console.log(err)
    )
  }

 newTitle(title) {
   this.currentNews = title;
   if(title == 'all') {
    this.getNews('weather-news-and-analysis');
   } else {
     this.news = [];
   }
 }

}
