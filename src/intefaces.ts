export interface Question {
  id: string;
  name: string;
  type: string;
  value: string | number | null;
}

export interface Filter {
  id: string;
  condition: "equals" | "does_not_equal" | "greater_than" | "less_than";
  value: string | number;
}

export interface ResponseData {
  submissionId: string;
  submissionTime: string;
  lastUpdatedAt?: string;
  questions: Question[];
  calculations?: any[];
  urlParameters?: any[];
  quiz?: any;
  documents?: any[];
}

export interface Submissions {
  responses: ResponseData[];
  totalResponses: number;
  pageCount: number;
}
