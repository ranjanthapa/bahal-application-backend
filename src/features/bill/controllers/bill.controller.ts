import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RENTER_ERROR_MESSAGE } from 'src/common/constants/error-message.constants';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SkipGlobalInterceptors } from 'src/common/decorators/skip-global.decorator';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import { ZodQuery } from 'src/common/decorators/zod-query.decorator';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { BillFilterDTO, billFilterSchema } from '../schemas/bill.filter.schema';
import {
  BillDTO,
  BillSchema,
  UpdateBillDto,
  UpdateBillSchema,
} from '../schemas/bill.schema';
import { BillService } from '../services/bill.service';
import {
  BillPreviewDTO,
  BillPreviewSchema,
} from '../schemas/preview.bill.schema';

@Controller()
export class BillController {
  constructor(private readonly billService: BillService) {}

  @Post('renters/:id/bills/preview')
  async previewBill(
    @Param('id', new UUIDValidationPipe(RENTER_ERROR_MESSAGE.INVALID_ID))
    renterId: string,
    @ZodBody(BillSchema) billDTO: BillDTO,
    @CurrentUser() owner: JwtPayload,
  ) {
    return await this.billService.preview(renterId, billDTO, owner);
  }

  @Post('/bills')
  async add(@ZodBody(BillPreviewSchema) previewDto: BillPreviewDTO) {
    return await this.billService.create(previewDto);
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
