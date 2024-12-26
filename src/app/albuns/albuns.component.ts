import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-albuns',
  templateUrl: './albuns.component.html',
  styleUrls: ['./albuns.component.scss']
})
export class AlbunsComponent implements OnInit {

  images: string[] = [];
  selectedImage: string | null = null;

  constructor(
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.http.get<string[]>('./assets/casamento-manifest.json').subscribe((data) => {
      this.images = data
    });
  }

  openModal(image: any): void {
    console.log(image)
    this.selectedImage = image;
  }

  closeModal(): void {
    this.selectedImage = null;
  }
}
