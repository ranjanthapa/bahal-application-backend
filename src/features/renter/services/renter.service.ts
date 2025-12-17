import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import { RENTER_ERROR_MESSAGE } from 'src/common/constants/error-message.constants';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { ElectricityMeter } from 'src/features/property/entities/electricity-meter.entity';
import { Property } from 'src/features/property/entities/property.entity';
import { MeterState } from 'src/features/property/enums/meter-state.enum';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ContactNumber } from '../entities/contact-number.entity';
import { RenterDocument } from '../entities/renter-document.entity';
import { RenterPricing } from '../entities/renter-pricing.entity';
import { Renter } from '../entities/renter.entity';
import { RenterPricingDTO } from '../schemas/renter-pricing.schema';
import { RenterDTO, UpdateRenterDTO } from '../schemas/renter.schema';

@Injectable()
export class RenterService {
  constructor(
    @InjectRepository(Renter) private readonly renterRepo: Repository<Renter>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async create(
    property: Property,
    renterDto: RenterDTO,
    owner: JwtPayload,
  ): Promise<Renter> {
    return await this.dataSource.transaction(async (manager) => {
      const { pricing, setGlobalPrice, electricityMeterId, ...rest } =
        renterDto;
      const electricityMeter = await manager.findOne(ElectricityMeter, {
        where: { id: electricityMeterId },
      });

      if (!electricityMeter) {
        throw new NotFoundException('Electricity meter not found');
      }

      if (electricityMeter.state === MeterState.ACTIVE) {
        throw new ConflictException('Electricity meter is already in use');
      }

      const renter = manager.create(Renter, {
        ...rest,
        setGlobalPrice,
        electricityMeter: { id: electricityMeterId },
        owner: { id: owner.id },
        property: { id: property.id },
      });

      if (!setGlobalPrice && pricing) {
        const parsedPricing = this.parseIntoDecimal(pricing);
        renter.pricing = manager.create(RenterPricing, parsedPricing);
      }

      const savedRenter = await this.renterRepo.save(renter);
      electricityMeter.state = MeterState.ACTIVE;

      await manager.save(electricityMeter);

      return savedRenter;
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

  async findRenterByIdWithFields(
    id: string,
    owner: JwtPayload,
    fields: (keyof Renter)[],
  ): Promise<Renter> {
    const renter = await this.renterRepo
      .createQueryBuilder('renter')
      .select(['renter.id', ...fields.map((field) => `renter.${field}`)])
      .leftJoinAndSelect('renter.pricing', 'pricing')
      .where('renter.id=:id AND renter.owner.id=:ownerId', {
        id,
        ownerId: owner.id,
      })
      .getOne();

    if (!renter) throw new NotFoundException(RENTER_ERROR_MESSAGE.NOT_FOUND);
    return renter;
  }

  async findRenterPricing(renterId: string, ownerId: string) {
    const renter = await this.renterRepo
      .createQueryBuilder('renter')
      .select(['renter.setGlobalPrice'])
      .where('renter.id = :renterId', { renterId })
      .andWhere('renter.owner = :ownerId', { ownerId })
      .getRawOne();
    if (!renter) {
      throw new NotFoundException('Renter not found');
    }

    const isGlobal = renter.renter_set_global_price;
    if (isGlobal) {
      return await this.renterRepo
        .createQueryBuilder('renter')
        .leftJoin('renter.property', 'property')
        .select([
          'renter.numberOfRooms as "numberOfRoom"',
          'property.rentPerRoom AS "rentPerRoom"',
          'property.waterRate AS "waterRate"',
          'property.electricityRate AS "electricityChargePerUnit"',
        ])
        .where('renter.id =:renterId', { renterId })
        .andWhere('renter.owner =:ownerId', { ownerId })
        .getRawOne();
    }
    return await this.renterRepo
      .createQueryBuilder('renter')
      .leftJoin('renter.pricing', 'pricing')
      .select([
        'renter.numberOfRooms as "numberOfRoom"',
        'pricing.rentPerRoom AS "rentPerRoom"',
        'pricing.waterRate AS "waterRate"',
        'pricing.electricityRate AS "electricityChargePerUnit"',
      ])
      .where('renter.id =:renterId', { renterId })
      .andWhere('renter.owner = :ownerId', { ownerId })
      .getRawOne();
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

      if (renter.pricing) {
        await manager.delete(RenterPricing, renter.pricing.id);
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
      await manager.delete(RenterPricing, renter.pricing!.id);
      renter.pricing = null;
    }
  }
}
