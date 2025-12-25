import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common';
import { ElectricityMeterService } from '../services/electricity-meter.service';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import {
  UpdateElectricityMeterDTO,
  UpdateElectricityMeterSchema,
} from '../schemas/electricity-meter.schema';

@Controller('electicity-meter')
export class ElectricityMeterController {
  constructor(
    private readonly electricityMeterService: ElectricityMeterService,
  ) {}

  @Delete('/:id')
  @HttpCode(204)
  async deleteMeter(
    @Param('id', UUIDValidationPipe)
    id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.electricityMeterService.deleteMeterById(id, user);
  }

  @Patch('/:id')
  async updateMeter(
    @Param('id', UUIDValidationPipe)
    id: string,
    @ZodBody(UpdateElectricityMeterSchema)
    electricityMeterDTO: UpdateElectricityMeterDTO,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.electricityMeterService.updateById(
      id,
      electricityMeterDTO,
      user,
    );
  }

  @Get('/:id')
  async getMeter(
    @Param('id', UUIDValidationPipe)
    id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.electricityMeterService.findMeterById(id, user);
  }
}
