import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  images: string[] = [];
    startDate: Date = new Date('2022-11-19T00:00:00');  // Data inicial
    currentTime: Date = new Date();  // Data atual
    timeDifference: any = {};
    isMobile = false;
    isSpecialDay = false;

    constructor(
      private http: HttpClient
    ){
      this.isMobile = this.eCelular();
    }

    ngOnInit(): void {
      this.checkSpecialDay();
      this.http.get<{ allImages: string[]; subfolders: string[] }>('assets/assets-general-manifest.json').subscribe((data) => {
      this.images = data.allImages.map(file => `assets/${file}`);
      this.shuffleImages();
    });

      this.updateTime();
      setInterval(() => {
        this.updateTime();
      }, 1000); // Atualiza a cada 1 segundo
    }

    checkSpecialDay() {
      const today = new Date();
      const specialDay = new Date(today.getFullYear(), today.getMonth(), 19);
      console.log(specialDay)

      if (today.getDate() === specialDay.getDate() && today.getMonth() === specialDay.getMonth()) {
        this.isSpecialDay = true;
      }

      document.addEventListener("DOMContentLoaded", () => {
        const fireworks = document.getElementById("fireworks");

        if (fireworks) {
          setTimeout(() => {
            fireworks.style.display = "none"; // Esconde o elemento
          }, 5000); // Ajuste para a duração real do GIF
        }
      });
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
