import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  RENTER_ERROR_MESSAGE
} from 'src/common/constants/error-message.constants';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { DataSource, Repository } from 'typeorm';
import { ContactNumber } from '../entities/contact-number.entity';
import { RenterDocument } from '../entities/renter-document.entity';
import { Renter } from '../entities/renter.entity';
import { RenterDTO, UpdateRenterDTO } from '../schemas/renter.schema';

@Injectable()
export class RenterService {
  constructor(
    @InjectRepository(Renter) private readonly renterRepo: Repository<Renter>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async add(renterDto: RenterDTO, owner: JwtPayload): Promise<Renter> {
    console.log({ renterDto });
    const renter = this.renterRepo.create({
      ...renterDto,
      owner: { id: owner.id },
    });
    return await this.renterRepo.save(renter);
  }

  async getRenterById(id: string, owner: JwtPayload): Promise<Renter> {
    const renter = await this.renterRepo.findOne({
      where: { id: id, owner: { id: owner.id } },
      relations: ['documents'],
    });
    if (!renter) {
      throw new NotFoundException(RENTER_ERROR_MESSAGE.NOT_FOUND);
    }
    return renter;
  }

  async getRenters(owner: JwtPayload): Promise<Renter[] | []> {
    const renters = await this.renterRepo.find({
      where: { owner: { id: owner.id } },
    });
    return renters;
  }

  async deleteById(id: string, owner: JwtPayload) {
    return await this.dataSource.transaction(async (manager) => {
      const renter = await manager.findOne(Renter, {
        where: { id },
        relations: ['documents'],
      });

      if (!renter) {
        throw new NotFoundException(RENTER_ERROR_MESSAGE.NOT_FOUND);
      }

      if (renter.documents) {
        await manager.delete(RenterDocument, renter.documents.id);
      }

      await manager.delete(ContactNumber, renter.contactNumbers.id);

      await manager.remove(renter);
    });
  }

  async updateById(id: string, data: UpdateRenterDTO, owner: JwtPayload) {
    return await this.dataSource.transaction(async (manager) => {
      const renter = await manager.findOne(Renter, {
        where: { id, owner: { id: owner.id } },
        relations: ['documents'],
      });

      if (!renter) throw new NotFoundException(RENTER_ERROR_MESSAGE.NOT_FOUND);

      if (data.contactNumbers) {
        Object.assign(renter.contactNumbers, data.contactNumbers);
      }

      if (data.documents) {
        if (renter.documents) {
          Object.assign(renter.documents, data.documents);
        } else {
          renter.documents = manager.create(RenterDocument, data.documents);
        }
      }

      const { documents, contactNumbers, ...renterFields } = data;
      Object.assign(renter, renterFields);

      return await manager.save(renter);
    });
  }
}
