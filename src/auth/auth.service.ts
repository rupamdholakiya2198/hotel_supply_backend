import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ✅ IMPORTANT: FULL PAYLOAD
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      hotelName: user.hotelName,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: any) {
    data.password = await bcrypt.hash(data.password, 10);
    return this.usersService.create(data);
  }
}
