import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trades',
  standalone: true,
  templateUrl: './trades.component.html',
  styleUrl: './trades.component.css',
  imports: [CommonModule],
})

@Injectable({providedIn: 'root'})
export class TradesComponent implements OnInit{
  trades: TradeData[] | null = null;
  date: string = '2024-06-20';


  constructor(private http: HttpClient) {}

  getTotalProfits(): number {
    return this.trades?.reduce((acc, trade) => acc + parseFloat(trade.profit), 0) ?? 0;
  }

  getNetProfits(): number {
    return this.getTotalProfits() - this.getTotalBrokerage();
  }

  getTotalBrokerage(): number {
    return this.trades?.reduce((acc, trade) => acc + parseFloat(trade.brokerage), 0) ?? 0;
  }

  ngOnInit() {
    this.fetchData();
  }

  handleChangeDate(event: any) {
    this.date = event.target.value;
    this.fetchData();
  }

  fetchData() {
    this.http.get<{data: TradeData[]}>(`http://144.202.121.42:8000/trades/${this.date}`).subscribe({
      next: (response) => {
        console.log(response.data);
        this.trades = response.data; // Store the data in the variable
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      }
    });
  }
}

interface TradeData {
  bought_amount: string;
  bought_at: string;
  bought_time: string;
  brokerage: string;
  profit: string;
  sold_amount: string;
  sold_at: string;
  sold_time: string;
}
