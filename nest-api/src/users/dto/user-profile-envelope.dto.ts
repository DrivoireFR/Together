import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../auth/dto/verify-otp.dto';

/** GET /users/profile and PUT /users/profile response body */
export class UserProfileEnvelopeDto {
  @ApiProperty({ example: 'Profil récupéré avec succès' })
  message: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
