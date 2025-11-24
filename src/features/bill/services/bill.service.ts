import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/common/types/jwt-payload.type';
import { RenterService } from 'src/features/renter/services/renter.service';
import { Repository } from 'typeorm';
import { Bill } from '../entities/bill.entity';
import { BillDTO } from '../schemas/bill.schema';
import Decimal from 'decimal.js';

@Injectable()
export class BillService {
  constructor(
    @InjectRepository(Bill) private readonly billRepo: Repository<Bill>,
    private readonly renterService: RenterService,
  ) {}
  async create(renterId: string, data: BillDTO, owner: JwtPayload) {
    const price = await this.renterService.findRenterPricing(
      renterId,
      owner.id,
    );
    const totalRoomRent = new Decimal(price.numberOfRoom).mul(
      price.rentPerRoom,
    );

    const totalElectricityAmount = new Decimal(price.electricityRate).mul(
      data.electricityUnit,
    );
    const waterAmount = new Decimal(price.waterRate);
    let totalOtherCharge = new Decimal(0);

    if (data.otherCharges) {
      totalOtherCharge = data.otherCharges.reduce((acc, value) => {
        return acc.plus(new Decimal(value!.amount));
      }, new Decimal(0));
    }

    const totalAmount = totalRoomRent
      .plus(totalElectricityAmount)
      .plus(waterAmount)
      .plus(totalOtherCharge);

    const bill = this.billRepo.create({
      totalAmount: totalAmount.toString(),
      totalRoomRent: totalRoomRent.toString(),
      totalElectricityAmount: totalElectricityAmount.toString(),
      electricityUnit: data.electricityUnit.toString(),
      billingDate: data.billingMonth,
      note: data.note ?? null,
      status: data.status,
      otherCharges: data.otherCharges ?? null,
      renter: { id: renterId },
    });

    return await this.billRepo.save(bill);
  }
}
