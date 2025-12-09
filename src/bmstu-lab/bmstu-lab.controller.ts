import { Controller, Get, Post, Param, Render, Body, Query } from '@nestjs/common';
import { BmstuLabService } from './bmstu-lab.service';

@Controller('orders')
export class BmstuLabController {
  constructor(private readonly bmstuLabService: BmstuLabService) {}
  
  @Get()
  @Render('main')
  async getOrders(@Query('query') query?: string) {
    const orders = query 
      ? await this.bmstuLabService.search(query)
      : await this.bmstuLabService.findAll();
    
    return {
      title: 'Список заказов',
      name: 'BMSTU',
      data: {
        current_date: new Date().toLocaleDateString(),
        orders: orders || [],
        query: query || '',
      },
    };
  }

  @Post()
  @Render('main')
  async searchOrders(@Body() body: { query?: string }) {
    const query = body?.query || '';
    const orders = await this.bmstuLabService.search(query);
    
    return {
      title: 'Список заказов',
      name: 'BMSTU',
      data: {
        current_date: new Date().toLocaleDateString(),
        orders: orders || [],
        query: query,
      },
    };
  }

  @Get('order/:id')
  @Render('order')
  async getOrder(@Param('id') id: string) {
    const order = await this.bmstuLabService.findOne(Number(id));
    return {
      title: order ? order.title : 'Не найдено',
      data: {
        id,
        current_date: new Date().toLocaleDateString(),
        order: order || { title: 'Не найден', id: 0 },
      },
    };
  }
}