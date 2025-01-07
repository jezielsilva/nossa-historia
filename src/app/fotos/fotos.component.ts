import { HttpClient } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.component.html',
  styleUrls: ['./fotos.component.scss']
})
export class FotosComponent implements OnInit {

  images: string[] = [];
  selectedImage: string | null = null;
  album: any;

  constructor(
    private http: HttpClient,
    private router: ActivatedRoute,
    //private modalService: NgbModal
  ){}

  ngOnInit(): void {
    this.album = this.router.snapshot.paramMap.get('albumNome');
    this.http.get<string[]>(`assets/${this.album}-manifest.json`).subscribe(data => {
      this.images = data.map(file => file);  // Gera o caminho completo das imagens
    });
  }

  openModal(image: string): void {
    this.selectedImage = image;  // Define a imagem selecionada
  }

}
