import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { RenterService } from 'src/features/renter/services/renter.service';
import { DataSource, Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { BillDTO, UpdateBillDto } from '../schemas/bill.schema';
import Decimal from 'decimal.js';
import { BillStatus } from '../enums/bill-status.enum';
import { BILL_ERROR_MESSAGE } from 'src/common/constants/error-message.constants';
import { BillFilterDTO } from '../schemas/bill.filter.schema';
import {
  applyPagination,
  createPaginatedResponse,
} from 'src/common/utils/pagination.util';
import { BillPreviewDTO } from '../schemas/preview.bill.schema';
import { ElectricityMeter } from 'src/features/property/entities/electricity-meter.entity';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill) private readonly billRepo: Repository<Bill>,
    private readonly renterService: RenterService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async preview(renterId: string, data: BillDTO, owner: JwtPayload) {
    const renterBillingDetail =
      await this.renterService.findRenterBillingDetails(renterId, owner.id);

    const totalRoomRent = new Decimal(renterBillingDetail.numberOfRoom).mul(
      renterBillingDetail.rentPerRoom,
    );

    const previousMonthUnit = new Decimal(
      renterBillingDetail.previousMonthUnit,
    );
    
    const electricityConsumedUnit = new Decimal(data.electricityUnits).minus(
      previousMonthUnit,
    );

    const totalElectricityCharge = new Decimal(
      renterBillingDetail.electricityChargePerUnit,
    ).mul(electricityConsumedUnit);
    const waterAmount = new Decimal(renterBillingDetail.waterRate);
    let totalOtherCharge = new Decimal(0);

    if (data.otherCharges) {
      totalOtherCharge = data.otherCharges.reduce((acc, value) => {
        return acc.plus(new Decimal(value!.amount));
      }, new Decimal(0));
    }

    const totalAmount = totalRoomRent
      .plus(totalElectricityCharge)
      .plus(waterAmount)
      .plus(totalOtherCharge);

    return {
      totalAmount: totalAmount.toFixed(2),
      totalRoomRent: totalRoomRent.toFixed(2),
      electricityChargePerUnit: renterBillingDetail.electricityChargePerUnit,
      totalElectricityCharge: totalElectricityCharge.toFixed(2),
      electricityUnits: data.electricityUnits.toFixed(2),
      electricityConsumed: electricityConsumedUnit.toFixed(2),
      billingDate: data.billingDate,
      waterCharge: waterAmount.toFixed(2),
      note: data.note ?? null,
      status: data.status,
      otherCharges: data.otherCharges ?? null,
      renter: renterId,
      owner: owner.id,
      electricitymeterId: renterBillingDetail.meterId,
    };
  }

  async create(previewDTO: BillPreviewDTO) {
    return this.dataSource.transaction(async (manager) => {
      const { renter, owner, electricitymeterId, ...otherFields } = previewDTO;
      const bill = manager.create(Bill, {
        ...otherFields,
        renter: { id: renter },
        owner: { id: owner },
      });
      await manager.save(bill);

      if (bill.status === BillStatus.FINALIZED) {
        const electricityMeter = await manager.findOne(ElectricityMeter, {
          where: { id: electricitymeterId },
        });
        if (!electricityMeter) {
          throw new NotFoundException('Electricity meter not found');
        }

        electricityMeter.previousMonthUnit = otherFields.electricityUnits;
        electricityMeter.previousUnitDate = otherFields.billingDate;

        await manager.save(electricityMeter);
      }

      return bill;
    });
  }

  async update(id: string, data: UpdateBillDto) {
    const bill = await this.getBillById(id);
    // if (bill.status === BillStatus.PAID) {
    //   throw new BadRequestException(BILL_ERROR_MESSAGE.UPDATE_PAID_BILL);
    // }

    if (bill.status === BillStatus.CANCEL) {
      throw new BadRequestException(BILL_ERROR_MESSAGE.UPDATE_CANCELLED_BILL);
    }

    if (bill.status === BillStatus.FINALIZED) {
      if (data.status === BillStatus.CANCEL) {
        bill.status = BillStatus.CANCEL;
        return await this.billRepo.save(bill);
      }
      throw new BadRequestException(BILL_ERROR_MESSAGE.UPDATE_FINALIZED_BILL);
    }

    if (bill.status === BillStatus.DRAFT) {
      Object.assign(bill, data);
      return await this.billRepo.save(bill);
    }
  }

  async getBillById(id: string): Promise<Bill> {
    const bill = await this.billRepo.findOne({ where: { id } });
    if (!bill) {
      throw new NotFoundException(BILL_ERROR_MESSAGE.NOT_FOUND);
    }
    return bill;
  }

  async getRenterBills(
    filterDTO: BillFilterDTO,
    renterId: string,
    owner: JwtPayload,
  ) {
    const {
      status,
      billingDateFrom,
      billingDateTo,
      page = 1,
      pageSize = 10,
    } = filterDTO;

    const qb = this.billRepo.createQueryBuilder('bill');
    const alias = qb.alias;

    qb.where(`${alias}.renter = :renterId`, { renterId });

    qb.andWhere(`${alias}.owner = :ownerId`, { ownerId: owner.id });

    if (status) {
      qb.andWhere(`${alias}.status = :status`, { status });
    }

    if (billingDateFrom) {
      qb.andWhere(`${alias}.billingDate >= :billingDateFrom`, {
        billingDateFrom,
      });
    }

    if (billingDateTo) {
      qb.andWhere(`${alias}.billingDate <= :billingDateTo`, {
        billingDateTo,
      });
    }

    qb.orderBy(`${alias}.billingDate`, 'DESC');
    applyPagination(qb, page, pageSize);

    const [bills, total] = await qb.getManyAndCount();
    return createPaginatedResponse(bills, page, pageSize, total);
  }
}
