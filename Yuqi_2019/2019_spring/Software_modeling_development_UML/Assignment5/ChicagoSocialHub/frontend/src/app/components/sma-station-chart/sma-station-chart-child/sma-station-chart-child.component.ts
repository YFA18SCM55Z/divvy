import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';
import { Station } from '../../../station';
import { moveAverage as MoveAverage } from '../../../moveAverage';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'

import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as time from 'd3-time';

@Component({
  selector: 'app-sma-station-chart-child',
  templateUrl: './sma-station-chart-child.component.html',
  styleUrls: ['./sma-station-chart-child.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmaStationChartChildComponent implements OnInit, OnChanges {
  private moveAverage: MoveAverage[] = [];
  private averageHourNumber: number;
  private moveAverageDay: MoveAverage[] = [];
  private averageDayNumber: number;
  private averageSevenDayNumber: number;
  private moveAverageSevenDay: MoveAverage[] = [];

  private line: d3Shape.Line<MoveAverage>;
  private line1: d3Shape.Line<Station>;


  timeTitle = 'One Hour'
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private width: number;
  private height: number;
  private x: any;
  private y: any;
  private svg: any;

  private xAxis: any;
  private yAxis: any;
  private alreadyBuild: any;



  private whichScale: any;

  @Input() stationDataSevenDay: Station[];
  @Input() stationDataOneDay: Station[];
  @Input() stationDataOneHour: Station[];

  stationSelected$: Observable<Station[]>;
  stationData: Station[];


  constructor() {
    this.width = 1300 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.averageHourNumber = 0;
    this.averageDayNumber = 0;
    this.averageSevenDayNumber = 0;
    this.alreadyBuild = 0;
    this.whichScale = 0;
  }

  getWithinOneHourData() {
    var stationDataOneHour: Station[] = [];
    var dateBegin = new Date();
    for (let i = this.stationDataSevenDay.length - 1; i >= 0; i--) {
      var dateEnd = new Date(this.stationDataSevenDay[i].lastCommunicationTime.valueOf());
      var dateDiff = dateBegin.getTime() - dateEnd.getTime();
      var leave1 = dateDiff % (24 * 3600 * 1000);
      var hours = Math.ceil(leave1 / (3600 * 1000));
      if (hours <= 1) {
        stationDataOneHour = [this.stationDataSevenDay[i]].concat(stationDataOneHour);
      } else {
        break;
      }
    }
    return stationDataOneHour;
  }

  getWithinOneDayData() {
    var stationDataOneDay: Station[] = [];
    var dateBegin = new Date();
    for (let i = this.stationDataSevenDay.length - 1; i >= 0; i--) {
      var dateEnd = new Date(this.stationDataSevenDay[i].lastCommunicationTime.valueOf());
      var dateDiff = dateBegin.getTime() - dateEnd.getTime();
      var dayDiff = Math.ceil(dateDiff / (24 * 3600 * 1000));
      if (dayDiff <= 1) {
        stationDataOneDay = [this.stationDataSevenDay[i]].concat(stationDataOneDay);
      } else {
        break;
      }
    }
    return stationDataOneDay;
  }


  ngOnInit() {
    this.initSvg();
    this.initAxis();
  }
  ngOnChanges() {
    if (this.stationDataSevenDay && this.alreadyBuild == 0) {
      this.alreadyBuild = 1;
      this.stationData = this.stationDataOneHour;
      this.stationSelected$ = of(this.stationData);
      this.setMoveAverageHour();
      this.drawChart();
    } else if (this.stationDataSevenDay && this.alreadyBuild == 1) {
      if (this.whichScale == 0) {
        this.stationData = this.stationDataOneHour;
        this.stationSelected$ = of(this.stationData);
        this.setMoveAverageHour();
        this.updateChartSMA();
      }
      if (this.whichScale == 1) {
        this.stationData = this.stationDataOneDay;
        this.stationSelected$ = of(this.stationData);
        this.setMoveAverageDay();
        this.updateChartSMA();
      }
      if (this.whichScale == 2) {
        this.stationData = this.stationDataSevenDay;
        this.stationSelected$ = of(this.stationData);
        this.setMoveAverageSevenDay();
        this.updateChartSMA();
      }
    }
  }

  setMoveAverageHour() {
    this.averageHourNumber = 0;
    this.moveAverage = [];
    for (let i = 0; i < this.stationDataOneHour.length; i++) {
      let temp: MoveAverage = {} as any;
      this.averageHourNumber = this.averageHourNumber + this.stationDataOneHour[i].availableDocks.valueOf();
      temp.availableDocks = Number(this.averageHourNumber / (i + 1));
      temp.lastCommunicationTime = this.stationDataOneHour[i].lastCommunicationTime;
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


  setMoveAverageSevenDay() {
    this.averageSevenDayNumber = 0;
    this.moveAverageSevenDay = [];
    for (let i = 0; i < this.stationDataSevenDay.length; i++) {
      let temp: MoveAverage = {} as any;
      this.averageSevenDayNumber = this.averageSevenDayNumber + this.stationDataSevenDay[i].availableDocks.valueOf();
      temp.availableDocks = Number(this.averageSevenDayNumber / (i + 1));
      temp.lastCommunicationTime = this.stationDataSevenDay[i].lastCommunicationTime;
      this.moveAverageSevenDay.push(temp);
    }
  }

  subscribeIntervalSMA() {
    this.timeTitle = 'One Hour'
    this.whichScale = 0;
    this.stationData = this.stationDataOneHour;
    this.stationSelected$ = of(this.stationData);
    this.setMoveAverageHour();
    this.updateChartSMA();
  }

  subscribeIntervalSMAOneDay() {
    this.timeTitle = 'Twenty Four Hours';
    this.whichScale = 1;
    this.stationData = this.stationDataOneDay;
    this.stationSelected$ = of(this.stationData);
    this.setMoveAverageDay();
    this.updateChartSMA();
  }

  subscribeIntervalSMASevenDay() {
    this.timeTitle = 'Seven Days';
    this.whichScale = 2;
    this.stationData = this.stationDataSevenDay;
    this.stationSelected$ = of(this.stationData);
    this.setMoveAverageSevenDay();
    this.updateChartSMA();
  }

  maxData(d1, d2) {
    var temp = d1;
    if (d2 > temp) {
      temp = d2;
    }
    return temp;
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
    var maximum: any;
    this.x.domain(d3Array.extent(this.moveAverage, (d) => new Date(d.lastCommunicationTime.valueOf())));
    maximum = this.maxData(d3Array.max(this.moveAverage, (d) => Number(d.availableDocks.valueOf()))
      , d3Array.max(this.stationData, (d) => Number(d.availableDocks.valueOf())));
    this.y.domain([0, Number(maximum) + 5]);

    this.xAxis = d3Axis.axisBottom(this.x).ticks(time.timeMinute.every(2));
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
    this.line = d3Shape.line<MoveAverage>();
    this.line.x((d: any) => this.x(new Date(d.lastCommunicationTime.valueOf())))
      .y((d: any) => this.y(d.availableDocks.valueOf()));
    this.line1 = d3Shape.line<Station>();
    this.line1.x((d: any) => this.x(new Date(d.lastCommunicationTime.valueOf())))
      .y((d: any) => this.y(d.availableDocks.valueOf()));


    this.svg.append('path')
      .datum(this.moveAverage)   // bind data element to the SVG element
      .attr('class', 'line')
      .attr('d', this.line(this.moveAverage));

    this.svg.append('path')
      .datum(this.stationData)
      .attr('class', 'line1')
      .attr('d', this.line1(this.stationData));
  }


  updateChartSMA() {
    var maximum: any;
    if (this.whichScale == 0) {
      this.xAxis = d3Axis.axisBottom(this.x).ticks(time.timeMinute.every(2));
    } else if (this.whichScale == 1) {
      this.xAxis = d3Axis.axisBottom(this.x).ticks(time.timeHour.every(1));
    } else if (this.whichScale == 2) {
      this.xAxis = d3Axis.axisBottom(this.x).ticks(time.timeDay.every(1));
    }

    this.x.domain(d3Array.extent(this.stationData, (d) => new Date(d.lastCommunicationTime.valueOf())));


    var svg = d3.select('svg').transition();

    if (this.whichScale == 0) {
      maximum = this.maxData(d3Array.max(this.moveAverage, (d) => Number(d.availableDocks.valueOf()))
        , d3Array.max(this.stationData, (d) => Number(d.availableDocks.valueOf())));
      this.y.domain([0, Number(maximum) + 5]);
      svg.selectAll(".line")
        .duration(750)
        .attr("d", this.line(this.moveAverage))
        .style("stroke", "blue");
      svg.selectAll(".line1")
        .duration(750)
        .attr("d", this.line1(this.stationData));
    } else if (this.whichScale == 1) {
      maximum = this.maxData(d3Array.max(this.moveAverageDay, (d) => Number(d.availableDocks.valueOf()))
        , d3Array.max(this.stationData, (d) => Number(d.availableDocks.valueOf())));
      this.y.domain([0, Number(maximum) + 5]);
      svg.selectAll(".line")
        .duration(750)
        .attr("d", this.line(this.moveAverageDay))
        .style("stroke", "red");
      svg.selectAll(".line1")
        .duration(750)
        .attr("d", this.line1(this.stationData));
    } else if (this.whichScale == 2) {
      maximum = this.maxData(d3Array.max(this.moveAverageSevenDay, (d) => Number(d.availableDocks.valueOf()))
        , d3Array.max(this.stationData, (d) => Number(d.availableDocks.valueOf())));
      this.y.domain([0, Number(maximum) + 5]);
      svg.selectAll(".line")
        .duration(750)
        .attr("d", this.line(this.moveAverageSevenDay))
        .style("stroke", "red");;
      svg.selectAll(".line1")
        .duration(750)
        .attr("d", this.line1(this.stationData));
    }
    svg.select(".axis.axis--x")
      .duration(750)
      .call(this.xAxis);

    svg.select(".axis.axis--y")
      .duration(750)
      .call(this.yAxis);
  }
}
