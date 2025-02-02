export interface ExcelRow {
  id: string;
  name: string;
  amount: number;
  date: string;
  verified: boolean;
}


export interface ValidationError {
  sheet: string;
  row: number;
  message: string;
}

export interface SheetData {
  name: string;
  data: ExcelRow[];
  errors: ValidationError[];
}