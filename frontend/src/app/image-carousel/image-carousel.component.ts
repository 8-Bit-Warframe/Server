import {Component, OnInit} from '@angular/core';

export class ImageData {
    id: number;
    url: string;
    caption: string;
    loaded?: boolean = false;
}

declare const Blazy: any;

@Component({
    selector: 'image-carousel',
    templateUrl: './image-carousel.component.html',
    styleUrls: ['./image-carousel.component.scss']
})

export class ImageCarouselComponent implements OnInit {
    timer;
    direction = 1;
    current = 0;
    images: ImageData[] = [
        {
            id: 0,
            url: 'assets/images/image1.png',
            caption: 'Lost Sector'
        }
    ];

    ngOnInit() {
        if (this.images.length > 1) {
            this.createInterval();
        }
        this.loadImages();
    }

    onSelect(image: ImageData): void {
        if (this.images.length > 1) {
            this.current = image.id;
            clearInterval(this.timer);
            this.createInterval();
        }
    }

    private createInterval() {
        this.timer = setInterval(() => {
            if (this.direction === 1 && this.current === this.images.length - 1) {
                this.direction = -1;
            }
            if (this.direction === -1 && this.current === 0) {
                this.direction = 1;
            }
            this.current += this.direction;
            this.loadImages();
        }, 5000);
    }

    private loadImages() {
        this.images.forEach((value, index) => {
            if (!value.loaded && Math.abs(this.current - index) <= 1) {
                this.loadImage(value)
                    .then(data => {
                        let e = document.getElementById(`carousel-${data.id}`);
                        e.style.backgroundImage = `url(${data.url})`;
                        e.removeChild(e.childNodes[1]);
                    });
            }
        })
    }

    private loadImage(data: ImageData): Promise<ImageData> {
        return new Promise(resolve => {
            let img = new Image();
            img.onload = ev => resolve(data);
            img.src = data.url;
        });
    }
}
