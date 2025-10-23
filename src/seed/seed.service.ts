import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Role } from '../users/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private users: UsersService) {}

  async onModuleInit() {
    const defaults = [
      {
        username: 'admin',
        email: 'admin@example.com',
        nama: 'Admin',
        password: 'admin123',
        role: Role.ADMIN,
      },
      {
        username: 'hrd',
        email: 'hrd@example.com',
        nama: 'HRD',
        password: 'hrd12345',
        role: Role.HRD,
      },
      {
        username: 'pegawai',
        email: 'pegawai@example.com',
        nama: 'Pegawai',
        password: 'pegawai123',
        role: Role.PEGAWAI,
      },
    ];

    for (const user of defaults) {
      const exists = await this.users.findByUsername(user.username);
      if (!exists) {
        await this.users.create(user);
      }
    }
  }
}