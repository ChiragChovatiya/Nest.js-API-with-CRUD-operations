import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'User username' })
  @IsString()
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'admin', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
