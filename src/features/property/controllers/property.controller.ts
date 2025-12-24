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
import {
  CreateElectricityMeterDTO,
  ElectricitySchema,
} from '../schemas/electricity-meter.schema';
import { ElectricityMeterService } from '../services/electricity-meter.service';
import { RenterService } from 'src/features/renter/services/renter.service';
import { ZodQuery } from 'src/common/decorators/zod-query.decorator';
import {
  PaginationDto,
  paginationSchema,
} from 'src/common/schemas/pagination.schema';
import { SkipGlobalInterceptors } from 'src/common/decorators/skip-global.decorator';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly electricityMeterService: ElectricityMeterService,
    private readonly renterService: RenterService,
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
    const property = await this.propertyService.getPropertyById(id, user);
    return await this.renterService.create(property, renterDto, user);
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

  @Post(':id/electricity-meter')
  async add(
    @Param('id', new UUIDValidationPipe(PROPERTY_ERROR_MESSAGE.INVALID_ID))
    id: string,
    @CurrentUser() user: JwtPayload,
    @ZodBody(ElectricitySchema) electricityMeterDTO: CreateElectricityMeterDTO,
  ) {
    return await this.electricityMeterService.create(
      id,
      electricityMeterDTO,
      user,
    );
  }

  @Get('/:id/electricity-meters')
  @SkipGlobalInterceptors()
  async getPropertyElectricityMeter(
    @Param('id', new UUIDValidationPipe(PROPERTY_ERROR_MESSAGE.INVALID_ID))
    propertyId: string,
    @ZodQuery(paginationSchema) paginationDTO: PaginationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.electricityMeterService.getMetersByProperitesId(
      propertyId,
      paginationDTO,
      user,
    );
  }
}
