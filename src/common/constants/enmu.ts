export enum CardType {
  TIME = 'time',
  DURATION = 'duration',
}

export enum CardStatus {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  DEPLETE = 'DEPLETE',
}

export enum ScheduleStatus {
  NO_DO = 'NO_DO',
  DOING = 'DOING',
  FINISH = 'FINISH',
  COMMENTED = 'COMMENTED',
  CANCEL = 'CANCEL',
}

export enum ProductStatus {
  LIST = 'LIST',
  UN_LIST = 'UN_LIST',
}

export enum OrderStatus {
  SUCCESS = 'SUCCESS',
  REFUND = 'REFUND',
  NOTPAY = 'NOTPAY',
  CLOSED = 'CLOSED',
  REVOKED = 'REVOKED',
  USERPAYING = 'USERPAYING',
  PAYERROR = 'PAYERROR',
}
