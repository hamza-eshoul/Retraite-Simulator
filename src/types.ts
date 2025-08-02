export interface JobData {
  // Universal Core
  jobId: string;
  jobName: string;
  createdAt: string;

  // People
  tutorId: string;
  tutorName: string;
  studentId: string;
  studentName: string;
  clientId: string;
  clientName: string;
  clientManager: string;

  // Academic (Arrays to handle multiple subjects/levels)
  subjects: Array<{
    subject: string;
    qualificationLevel: string;
  }>;

  // Service Information
  serviceType?: string;
  paymentInfo: string;
  origine: string;

  // Location & Delivery
  location?: string | null;

  // Additional Information
  labels?: string[];
  agent?: string | null;
  tutorInformation?: string | null;
  daysSinceCreation?: number;
}

export interface DataUploadContextType {
  jobsData: any[];
  showJobsTable: boolean;
  branchId: number | null;

  setJobsData: (data: any[]) => void;
  setShowJobsTable: (show: boolean) => void;
  setBranchId: (id: number | null) => void;
}

export interface PaginationContextType {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  paginatedData: any[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export interface Branch {
  id: number;
  name: string;
}

export type FieldDefinition = {
  machineNames: string[];
  displayNames: string[];
};

export type PaymentFilter = "all" | "True" | "False";
export type ServiceType =
  | "premium"
  | "régulier"
  | "orthopédagogue"
  | "compagnon";
export type ServiceTypeFilter = "all" | ServiceType;

export type LocationFilter = "all" | "en ligne" | "à domicile";
export type SortOrderFilter = "asc" | "desc";

export interface FilterContextType {
  daysFilter: number | null;
  sortOrder: SortOrderFilter;
  paymentFilter: PaymentFilter;
  serviceTypeFilter: ServiceTypeFilter;
  filteredData: JobData[];
  locationFilter: LocationFilter;
  setDaysFilter: (days: number | null) => void;
  setSortOrder: (order: SortOrderFilter) => void;
  setPaymentFilter: (status: PaymentFilter) => void;
  setServiceTypeFilter: (type: ServiceTypeFilter) => void;
  setLocationFilter: (location: LocationFilter) => void;
}

export interface AnalyzeJobParams {
  jobPayload: JobData | null;
  branchId: number | null;
}

export interface AIAnalysisResult {
  diagnosis: string;
  reasons: string[];
  next_steps: string[];
}