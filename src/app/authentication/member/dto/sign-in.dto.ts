import { IsHongikEmailDomain } from '@app/authentication/decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MemberSignInDto {
  @ApiProperty({ example: 'member@mail.hongik.ac.kr' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
