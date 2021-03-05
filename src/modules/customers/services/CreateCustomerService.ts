import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '../infra/typeorm/entities/Customer';
import ICustomersRepository from '../repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustumerRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    if (!name || !email) {
      throw new AppError('Name or email is invalid');
    }

    const emailAlreadyTaken = await this.customersRepository.findByEmail(email);

    if (emailAlreadyTaken) {
      throw new AppError(
        `Email already taken, if you don't remenber your password, try recoveing it`,
      );
    }

    const newCostumer = await this.customersRepository.create({
      name,
      email,
    });

    return newCostumer;
  }
}

export default CreateCustomerService;
