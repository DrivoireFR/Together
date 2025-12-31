import { HttpException, Injectable } from "@nestjs/common";
import { Establishment } from "./entities/establishment.entity";
import { KeyInvalidException } from "./establishments.exceptions";
import { PlaceDetailResponseDto } from "./dto/search-establishment.dto";
import { EstablishmentProvider } from "./establishment.provider";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GooglePlaceService extends EstablishmentProvider {
    private readonly GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText';
    private readonly API_KEY: string;
    private readonly fieldsMask = 'places.displayName,places.formattedAddress,places.addressComponents,places.photos,places.types,places.id'

    constructor(private configService: ConfigService) {
        super();
        this.API_KEY = this.configService.get<string>('GOOGLE_PLACE_KEY') ?? "no_key";
    }

    async fetchPlace(textQuery: string, languageCode: string = 'fr', maxResultCount: number = 5): Promise<PlaceDetailResponseDto[]> {
        if (!this.API_KEY) {
            throw new KeyInvalidException();
        }

        try {
            const response = await fetch(this.GOOGLE_PLACES_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Goog-Api-Key': this.API_KEY,
                    'X-Goog-FieldMask': this.fieldsMask
                },
                body: JSON.stringify({
                    textQuery,
                    languageCode,
                    maxResultCount
                })
            });

            if (!response.ok) {
                throw new HttpException(`Google API error: ${response.statusText}`, response.status);
            }

            const data = await response.json();
            const places = data.places

            if (!places || places.length === 0) {
                return [];
            }

            const placesData = this.transformPlacesToDto(places);
            return this.enrichWithPhotos(placesData);;
        } catch (error) {
            throw new HttpException(`Failed to fetch place data : ${error}`, 500);
        }
    }

    private transformPlacesToDto(places: any[]): PlaceDetailResponseDto[] {
        return places.map((place) => ({
            id: place.id,
            types: place.types,
            formattedAddress: place.formattedAddress,
            displayName: place.displayName.text,
            photoName: place.photos?.[0]?.name || '',
            photoUrl: ""
        }));
    }

    private async enrichWithPhotos(placesData: PlaceDetailResponseDto[]): Promise<PlaceDetailResponseDto[]> {
        const photosPromises = placesData.map(async (place) => {
            if (place.photoName) {
                try {
                    const response = await fetch(
                        `https://places.googleapis.com/v1/${place.photoName}/media?maxWidthPx=400&key=${this.API_KEY}`
                    );
                    place.photoUrl = response.url;
                } catch (error) {
                    console.warn(`Failed to fetch photo for place ${place.id}:`, error);
                }
            }
            return place;
        });

        return Promise.all(photosPromises);
    }
}