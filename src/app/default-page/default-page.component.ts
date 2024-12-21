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
  isMobile = false;

  constructor(
    private http: HttpClient
  ){
    this.isMobile = this.eCelular();
  }

  ngOnInit(): void {
    this.http.get<string[]>('./assets/assets-manifest.json').subscribe((data) => {
      this.images = data.map(file => `assets/${file}`);
      this.shuffleImages();  // Embaralha as imagens após carregá-las
    });

    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000); // Atualiza a cada 1 segundo
  }

  shuffleImages(): void {
    for (let i = this.images.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Gera um índice aleatório
      [this.images[i], this.images[j]] = [this.images[j], this.images[i]]; // Troca os elementos
    }
  }

  eCelular() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || window.innerWidth <= 910) return true;
    if (/IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) || window.innerWidth <= 910) return true;
    if (/Chrome/i.test(navigator.userAgent)) return false;
    return false;
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

    // Remover quaisquer pontos ou símbolos e garantir que são números inteiros
    this.timeDifference = {
      years: Math.floor(totalYears),
      months: Math.floor(totalMonths - (totalYears * 12)),  // Calcula o restante dos meses
      weeks: Math.floor(totalWeeks - (totalYears * 52)),  // Calcula o restante das semanas
      days: Math.floor(totalDays - (totalYears * 365.25) - ((totalMonths - (totalYears * 12)) * 30.4375)),  // Calcula o restante dos dias
      hours: totalHours % 24,
      minutes: totalMinutes % 60,
      seconds: totalSeconds % 60
    };

    // Para garantir que valores não tenham caracteres não numéricos
    for (let key in this.timeDifference) {
      this.timeDifference[key] = Math.floor(this.timeDifference[key]).toString().replace(/[^\d]/g, '');
    }
  }



}
