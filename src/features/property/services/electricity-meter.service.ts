import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { Repository } from 'typeorm';
import { ElectricityMeter } from '../entities/electricity-meter.entity';
import { CreateElectricityMeterDTO } from '../schemas/electricity-meter.schema';

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
      ...data,
      owner: { id: owner.id },
      property: { id: propertyId },
    });
    return await this.electricityMeterRepo.save(electricityMeter);
  }

  async findMeterById(id: string) {
    const electricityMeter = await this.electricityMeterRepo.findOne({
      where: { id: id },
    });
    if (!electricityMeter) {
      throw new NotFoundException('Meter not found');
    }
    return electricityMeter;
  }
}
