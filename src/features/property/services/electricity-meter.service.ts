import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { Repository } from 'typeorm';
import { ElectricityMeter } from '../entities/electricity-meter.entity';
import {
  CreateElectricityMeterDTO,
  UpdateElectricityMeterDTO,
} from '../schemas/electricity-meter.schema';
import Decimal from 'decimal.js';
import { MeterState } from '../enums/meter-state.enum';
import { PaginationDto } from 'src/common/schemas/pagination.schema';
import {
  applyPagination,
  createPaginatedResponse,
} from 'src/common/utils/pagination.util';

@Injectable()
export class ElectricityMeterService {
  constructor(
    @InjectRepository(ElectricityMeter)
    private readonly electricityMeterRepo: Repository<ElectricityMeter>,
  ) {}

  async create(
    propertyId: string,
    data: CreateElectricityMeterDTO,
    owner: JwtPayload,
  ) {
    const electricityMeter = this.electricityMeterRepo.create({
      previousMonthUnit: Decimal(data.previousMonthUnit).toFixed(2),
      meterName: data.meterName,
      previousUnitDate: data.previousUnitDate,
      owner: { id: owner.id },
      property: { id: propertyId },
    });
    return await this.electricityMeterRepo.save(electricityMeter);
  }

  async findMeterById(id: string, owner: JwtPayload) {
    const electricityMeter = await this.electricityMeterRepo.findOne({
      where: { id, owner: { id: owner.id } },
    });
    if (!electricityMeter) {
      throw new NotFoundException('Meter not found');
    }
    return electricityMeter;
  }

  async deleteMeterById(id: string, owner: JwtPayload) {
    const meter = await this.findMeterById(id, owner);
    if (meter.state === MeterState.ACTIVE) {
      throw new UnprocessableEntityException(
        'An active meter cannot be deleted',
      );
    }
    await this.electricityMeterRepo.delete({
      id: id,
      owner: { id: owner.id },
    });
  }

  async getMetersByProperitesId(
    propertyId: string,
    paginationDTO: PaginationDto,
    owner: JwtPayload,
  ) {
    const { page, pageSize } = paginationDTO;
    const qb = this.electricityMeterRepo
      .createQueryBuilder('meter')
      .where('meter.property = :propertyId', { propertyId })
      .andWhere('meter.owner = :ownerId', { ownerId: owner.id });

    applyPagination(qb, page, pageSize);
    const [electricityMeters, total] = await qb.getManyAndCount();
    return createPaginatedResponse(electricityMeters, page, pageSize, total);
  }

  async updateById(
    id: string,
    dto: UpdateElectricityMeterDTO,
    owner: JwtPayload,
  ) {
    const meter = await this.findMeterById(id, owner);
    meter.meterName = dto.meterName;
    return await this.electricityMeterRepo.save(meter);
  }
}
