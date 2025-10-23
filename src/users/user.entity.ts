import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  PEGAWAI = 'PEGAWAI',
  HRD = 'HRD',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nama: string;

  @Column({ select: false }) // Password tidak akan pernah terambil kecuali diminta secara eksplisit
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.PEGAWAI })
  role: Role;

  @Column({ unique: true, nullable: true }) // Pastikan username juga unik
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}