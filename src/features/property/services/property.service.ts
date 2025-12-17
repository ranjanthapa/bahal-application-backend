import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { PropertyDTO, UpdatePropertyDTO } from '../schemas/property.schema';
import { PROPERTY_ERROR_MESSAGE } from 'src/common/constants/error-message.constants';
import { RenterDTO } from 'src/features/renter/schemas/renter.schema';
import { RenterService } from 'src/features/renter/services/renter.service';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propetyRepo: Repository<Property>,
    private readonly renterService: RenterService,
  ) {}

  async create(propertyDto: PropertyDTO, user: JwtPayload) {
    const property = this.propetyRepo.create({
      ...propertyDto,
      user: { id: user.id },
    });
    return await this.propetyRepo.save(property);
  }

  async addRenter(
    propertyId: string,
    renterDto: RenterDTO,
    owner: JwtPayload,
  ) {
    const property = await this.getPropertyById(propertyId, owner);
    return await this.renterService.create(property, renterDto, owner);
  }

  async getProperties(user: JwtPayload): Promise<Property[]> {
    const property = await this.propetyRepo.find({
      where: { user: { id: user.id } },
    });
    return property;
  }

  async getPropertyById(id: string, user: JwtPayload): Promise<Property> {
    const property = await this.propetyRepo.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!property) {
      throw new NotFoundException(PROPERTY_ERROR_MESSAGE.NOT_FOUND);
    }
    return property;
  }

  async deleteById(id: string, user: JwtPayload): Promise<void> {
    const result = await this.propetyRepo.delete({
      id,
      user: { id: user.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException(PROPERTY_ERROR_MESSAGE.NOT_FOUND);
    }
  }

  async updateById(id: string, user: JwtPayload, data: UpdatePropertyDTO) {
    const result = await this.propetyRepo.update(
      { id, user: { id: user.id } },
      data,
    );
    if (result.affected === 0) {
      throw new NotFoundException(PROPERTY_ERROR_MESSAGE.NOT_FOUND);
    }
    return await this.getPropertyById(id, user);
  }
}
