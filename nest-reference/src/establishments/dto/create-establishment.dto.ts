import { EstablishmentType, OfferType } from "../entities/establishment.entity";
import { PlaceDetailResponseDto } from "./search-establishment.dto";

export class CreateEstablishmentDto {
    id: string;
    name: string;
    type: EstablishmentType;
    address: string;
    places_data?: PlaceDetailResponseDto;
}
