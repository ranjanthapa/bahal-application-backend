import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PROPERTY_ERROR_MESSAGE } from 'src/common/constants/error-message.constants';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import {
  RenterDTO,
  RenterSchema,
} from 'src/features/renter/schemas/renter.schema';
import {
  PropertyDTO,
  PropertySchema,
  UpdatePropertyDTO,
  UpdatePropertySchema,
} from '../schemas/property.schema';
import { PropertyService } from '../services/property.service';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
  ) {}

  @Post()
  async create(
    @ZodBody(PropertySchema) propertyDto: PropertyDTO,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.propertyService.create(propertyDto, user);
  }

  @Post(':id/renters')
  async addRenter(
    @Param('id', new UUIDValidationPipe(PROPERTY_ERROR_MESSAGE.INVALID_ID))
    id: string,
    @ZodBody(RenterSchema) renterDto: RenterDTO,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.propertyService.createRenter(id, renterDto, user)
  }

  @Get()
  async get(@CurrentUser() user: JwtPayload) {
    return await this.propertyService.getProperties(user);
  }

  @Get('/:id')
  async getById(
    @Param('id', new UUIDValidationPipe(PROPERTY_ERROR_MESSAGE.INVALID_ID))
    id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.propertyService.getPropertyById(id, user);
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(
    @Param('id', new UUIDValidationPipe(PROPERTY_ERROR_MESSAGE.INVALID_ID))
    id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.propertyService.deleteById(id, user);
  }

  @Patch('/:id')
  async update(
    @Param('id', new UUIDValidationPipe(PROPERTY_ERROR_MESSAGE.INVALID_ID))
    id: string,
    @CurrentUser() user: JwtPayload,
    @ZodBody(UpdatePropertySchema) updatePropertyDto: UpdatePropertyDTO,
  ) {
    return await this.propertyService.updateById(id, user, updatePropertyDto);
  }
}
