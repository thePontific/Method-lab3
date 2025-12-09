import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BmstuLabController } from './bmstu-lab.controller';
import { BmstuLabService } from './bmstu-lab.service';
import { OrderEntity } from '../entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
  ],
  controllers: [BmstuLabController],
  providers: [BmstuLabService],
})
export class BmstuLabModule {}