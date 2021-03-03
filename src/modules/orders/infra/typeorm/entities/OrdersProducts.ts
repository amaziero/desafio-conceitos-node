// import {
//   Entity,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   JoinColumn,
//   PrimaryGeneratedColumn,
//   ManyToOne,
// } from 'typeorm';

// import Order from '@modules/orders/infra/typeorm/entities/Order';
// import Product from '@modules/products/infra/typeorm/entities/Product';

// @Entity('orders_products')
// class OrdersProducts {
//   @PrimaryGeneratedColumn()
//   id: string;

//   @Column()
//   order: Order;

//   @Column()
//   product: Product;

//   product_id: string;

//   order_id: string;

//   price: number;

//   quantity: number;

//   created_at: Date;

//   updated_at: Date;
// }

// export default OrdersProducts;
