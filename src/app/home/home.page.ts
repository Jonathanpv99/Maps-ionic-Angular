import { Component, ElementRef, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { ModalController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map')mapRef!: ElementRef<HTMLElement>;
  map!: GoogleMap;

  constructor(private modalCtrl: ModalController) {}

  ionViewDidEnter() {
    // Probably not necessary in the future
    setTimeout(() => {
      this.createMap();
    }, 200);
  }

  async createMap() {
    this.map = await GoogleMap.create({
      forceCreate: true, // Prevent issues with live reload
      id: 'my-map',
      element: this.mapRef.nativeElement,
      apiKey: environment.mapsKey,
      config: {
        center: {
          lat: 20.03133190324908,
          lng: -100.71976903255897,
        },
        zoom: 13,
      },
    });
    await this.addMarkers();
  }

  async addMarkers() {
    const markers: Marker[] = [
      {
        coordinate: {
          lat: 20.026746469231476,
          lng: -100.70026227288871,
        },
        title: 'cerro del toro',
        snippet: 'ahi subo a hacer ejercicio',
      },
      {
        coordinate: {
          lat: 20.024652910396284,
          lng: -100.72651829683636,
        },
        title: 'Panteon MPAL Acambaro',
        snippet: 'ahi esta la floreria',
      },
    ];
    await this.map.addMarkers(markers);

    this.map.setOnMarkerClickListener(async (marker) => {
      const modal = await this.modalCtrl.create({
        component: ModalPage,
        componentProps: {
          marker,
        },
        breakpoints: [0, 0.3],
        initialBreakpoint: 0.3,
      });
      modal.present();
    });
  }

  async locateMe() {
    const coordinates = await Geolocation.getCurrentPosition();

    if (coordinates) {
      this.map.setCamera({
        coordinate: {
          lat: coordinates.coords.latitude,
          lng: coordinates.coords.longitude,
        },
        zoom: 17,
      });
    }
  }
}
