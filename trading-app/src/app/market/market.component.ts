import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
  standalone: true,
  imports: [CommonModule, PlotlyModule],
})

@Injectable({providedIn: 'root'})
export class MarketComponent implements OnInit {
  marketData: MarketData[] | null = null; // Variable to store the fetched data
  graph_price = {
    data: [
      { x: [] as string[], y: [] as number[], type: 'scatter', mode: 'lines', marker: {color: 'blue'}, name: 'Price' },
      { x: [] as string[], y: [] as number[], type: 'scatter', mode: 'lines', marker: {color: 'red'}, name: 'Low' },
      { x: [] as string[], y: [] as number[], type: 'scatter', mode: 'lines', marker: {color: 'green'}, name: 'High' }
    ],
    layout: { title: 'Market Data', template: "plotly_dark" }
  };
  graph_indicators: any[] = [];
  foundPairs: { indicator: string, signal: string }[] = [];
  soleIndicators: string[] = [];
  showModal = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
    setInterval(() => {
      this.fetchData(); // Fetch new data and update the graph every second
    }, 1000); // 1000 milliseconds = 1 second
  }

  findSoleIndicators() {
    if (this.marketData && this.marketData.length > 0 && this.soleIndicators.length == 0) {
      this.soleIndicators = Object.keys(this.marketData[0]).filter(key => 
        !['time', 'price', 'high', 'low', 'best_bid', 'best_ask', 'product_id', 'size', 'side', 'open'].includes(key) &&
        !key.includes('window') &&
        !key.includes('_Signal') &&
      !this.foundPairs.some(pair => pair.indicator === key)
      )
    }
    this.graph_indicators = [
      ...this.foundPairs.map((pair) => {
        return {
          data: [
            { x: [] as string[], y: [] as number[], type: 'scatter', mode: 'lines', marker: {color: 'blue'}, name: pair['indicator'] },
            { x: [] as string[], y: [] as number[], type: 'scatter', mode: 'lines', marker: {color: 'red'}, name: pair['signal'] },
          ],
          layout: { title: 'Market Data' }
        };
      }),
      ...this.soleIndicators.map((indicator) => {
        return {
          data: [
            { x: [] as string[], y: [] as number[], type: 'scatter', mode: 'lines', marker: {color: 'blue'}, name: indicator }
          ],
          layout: { title: 'Market Data' }
        };
      })
    ];
  }

  closeModal() {
    this.showModal = false;
  }

  openModal() {
    this.showModal = true;
  }

  findPairs() {
    if (this.marketData && this.foundPairs.length == 0) {
      const firstMarketData = this.marketData[0];
      for (const key in firstMarketData) {
        const signalKey = key + '_Signal';
        if (signalKey in firstMarketData) {
          this.foundPairs.push({ indicator: key, signal: signalKey });
        }
      }
      
    }
  }

  fetchData() {
    this.http.get<{data: MarketData[]}>('http://144.202.121.42:8000/data/').subscribe({
      next: (response) => {
        this.marketData = response.data; // Store the data in the variable
        this.findPairs();
        this.findSoleIndicators();
        this.updateGraph();
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  updateGraph() {
    const scrollPosition = window.scrollY;
    // Update graph logic here
    window.requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
    if (this.marketData) {
      this.graph_price.data[0].x = this.marketData.map(data => data.time);
      this.graph_price.data[0].y = this.marketData.map(data => data.price);
      this.graph_price.data[1].x = this.marketData.map(data => data.time);
      this.graph_price.data[1].y = this.marketData.map(data => data.low);
      this.graph_price.data[2].x = this.marketData.map(data => data.time);
      this.graph_price.data[2].y = this.marketData.map(data => data.high);
      this.foundPairs.forEach((pair, index) => {
        this.graph_indicators[index].data[0].x = this.marketData?.map(data => data.time);
        this.graph_indicators[index].data[0].y = this.marketData?.map(data => data[pair.indicator]);
        this.graph_indicators[index].data[1].x = this.marketData?.map(data => data.time);
        this.graph_indicators[index].data[1].y = this.marketData?.map(data => data[pair.signal]);
        this.graph_indicators[index].layout.title = this.foundPairs[index].indicator;
      });
      this.soleIndicators.forEach((indicator, index) => {
        this.graph_indicators[this.foundPairs.length + index].data[0].x = this.marketData?.map(data => data.time);
        this.graph_indicators[this.foundPairs.length + index].data[0].y = this.marketData?.map(data => data[indicator]);
        this.graph_indicators[this.foundPairs.length + index].layout.title = this.soleIndicators[index];
      });
    }
  }
}

interface MarketData {
  product_id: string;
  price: number;
  low: number;
  high: number;
  time: string;
  [key: string]: string | number;
}