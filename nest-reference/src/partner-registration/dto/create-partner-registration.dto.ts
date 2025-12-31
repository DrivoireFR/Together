import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import { PlaceDetailResponseDto } from "src/establishments/dto/search-establishment.dto";

export class CreatePartnerRegistrationDto {
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsObject()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PlaceDetailResponseDto)
    establishment: PlaceDetailResponseDto;
}
