export interface RegularizationResult {
  apartmentId: string;
  tenantId: string;
  tenantName: string;
  amount: number;
  period: {
    startDate: Date;
    endDate: Date | null;
  };
} 