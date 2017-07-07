import {Component} from "@angular/core";

export class Image {
    id: number;
    url: string;
    caption: string;
}

declare const Blazy: any;

@Component({
    selector: 'image-carousel',
    templateUrl: './image-carousel.component.html',
    styleUrls: ['./image-carousel.component.scss']
})

export class ImageCarouselComponent {
    timer;
    direction = 1;
    current = 0;
    images: Image[] = [
        {
            id: 0,
            url: 'assets/images/image1.png',
            caption: 'Lost Sector'
        }
    ];

    ngOnInit() {
        if (this.images.length > 1) {
            this.createInterval();
            ImageCarouselComponent.runBlazy();
        }
    }

    onSelect(image: Image): void {
        if (this.images.length > 1) {
            this.current = image.id;
            clearInterval(this.timer);
            this.createInterval();
        }
    }

    private createInterval() {
        this.timer = setInterval(() => {
            if (this.direction == 1 && this.current == this.images.length - 1) {
                this.direction = -1;
            }
            if (this.direction == -1 && this.current == 0) {
                this.direction = 1;
            }
            this.current += this.direction;
            ImageCarouselComponent.runBlazy();
        }, 5000);
    }

    private static runBlazy() {
        new Blazy({
            src: 'data-blazy',
            offset: 1000,
            success: function(e: Element) {
                e.removeChild(e.childNodes[1]);
            }
        });
    }
}