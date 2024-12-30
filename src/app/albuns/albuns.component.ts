import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-albuns',
  templateUrl: './albuns.component.html',
  styleUrls: ['./albuns.component.scss']
})
export class AlbunsComponent implements OnInit {

  albums: string[] = [];
  images: string[] = [];
  selectedImage: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ){}

  ngOnInit(): void {
    this.http.get<{ subfolders: string[] }>('assets/assets-general-manifest.json').subscribe(data => {
      this.albums = data.subfolders;  // Álbuns (subpastas)
    });
  }

  loadAlbum(album: string): void {
    // Carrega o manifesto de subpasta correspondente ao álbum
    this.router.navigate(['/fotos', album]);
  }

  openModal(image: string): void {
    this.selectedImage = image;
  }

  closeModal(): void {
    this.selectedImage = null;
  }

}
