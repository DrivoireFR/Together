import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SearchEstablishmentDto {
    @IsString()
    @IsNotEmpty()
    search: string
}

export class PlaceDetailResponseDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsArray()
    @IsString({ each: true })
    types: string[];

    @IsString()
    @IsNotEmpty()
    formattedAddress: string;

    @IsString()
    @IsNotEmpty()
    displayName: string;

    @IsString()
    @IsOptional()
    photoUrl: string;

    @IsString()
    @IsOptional()
    photoName: string;
}