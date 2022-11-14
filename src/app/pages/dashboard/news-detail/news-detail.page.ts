import { Component, OnInit } from '@angular/core';
import { MapService } from '../map/map.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.page.html',
  styleUrls: ['./news-detail.page.scss'],
})
export class NewsDetailPage implements OnInit {
  newDetail:any;
  constructor(private mapService:MapService) { 
    this.mapService.newsDetailSubject.subscribe(res => {
      this.newDetail = res;
      console.log(res,'subject');
      
    })
  }

  ngOnInit() {
  }

  goBack() {
    window.history.back()
  }

}
