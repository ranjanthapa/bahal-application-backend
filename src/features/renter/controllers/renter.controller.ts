import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch
} from '@nestjs/common';
import { RENTER_ERROR_MESSAGE } from 'src/common/constants/error-message.constants';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import {
  UpdateRenterDTO,
  UpdateRenterSchema
} from '../schemas/renter.schema';
import { RenterService } from '../services/renter.service';

@Controller('renters')
export class RenterController {
  constructor(private readonly renterService: RenterService) {}

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
    return await this.renterService.updateById(id, updatedDto, owner);
  }
}
