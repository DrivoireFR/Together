import { HttpException } from "@nestjs/common";
import { PlaceDetailResponseDto } from "./dto/search-establishment.dto";

export abstract class EstablishmentProvider {
    abstract fetchPlace(
        textQuery: string,
        languageCode?: string,
        maxResultCount?: number
    ): Promise<PlaceDetailResponseDto[]>;
}