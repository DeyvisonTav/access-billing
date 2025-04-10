export class LotMapper {
  static formatUnitToLotName(unit: string): string {
    return unit.padStart(4, '0');
  }

  static formatLotNameToUnit(lotName: string): string {
    return lotName.replace(/^0+/, '');
  }
} 