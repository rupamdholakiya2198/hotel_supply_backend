import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepo: Repository<OrderItem>,
  ) {}

  // ==========================
  // MANAGER CREATE ORDER
  // ==========================
  async createOrder(user: any, items: any[]) {
    if (!user?.id || !user?.name || !user?.hotelName) {
      throw new Error('Invalid user data in JWT');
    }

    // ✅ COUNT previous orders of this manager
    const previousCount = await this.orderRepo.count({
      where: { userId: user.id },
    });

    const orderNumber = previousCount + 1;

    const grandTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const order = this.orderRepo.create({
      userId: user.id,
      orderNumber, // ✅ PER-MANAGER
      managerName: user.name,
      hotelName: user.hotelName,
      grandTotal,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.orderRepo.save(order);

    const orderItems = items.map((item) =>
      this.orderItemRepo.create({
        order: savedOrder,
        productId: item.productId,
        productName: item.productName,
        unit: item.unit,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      }),
    );

    await this.orderItemRepo.save(orderItems);

    return savedOrder;
  }

  // ==========================
  // MANAGER: ONLY OWN ORDERS
  // ==========================
  getOrdersByUser(userId: number) {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  // ==========================
  // ADMIN: ALL ORDERS
  // ==========================
  getAllOrders() {
    return this.orderRepo.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  updateOrderStatus(id: number, status: OrderStatus) {
    return this.orderRepo.update(id, { status });
  }
}
