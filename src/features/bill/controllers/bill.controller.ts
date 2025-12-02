import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BillService } from '../services/bill.service';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import {
  BillDTO,
  BillSchema,
  UpdateBillDto,
  UpdateBillSchema,
} from '../schemas/bill.schema';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { RENTER_ERROR_MESSAGE } from 'src/common/constants/error-message.constants';
import { ZodQuery } from 'src/common/decorators/zod-query.decorator';
import { billFilterSchema, BillFilterDTO } from '../schemas/bill.filter.schema';
import { SkipInterceptor } from 'src/common/interceptors/skip-global.interceptor';
import { SkipGlobalInterceptors } from 'src/common/decorators/skip-global.decorator';

@Controller()
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post('renters/:id/bills')
  async add(
    @Param('id', new UUIDValidationPipe(RENTER_ERROR_MESSAGE.INVALID_ID))
    renterId: string,
    @ZodBody(BillSchema) billDTO: BillDTO,
    @CurrentUser() owner: JwtPayload,
  ) {
    return await this.billService.create(renterId, billDTO, owner);
  }

  @Patch('bills/:id')
  async update(
    @Param('id', UUIDValidationPipe)
    id: string,
    @ZodBody(UpdateBillSchema) updateBillDTO: UpdateBillDto,
  ) {
    return await this.billService.update(id, updateBillDTO);
  }

  @Get('bills/:id')
  async get(
    @Param('id', UUIDValidationPipe)
    id: string,
  ) {
    return await this.billService.getBillById(id);
  }
  
  @SkipGlobalInterceptors()
  @Get('renters/:id/bills')
  async getAllRenterBill(
    @ZodQuery(billFilterSchema) filterDTO: BillFilterDTO,
    @Param('id', UUIDValidationPipe)
    renterId: string,
    @CurrentUser() owner: JwtPayload,
  ) {
    return await this.billService.getRenterBills(filterDTO, renterId, owner);
  }
}

//api/bill/billid or api/renter/id/bill/id
// api/bill/renterId or api/renter/id/bill

// api/renters/:id/bills/:id
