// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
// } from 'typeorm';

// @Entity('products')
// export class Product {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ unique: true })
//   name: string;


//   @Column()
//   category: string; // Vegetables, Pulses, Spices

//   @Column('decimal', { precision: 10, scale: 2 })
//   price: number;

//   @Column()
//   unit: string; // kg, packet, litre

//   @Column({ default: true })
//   isActive: boolean;

//   @CreateDateColumn()
//   createdAt: Date;

//   @Column({ nullable: true })
//   imageUrl?: string;
// }


import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'kg' })
  unit: string;

  @Column()
  category: string; // Vegetables | Pulses | Grains | Others

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
