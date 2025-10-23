import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum JenisKelamin {
  LAKI_LAKI = 'LAKI_LAKI',
  PEREMPUAN = 'PEREMPUAN',
}

@Entity('karyawan')
export class Karyawan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nama_lengkap: string;

  @Column()
  alamat: string;

  @Column({ type: 'date' })
  tanggal_lahir: string;

  @Column()
  divisi: string;

  @Column({ type: 'enum', enum: JenisKelamin })
  jenis_kelamin: JenisKelamin;

  @Column()
  nomor_telepon: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}