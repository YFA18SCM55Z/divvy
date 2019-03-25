import { Component, OnInit, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Station } from '../../station';
import { moveAverage as MoveAverage } from '../../moveAverage';

import { PlacesService } from '../../places.service';
import { Observable } from 'rxjs/Observable';
import { interval } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";
//import 'rxjs/add/operator/startWith';
//import 'rxjs/add/operator/switchMap';
import { of } from 'rxjs/observable/of'
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
//import * as d3ScaleChromatic from 'd3-scale-chromatic';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import 'd3-transition';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-line-chart-divvy',
  templateUrl: './line-chart-divvy.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./line-chart-divvy.component.css']
})
export class LineChartDivvyComponent implements OnInit, OnDestroy {
  timeTitle = 'One Hour'
  title = 'Line Chart';
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;
  //private line: d3Shape.Line<[number, number]>;
  private line: d3Shape.Line<Station>;
  private line1: d3Shape.Line<MoveAverage>;
  private line2: d3Shape.Line<MoveAverage>;
  private xAxis: any;
  private yAxis: any;
  private subscription: ISubscription;
  private moveAverage: MoveAverage[] = [];
  private averageHourNumber: number;
  private moveAverageDay: MoveAverage[] = [];
  private averageDayNumber: number;
  private cutMoveAverageDay: MoveAverage[] = [];


  @Input() stationSelected$: Observable<Station[]>
  stationData: Station[]
  stationDataDay: Station[]
  stationDataSevenDay: Station[]
  thisID: any

  constructor(private placesService: PlacesService) {
    this.width = 1300 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

  }

  updateStationDataWithinOneHour() {
    for (let i = 0; i < this.stationData.length; i ++) {
      if(this.stationData[i]) {
        var dateBegin = new Date();
        var dateEnd = new Date(this.stationData[i].lastCommunicationTime.valueOf())
        var dateDiff = dateBegin.getTime() - dateEnd.getTime();
        var leave1=dateDiff%(24*3600*1000);
        var hours=Math.ceil(leave1/(3600*1000));
        if ( hours > 1 ) {
          this.stationData = this.stationData.splice(1, this.stationData.length)
        } else {
          break;
        }
      } else {
        break;
      }
    }
    this.stationSelected$ = of(this.stationData)
    this.updateChart()
  }

  ngOnInit() {
    this.averageHourNumber = 0;
    this.averageDayNumber = 0;
    this.initSvg();
    this.initAxis();
    this.placesService
      .getSelectedStation()
      .subscribe((data: Station[]) => {
        this.thisID = data[0].id
        this.stationData = data
        this.stationSelected$ = of(this.stationData)
        this.drawChart()
        console.log(this.stationData)
        let UpdateObservable =  this.placesService.getUpdates(this.thisID);  
        this.subscription = UpdateObservable.subscribe((latestStatus: Station) => {  
          this.stationData.push(latestStatus)
          this.updateStationDataWithinOneHour()
      }); 
      });
  }

   subscribeIntervalOneHour() {
    this.timeTitle = 'One Hour'
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    this.placesService
      .findSelectedStations(this.thisID)
      .subscribe(() => {
        this.getSelectedStation()
      });
    
  } 

  subscribeIntervalTwentyFourHour() {
    this.timeTitle = 'Twenty Four Hours'
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    this.placesService
    .findSelectedStations(this.thisID)
    .subscribe(() => {
      this.getSelectedStation()
    });
  }

  subscribeIntervalSevenDay() {
    this.timeTitle = 'Seven Days'
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    this.updateDateTwoMinutesSevenDay();
    this.subscription = interval(1000 * 1 * 60).subscribe(() => {
      console.log("calling 7");
      this.updateDateTwoMinutesSevenDay();
    });
  }

  subscribeIntervalSMA() {
    this.timeTitle = 'SMA CHART'
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
    this.updateDateSMA();

    this.subscription = interval(1000 * 1 * 60).subscribe(() => {
      console.log("calling SMA");
      this.updateDateSMA();
    });
  }


  setMoveAverageHour() {
    this.averageHourNumber = 0;
    this.moveAverage = [];
    for (let i = 0; i < this.stationData.length; i++) {
      let temp: MoveAverage = {} as any;
      this.averageHourNumber = this.averageHourNumber + this.stationData[i].availableDocks.valueOf();
      temp.availableDocks = Number(this.averageHourNumber / (i + 1));
      temp.lastCommunicationTime = this.stationData[i].lastCommunicationTime;
      this.moveAverage.push(temp);
    }
  }

  setMoveAverageDay() {
    this.averageDayNumber = 0;
    this.moveAverageDay = [];
    for (let i = 0; i < this.stationDataDay.length; i++) {
      let temp: MoveAverage = {} as any;
      this.averageDayNumber = this.averageDayNumber + this.stationDataDay[i].availableDocks.valueOf();
      temp.availableDocks = Number(this.averageDayNumber / (i + 1));
      temp.lastCommunicationTime = this.stationDataDay[i].lastCommunicationTime;
      this.moveAverageDay.push(temp);
    }
  }

  getSelectedStation() {
    this.placesService
      .getSelectedStation()
      .subscribe((data: Station[]) => {
        this.stationData = data
        //this.sortData()
        this.stationSelected$ = of(this.stationData)
        this.updateChart()
        let UpdateObservable =  this.placesService.getUpdates(this.thisID);  
        this.subscription = UpdateObservable.subscribe((latestStatus: Station) => {  
          this.stationData.push(latestStatus)
          this.updateStationDataWithinOneHour()
      }); 
      });
  }

  getSelectedStationDay() {
    this.placesService
      .getSelectedStation()
      .subscribe((data: Station[]) => {
        this.stationDataDay = data
        //this.sortDataDay()
        console.log("stationdate:", this.stationDataDay)
        this.setMoveAverageDay()
        console.log("daydata", this.moveAverageDay)
        this.updateChartSMA()
      });
  }

  updateDateTwoMinutesTwentyFourHour() {
    this.placesService
      .findSelectedStationsTwentyFourHour(this.thisID)
      .subscribe(() => {
        //console.log("updateDateTwoMinutes:", this.stationData[1].id)
        this.getSelectedStation()
      });
  }

  updateDateTwoMinutesSevenDay() {
    this.placesService
      .findSelectedStationsSevenDay(this.thisID)
      .subscribe(() => {
        //console.log("updateDateTwoMinutes:", this.stationData[1].id)
        this.getSelectedStation()
      });
  }

  updateDateSMA() {
    this.placesService
      .findSelectedStations(this.thisID)
      .subscribe(() => {
        this.placesService
          .getSelectedStation()
          .subscribe((data: Station[]) => {
            this.stationData = data
            //this.sortData()
            this.setMoveAverageHour()
            console.log("hour", this.moveAverage)
            this.stationSelected$ = of(this.stationData)
          });
        this.placesService
          .findSelectedStationsTwentyFourHour(this.thisID)
          .subscribe(() => {
            this.getSelectedStationDay()
            //console.log("day", this.moveAverageDay)
          });
      });
  }

/*  sortData() {
    this.stationData.sort(function (a, b) {
      return <any>new Date(a.lastCommunicationTime.valueOf()) - <any>new Date(b.lastCommunicationTime.valueOf());
    });
  }

  sortDataDay() {
    this.stationDataDay.sort(function (a, b) {
      return <any>new Date(a.lastCommunicationTime.valueOf()) - <any>new Date(b.lastCommunicationTime.valueOf());
    });
  }**/

  drawChart() {
    this.drawAxis();
    this.drawLine();
  }

  initSvg() {
    this.svg = d3.select('svg')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  initAxis() {
    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
  }

  drawAxis() {
    this.x.domain(d3Array.extent(this.stationData, (d) => new Date(d.lastCommunicationTime.valueOf())));
    //this.y.domain(d3Array.extent(this.stationData, (d) => d.availableDocks.valueOf()));
    this.y.domain([0, d3Array.max(this.stationData, (d) => Number(d.availableDocks.valueOf())) + 5]);
    this.xAxis = d3Axis.axisBottom(this.x);
    this.yAxis = d3Axis.axisLeft(this.y);
    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis)
      .append('text')
      .attr('class', 'axis-title')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Numbers');
  }

  drawLine() {
    this.line = d3Shape.line<Station>()
    this.line.x((d: any) => this.x(new Date(d.lastCommunicationTime.valueOf())))
      .y((d: any) => this.y(d.availableDocks.valueOf()));



    this.svg.append('path')
      .datum(this.stationData)
      .attr('class', 'line')
      .attr('d', this.line(this.stationData));

    this.line1 = d3Shape.line<MoveAverage>()
    this.line1.x((d: any) => this.x(new Date(d.lastCommunicationTime.valueOf())))
      .y((d: any) => this.y(d.availableDocks.valueOf()));
    this.svg.append('path')
      .datum(this.moveAverage)
      .attr('class', 'line1')
      .attr('d', this.line1(this.moveAverage))
      .style("opacity", 0);


    this.line2 = d3Shape.line<MoveAverage>()
    this.line2.x((d: any) => this.x(new Date(d.lastCommunicationTime.valueOf())))
      .y((d: any) => this.y(d.availableDocks.valueOf()));
    this.svg.append('path')
      .datum(this.moveAverageDay)
      .attr('class', 'line2')
      .attr('d', this.line2(this.moveAverageDay))
      .style("opacity", 0);
  }


  updateChart() {
    var body = d3.select('body').transition();
    body.selectAll(".d-inline-block")
      .style("opacity", 1);

    this.x.domain(d3Array.extent(this.stationData, (d) => new Date(d.lastCommunicationTime.valueOf())));
    this.y.domain([0, d3Array.max(this.stationData, (d) => Number(d.availableDocks.valueOf())) + 5]);

    /* this.line.x((d: any) => this.x(new Date(d.lastCommunicationTime.valueOf())))
      .y((d: any) => this.y(d.availableDocks.valueOf())) */

    var svg = d3.select('svg').transition();
    svg.selectAll(".line")
      .duration(750)
      .attr("d", this.line(this.stationData))

    svg.selectAll(".line1")
      .style("opacity", 0)

    svg.selectAll(".line2")
      .style("opacity", 0)

    svg.select(".axis.axis--x") // change the x axis
      .duration(750)
      .call(this.xAxis);

    svg.select(".axis.axis--y") // change the y axis
      .duration(750)
      .call(this.yAxis);
  }

  updateChartSMA() {
    var body = d3.select('body').transition();
    body.selectAll(".d-inline-block")
      .style("opacity", 0);

    /* this.line.x((d: any) => this.x(new Date(d.lastCommunicationTime.valueOf())))
      .y((d: any) => this.y(d.availableDocks.valueOf())) */
    this.cutMoveAverageDay = this.moveAverageDay.slice(-this.stationData.length)
    //console.log(this.cutMoveAverageDay)

    this.x.domain(d3Array.extent(this.stationData, (d) => new Date(d.lastCommunicationTime.valueOf())));
    this.y.domain([0, d3Array.max(this.cutMoveAverageDay, (d) => Number(d.availableDocks.valueOf())) + 5]);

    var svg = d3.select('svg').transition();

    svg.selectAll(".line")
      .duration(750)
      .attr("d", this.line(this.stationData));

    svg.selectAll(".line1")
      .attr("d", this.line1(this.moveAverage))
      .style("opacity", 1);

    svg.selectAll(".line2")
      .attr("d", this.line2(this.cutMoveAverageDay))
      .style("opacity", 1);

    svg.select(".axis.axis--x") // change the x axis
      .duration(750)
      .call(this.xAxis);

    svg.select(".axis.axis--y") // change the y axis
      .duration(750)
      .call(this.yAxis);
  }



  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
