import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustumerRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const custumerExists = await this.customersRepository.findById(customer_id);

    if (!custumerExists) {
      throw new AppError('Error finding the user');
    }

    const existentProducts = await this.productsRepository.findAllById(
      products,
    );

    if (!existentProducts.length) {
      throw new AppError('Could not find the products');
    }

    const existentProductsIds = existentProducts.map(product => product.id);
    const checkInexistentProducts = products.filter(
      product => !existentProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(`Could not  find products ${checkInexistentProducts}`);
    }

    const findProductsWithNoQuantityAvaliable = products.filter(
      product =>
        existentProducts.filter(prod => prod.id === product.id)[0].quantity <
        product.quantity,
    );

    if (findProductsWithNoQuantityAvaliable.length) {
      throw new AppError(`Products with no suficient stock avaliable`);
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existentProducts.filter(prod => prod.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: custumerExists,
      products: serializedProducts,
    });

    const orderedProductsQuantity = products.map(product => ({
      id: product.id,
      quantity:
        existentProducts.filter(prod => prod.id === product.id)[0].quantity -
        product.quantity,
    }));

    await this.productsRepository.updateQuantity(orderedProductsQuantity);

    return order;
  }
}

export default CreateOrderService;
