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
  private whichScale: any;
  private subscription: ISubscription;
  private moveAverage: MoveAverage[] = [];
  private averageHourNumber: number;
  private moveAverageDay: MoveAverage[] = [];
  private averageDayNumber: number;
  private cutMoveAverageDay: MoveAverage[] = [];


  @Input() stationSelected$: Observable<Station[]>
  stationData: Station[]
  stationDataSevenDay: Station[]
  stationDataOneDay: Station[]
  thisID: any

  constructor(private placesService: PlacesService) {
    this.width = 1300 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

  }

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


  getWithinOneHourData() {
    var stationDataOneHour: Station[] = []
    var dateBegin = new Date();
    for(let i = this.stationDataSevenDay.length - 1; i >= 0; i--) {
      var dateEnd = new Date(this.stationDataSevenDay[i].lastCommunicationTime.valueOf())
      var dateDiff = dateBegin.getTime() - dateEnd.getTime();
      var leave1 = dateDiff % (24 * 3600 * 1000);
      var hours = Math.ceil(leave1 / (3600 * 1000));
      if (hours <= 1) {
        stationDataOneHour = [this.stationDataSevenDay[i]].concat(stationDataOneHour)
      } else {
        break;
      } 
    }
    return stationDataOneHour
  }

  getWithinTwentyFourHourData() {
    var stationDataOneDay: Station[] = []
    var dateBegin = new Date();
    for(let i = this.stationDataSevenDay.length - 1; i >= 0; i--) {
      var dateEnd = new Date(this.stationDataSevenDay[i].lastCommunicationTime.valueOf())
      var dateDiff = dateBegin.getTime() - dateEnd.getTime();
      var dayDiff = Math.ceil(dateDiff / (24 * 3600 * 1000));
      if (dayDiff <= 1) {
        stationDataOneDay = [this.stationDataSevenDay[i]].concat(stationDataOneDay)
      } else {
        break;
      } 
    }
    return stationDataOneDay
  }

  ngOnInit() {
    this.whichScale = 0;
    this.averageHourNumber = 0;
    this.averageDayNumber = 0;
    this.initSvg();
    this.initAxis();
    this.placesService
      .getSelectedStation()
      .subscribe((data: Station[]) => {
        this.thisID = data[0].id
        this.stationDataSevenDay = data
        this.stationData = this.getWithinOneHourData()
        this.stationSelected$ = of(this.stationData)
        this.drawChart()
        console.log(this.stationData)
        let UpdateObservable = this.placesService.getUpdates(this.thisID);
        this.subscription = UpdateObservable.subscribe((latestStatus: Station) => {
          this.stationDataSevenDay.push(latestStatus)
          this.stationDataSevenDay = this.updateStationDataWithinSevenDay()
          if(this.whichScale == 0) {
          this.stationData = this.getWithinOneHourData()
          console.log("what??????",this.stationData)
          this.stationSelected$ = of(this.stationData)
          this.updateChart()
          }
          if (this.whichScale == 1) {
            this.stationData = this.getWithinTwentyFourHourData()
            this.stationSelected$ = of(this.stationData)
            this.updateChart()
          }
          if (this.whichScale == 2) {
            this.stationData = this.stationDataSevenDay
            this.stationSelected$ = of(this.stationData)
            this.updateChart()
          }
          if (this.whichScale == 3) {
            this.stationData = this.getWithinOneHourData()
            this.stationSelected$ = of(this.stationData)
            this.stationDataOneDay = this.getWithinTwentyFourHourData()
            this.setMoveAverageHour()
            this.setMoveAverageDay()
            this.updateChartSMA()
          }
        });
      });
  }

  subscribeIntervalOneHour() {
    this.timeTitle = 'One Hour'
    this.whichScale = 0
    this.stationData = this.getWithinOneHourData()
    this.stationSelected$ = of(this.stationData)
    this.updateChart()
  }

  subscribeIntervalTwentyFourHour() {
    this.timeTitle = 'Twenty Four Hours'
    this.whichScale = 1
    this.stationData = this.getWithinTwentyFourHourData()
    this.stationSelected$ = of(this.stationData)
    this.updateChart()
  }

  subscribeIntervalSevenDay() {
    this.timeTitle = 'Seven Days'
    this.whichScale = 2
    this.stationData = this.stationDataSevenDay
    console.log(this.stationDataSevenDay)
    this.stationSelected$ = of(this.stationData)
    this.updateChart()
  }

  subscribeIntervalSMA() {
    this.timeTitle = 'SMA CHART'
    this.whichScale = 3
    this.stationData = this.getWithinOneHourData()
    this.stationSelected$ = of(this.stationData)
    this.stationDataOneDay = this.getWithinTwentyFourHourData()
    this.setMoveAverageHour()
    this.setMoveAverageDay()
    this.updateChartSMA()
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
    for (let i = 0; i < this.stationDataOneDay.length; i++) {
      let temp: MoveAverage = {} as any;
      this.averageDayNumber = this.averageDayNumber + this.stationDataOneDay[i].availableDocks.valueOf();
      temp.availableDocks = Number(this.averageDayNumber / (i + 1));
      temp.lastCommunicationTime = this.stationDataOneDay[i].lastCommunicationTime;
      this.moveAverageDay.push(temp);
    }
  }

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

  maxData (d1, d2, d3) {
    var temp = d1;
    if (d2 > temp) {
      temp = d2
    }
    if (d3 > temp) {
      temp = d3
    }
    return temp
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
    var maximum : any;
    var body = d3.select('body').transition();
    body.selectAll(".d-inline-block")
      .style("opacity", 0);

    /* this.line.x((d: any) => this.x(new Date(d.lastCommunicationTime.valueOf())))
      .y((d: any) => this.y(d.availableDocks.valueOf())) */
    this.cutMoveAverageDay = this.moveAverageDay.slice(-this.stationData.length)
   
    maximum = this.maxData(d3Array.max(this.cutMoveAverageDay, (d) => Number(d.availableDocks.valueOf()))
            ,d3Array.max(this.moveAverage, (d) => Number(d.availableDocks.valueOf()))
            ,d3Array.max(this.stationData, (d) => Number(d.availableDocks.valueOf())))
    this.x.domain(d3Array.extent(this.stationData, (d) => new Date(d.lastCommunicationTime.valueOf())));
    
    this.y.domain([0, Number(maximum) + 5]);
    

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
    this.placesService.soketOff();
  }

}
