import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class BmstuLabService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async findAll(): Promise<OrderEntity[]> {
    return await this.orderRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<OrderEntity | null> {  // ДОБАВИТЬ | null
    return await this.orderRepository.findOne({ where: { id } });
  }

  async search(query: string): Promise<OrderEntity[]> {
    if (!query.trim()) {
      return await this.findAll();
    }
    
    return await this.orderRepository.find({
      where: [
        { title: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
      order: { id: 'ASC' },
    });
  }

  async create(orderData: Partial<OrderEntity>): Promise<OrderEntity> {
    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async update(id: number, orderData: Partial<OrderEntity>): Promise<OrderEntity | null> {  // ТОЖЕ ДОБАВИТЬ
    await this.orderRepository.update(id, orderData);
    return await this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
}