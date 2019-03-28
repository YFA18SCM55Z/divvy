import { Component, OnInit, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Station } from '../../station';
import { Observable } from 'rxjs/Observable';

import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-line-chart-divvy',
  templateUrl: './line-chart-divvy.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./line-chart-divvy.component.css']
})
export class LineChartDivvyComponent implements OnInit, OnDestroy {
  
  title = 'Line Chart';
 
  stationDataSevenDay: Station[]
  updatedStationDataSevenDay: Station[]
  
  thisID: any

  updateStationDataWithinSevenDay() {
    var dateBegin = new Date();
    for (let i = 0; i < this.stationDataSevenDay.length; i++) {
      var dateEnd = new Date(this.stationDataSevenDay[i].lastCommunicationTime.valueOf())
      var dateDiff = dateBegin.getTime() - dateEnd.getTime();
      var leave1 = dateDiff % (24 * 3600 * 1000);
      var hours = Math.ceil(leave1 / (3600 * 1000));
      if (hours > 168) {
        this.stationDataSevenDay = this.stationDataSevenDay.splice(1, this.stationDataSevenDay.length)
      } else {
        break;
      }
    }
    return this.stationDataSevenDay
  }

  set updateDataSevenDay(status: Station[]) {
    this.stationDataSevenDay = status;
    this.updatedStationDataSevenDay = this.updateStationDataWithinSevenDay()
  }

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.placesService
      .getSelectedStation()
      .subscribe((data: Station[]) => {
        this.thisID = data[0].id
        this.updateDataSevenDay = data
        let UpdateObservable = this.placesService.getUpdates(this.thisID);
        UpdateObservable.subscribe((latestStatus: Station) => {
          this.updateDataSevenDay = this.stationDataSevenDay.concat([latestStatus])
        });
      });
  }


  ngOnDestroy() {
    this.placesService.socketOff();
  }

}
