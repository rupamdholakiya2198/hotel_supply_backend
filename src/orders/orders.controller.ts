import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderStatus } from './order.entity';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ✅ MANAGER: create order
  @Post()
  createOrder(@Req() req, @Body('items') items: any[]) {
    return this.ordersService.createOrder(req.user, items);
  }

  // ✅ MANAGER: view own orders
  @Get('my')
  getMyOrders(@Req() req) {
    return this.ordersService.getOrdersByUser(req.user.id);
  }

  // ✅ ADMIN: view all orders
  @Get()
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // ✅ ADMIN: update order status
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ) {
    if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
      throw new BadRequestException('Invalid order status');
    }

    return this.ordersService.updateOrderStatus(
      Number(id),
      status as OrderStatus,
    );
  }
}
