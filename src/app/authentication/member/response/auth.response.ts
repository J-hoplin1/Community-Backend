// Standard Packages
import { ApiProperty } from '@nestjs/swagger';

// Third-party Packages

// Custom Packages

export class AuthResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
