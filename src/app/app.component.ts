import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  DialogContentDialog,
  FormDialog,
} from './dialog.component/dialog.component';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';

type VISITORS = { value: number; label: string };

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    RouterOutlet,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  // dates
  today = new Date();
  endDate = new Date();
  startDate = new Date();

  // users
  counts: any = 0;
  visitors: VISITORS[] = [];
  linechart: any = [];

  // requests urls
  id = 17351206;
  url_today = `/stat/v1/data?metrics=ym:s:users&id=${
    this.id
  }&date1=${this.formatDate(this.today)}&date2=${this.formatDate(this.today)}`;

  url_bitrix =
    'https://gn-tst.ideavl.ru/rest/6482/ndke0n7gmd1yf3fs/task.item.add.json';

  headers = new HttpHeaders({
    Authorization:
      'Bearer y0_AgAAAABB48KGAAqiEgAAAAEALZL9AADyc_h_QPBB1p55oCgWMCFxtF31GA',
  });

  constructor(public dialog: MatDialog) {}

  private http = inject(HttpClient);

  ngOnInit() {
    let startDate = moment().add(-7, 'day'); // -1  week
    for (let index = 0; index < 7; index++) {
      this.visitors.push({
        value: index * 100,
        label: startDate.clone().add(index, 'day').format('YYYY-MM-DD'),
      });
    }

    this.getUsersToday();
    this.getChart(); // отрисуем какой то там фейковый график за неделю
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  startChange(event: any) {
    this.startDate = event.value;
  }

  startEnd(event: any) {
    this.endDate = event.value;
  }

  getUsersToday() {
    this.http
      .get(this.url_today, { headers: this.headers })
      .subscribe((data: any) => {
        //     console.log(`Dialog result: today`, data);
        this.counts = data.totals[0] || 0;
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentDialog);
    dialogRef.afterClosed().subscribe((result: FormDialog) => {
      if (result) {
        this.http
          .post(this.url_bitrix, {
            fields: {
              TITLE: result.overview,
              DESCRIPTION: result.description,
              RESPONSIBLE_ID: 1,
              CREATED_BY: 1,
              GROUP_ID: 1,
            },
          })
          .subscribe((response) => console.log(response));
      }
    });
  }

  getChart(): void {
    this.linechart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: this.visitors.map((l) => l.label),
        datasets: [
          {
            data: this.visitors.map((v) => v.value),
            borderColor: '#3cb371',
            backgroundColor: '#0000FF',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (e: any, activeEls) => {
          if (activeEls[0]) {
            let datasetIndex = activeEls[0].datasetIndex;
            let dataIndex = activeEls[0].index;
            let datasetLabel = e.chart.data.datasets[datasetIndex].label;
            let value = e.chart.data.datasets[datasetIndex].data[dataIndex];
            let label = e.chart.data.labels[dataIndex];
            //   console.log('In click label=', label);
            //   console.log('In click value=', value);
            this.getVisitorsToday(label);
          }
        },
      },
    });
  }

  getVisitorsToday(date: string): void {
    const parse = this.formatDate(new Date(date));
    const url = `/stat/v1/data?metrics=ym:s:users&id=${this.id}&date1=${parse}&date2=${parse}`;
    this.http.get(url, { headers: this.headers }).subscribe((data: any) => {
      // console.log('yandex metrics', data);
      const index = (this.linechart.data.labels as Array<string>).findIndex(
        (f) => f === date
      );
      if (index >= 0) {
        (this.linechart.data.datasets[0].data[index] = data.totals[0] || 0),
          console.log(this.linechart.data);
      }
      this.linechart.update();
      this.openDialog();
    });
  }
}
