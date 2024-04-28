import { Injectable, inject } from "@angular/core";
import { UserLocationDetails } from "../types/location.type";


@Injectable({
    providedIn: 'root',
})

export class UtilService {

    checkLocationDetails() {
        return navigator.permissions.query({ name: "geolocation" })
    }

    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve(position);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    setUserLocationDetails(user_location_details: UserLocationDetails) {
        localStorage.setItem('user_location_details', JSON.stringify(user_location_details))
    }

    getUserLocationDetails() {
        const locationInfo = localStorage.getItem('user_location_details');
        if (locationInfo !== null) {
            return JSON.parse(locationInfo);
        } else {
            return null;
        }
    }
}