import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-winner',
  templateUrl: './winner.page.html',
  styleUrls: ['./winner.page.scss'],
})
export class WinnerPage implements OnInit,AfterViewInit {
  imageUrl:any;
  users:any;
  constructor(private route:ActivatedRoute) {
    this.route.queryParams.subscribe((params:any) => {
      console.log(JSON.parse(params.data),'askdfg');
      this.users = JSON.parse(params.data);
    })
   }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    // this.takeSnapShot();
  }

  takeSnapShot() {
    var node = document.getElementById('winner');
    var self = this;
    domtoimage.toPng(node)
    .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        self.imageUrl = dataUrl;
        console.log( self.imageUrl);
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
  }
  

}
