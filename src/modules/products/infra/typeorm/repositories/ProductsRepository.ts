import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const createProduct = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(createProduct);

    return createProduct;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findConstumer = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return findConstumer;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsId = products.map(product => product.id);

    const fundProducts = await this.ormRepository.find({
      where: {
        id: In(productsId),
      },
    });

    return fundProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    // Terminar o método

    return this.ormRepository.save(products);
  }
}

export default ProductsRepository;
