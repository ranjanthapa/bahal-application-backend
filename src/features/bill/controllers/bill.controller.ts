import { Controller, Param, Post } from '@nestjs/common';
import { BillService } from '../services/bill.service';
import { ZodBody } from 'src/common/decorators/zod-body.decorator';
import { BillDTO, BillSchema } from '../schemas/bill.schema';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { RENTER_ERROR_MESSAGE } from 'src/common/constants/error-message.constants';

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
}


// api/bill/renterId or api/renter/id/bill