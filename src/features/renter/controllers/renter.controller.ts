import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import {
  RenterDTO,
  RenterSchema,
  UpdateRenterDTO,
  UpdateRenterSchema,
} from '../schemas/renter.schema';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { RenterService } from '../services/renter.service';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { RENTER_ERROR_MESSAGE } from 'src/common/constants/error-message.constants';

@Controller('renters')
export class RenterController {
  constructor(private readonly renterService: RenterService) {}

  @Post()
  async create(
    @ZodBody(RenterSchema) renterDto: RenterDTO,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.renterService.add(renterDto, user);
  }

  @Get('/:id')
  async getById(
    @Param('id', new UUIDValidationPipe(RENTER_ERROR_MESSAGE.INVALID_ID))
    id: string,
    @CurrentUser() owner: JwtPayload,
  ) {
    return await this.renterService.getRenterById(id, owner);
  }

  @Get()
  async get(@CurrentUser() owner: JwtPayload) {
    return await this.renterService.getRenters(owner);
  }

  @Delete('/:id')
  @HttpCode(204)
  async delete(
    @Param('id', new UUIDValidationPipe(RENTER_ERROR_MESSAGE.INVALID_ID))
    id: string,
    @CurrentUser() owner: JwtPayload,
  ) {
    await this.renterService.deleteById(id, owner);
  }

  @Patch('/:id')
  async update(
    @Param('id', new UUIDValidationPipe(RENTER_ERROR_MESSAGE.INVALID_ID))
    id: string,
    @ZodBody(UpdateRenterSchema) updatedDto: UpdateRenterDTO,
    @CurrentUser() owner: JwtPayload,
  ) {
    console.log("validation passed", updatedDto);
    return await this.renterService.updateById(id, updatedDto, owner);
  }
}
