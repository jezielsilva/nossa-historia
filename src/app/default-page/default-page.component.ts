import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default-page',
  templateUrl: './default-page.component.html',
  styleUrls: ['./default-page.component.scss']
})
export class DefaultPageComponent implements OnInit {

  images: string[] = [];
  startDate: Date = new Date('2022-11-19T00:00:00');  // Data inicial
  currentTime: Date = new Date();  // Data atual
  timeDifference: any = {};

  constructor(
    private http: HttpClient
  ){}

  ngOnInit(): void {
    // this.http.get<string[]>('/assets/assets-manifest.json').subscribe((data) => {
    //   this.images = data.map(file => `assets/${file}`);
    //   this.shuffleImages();  // Embaralha as imagens após carregá-las
    // });

    // this.updateTime();
    // setInterval(() => {
    //   this.updateTime();
    // }, 1000); // Atualiza a cada 1 segundo
  }

  shuffleImages(): void {
    for (let i = this.images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Gera um índice aleatório
      [this.images[i], this.images[j]] = [this.images[j], this.images[i]]; // Troca os elementos
    }
  }

  updateTime() {
    this.currentTime = new Date();  // Atualiza a data atual

    const totalSeconds = Math.floor((this.currentTime.getTime() - this.startDate.getTime()) / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = Math.floor(totalDays / 30.4375);  // Média de dias em um mês
    const totalYears = Math.floor(totalDays / 365.25);  // Média de dias em um ano

    this.timeDifference = {
      years: totalYears,
      months: totalMonths - (totalYears * 12),  // Calcula o restante dos meses
      weeks: totalWeeks - (totalYears * 52),  // Calcula o restante das semanas
      days: totalDays % 365.25 % 30.4375,  // Resto dos dias após anos e meses
      hours: totalHours % 24,
      minutes: totalMinutes % 60,
      seconds: totalSeconds % 60
    };
  }

}
