import {Component} from "@angular/core";

export class Image {
    id: number;
    url: string;
    caption: string;
}

declare const Blazy: any;

@Component({
    selector: 'image-carousel',
    templateUrl: './image-carousel-component.html',
    styleUrls: ['./image-carousel-component.css']
})

export class ImageCarouselComponent {
    timer;
    direction = 1;
    current = 0;
    images: Image[] = [
        {
            id: 0,
            url: 'https://wallpaperfx.com/view_image/union-jack-flag-of-the-uk-1920x1080-wallpaper-18581.jpg',
            caption: 'Caption 1'
        },
        {
            id: 1,
            url: 'https://wallpaperfx.com/view_image/luxury-resort-in-maldives-1920x1080-wallpaper-18571.jpg',
            caption: 'Caption 2'
        },
        {
            id: 2,
            url: 'https://wallpaperfx.com/view_image/hamburg-promenade-view-1920x1080-wallpaper-18565.jpg',
            caption: 'Caption 3'
        },
        {
            id: 3,
            url: 'https://wallpaperfx.com/view_image/the-grand-canal-venice-1920x1080-wallpaper-18553.jpg',
            caption: 'Caption 4'
        },
        {
            id: 4,
            url: 'https://wallpaperfx.com/view_image/lauterbrunnen-valley-1920x1080-wallpaper-18551.jpg',
            caption: 'Caption 5'
        },
        {
            id: 5,
            url: 'https://wallpaperfx.com/view_image/blue-mountains-1920x1080-wallpaper-18549.jpg',
            caption: 'Caption 6'
        }
    ];

    ngOnInit() {
        console.log(this.direction);
        this.createInterval();
        ImageCarouselComponent.runBlazy();
    }

    onSelect(image: Image): void {
        this.current = image.id;
        clearInterval(this.timer);
        this.createInterval();
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
            offset: 0,
            success: function(e: Element) {
                e.removeChild(e.childNodes[1]);
            }
        });
    }
}