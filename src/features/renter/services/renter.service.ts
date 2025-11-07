import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { RENTER_ERROR_MESSAGE } from 'src/common/constants/error-message.constants';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ContactNumber } from '../entities/contact-number.entity';
import { RenterDocument } from '../entities/renter-document.entity';
import { Renter } from '../entities/renter.entity';
import { RenterDTO, UpdateRenterDTO } from '../schemas/renter.schema';
import { RenterPricingDTO } from '../schemas/renter-pricing.schema';
import Decimal from 'decimal.js';
import { RenterPricing } from '../entities/renter-pricing.entity';

@Injectable()
export class RenterService {
  constructor(
    @InjectRepository(Renter) private readonly renterRepo: Repository<Renter>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async add(renterDto: RenterDTO, owner: JwtPayload): Promise<Renter> {
    return await this.dataSource.transaction(async (manager) => {
      const { pricing, ...rest } = renterDto;

      if (renterDto.setGlobalPrice) {
        const renter = manager.create(Renter, {
          ...rest,
          owner: { id: owner.id },
        });
        return await manager.save(renter);
      } else {
        const parsedPricing = this.parseIntoDecimal(pricing!);
        const renter = manager.create(Renter, {
          ...renterDto,
          pricing: parsedPricing,
          owner: { id: owner.id },
        });
        return await manager.save(renter);
      }
    });
  }

  private parseIntoDecimal(pricing: RenterPricingDTO) {
    return Object.fromEntries(
      Object.entries(pricing).map(([key, value]) => [
        key,
        new Decimal(value).toFixed(2),
      ]),
    );
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
        relations: ['documents', 'pricing'],
      });

      if (!renter) {
        throw new NotFoundException(RENTER_ERROR_MESSAGE.NOT_FOUND);
      }

      if (renter.documents) {
        await manager.delete(RenterDocument, renter.documents.id);
      }

      if(renter.pricing){
        await manager.delete(RenterPricing, renter.pricing.id)
      }

      await manager.delete(ContactNumber, renter.contactNumbers.id);

      await manager.remove(renter);
    });
  }

  async updateById(id: string, data: UpdateRenterDTO, owner: JwtPayload) {
    return await this.dataSource.transaction(async (manager) => {
      const renter = await manager.findOne(Renter, {
        where: { id, owner: { id: owner.id } },
        relations: ['documents', 'pricing'],
      });

      if (!renter) throw new NotFoundException(RENTER_ERROR_MESSAGE.NOT_FOUND);

      if (data.contactNumbers) {
        Object.assign(renter.contactNumbers, data.contactNumbers);
      }

      await this.handlePricing(manager, data, renter);

      if (data.documents) {
        if (renter.documents) {
          Object.assign(renter.documents, data.documents);
        } else {
          renter.documents = manager.create(RenterDocument, data.documents);
        }
      }

      const { documents, contactNumbers, pricing, ...renterFields } = data;
      Object.assign(renter, renterFields, { owner: owner.id });
      return await manager.save(renter);
    });
  }

  private async handlePricing(
    manager: EntityManager,
    data: UpdateRenterDTO,
    renter: Renter,
  ) {
    if (data.pricing && data.setGlobalPrice === false) {
      if (!renter.pricing) {
        renter.pricing = manager.create(RenterPricing, data.pricing);
      } else {
        Object.assign(renter.pricing, data.pricing);
      }
    }

    if (data.setGlobalPrice === true && renter.setGlobalPrice === false) {
      console.log(renter.pricing);
      await manager.delete(RenterPricing, renter.pricing!.id);
      renter.pricing = null;
    }
  }
}
