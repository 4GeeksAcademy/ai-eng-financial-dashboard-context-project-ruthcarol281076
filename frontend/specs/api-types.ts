/** Supported operation values returned by the API. */
export type OperationType = "income" | "outcome";

/** Supported business lines returned by the API. */
export type BusinessType = "B2B" | "B2C";

/** Supported movement categories returned by the API. */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";
  
/** A financial movement returned by GET /api/metrics. */
export interface FinancialMovement {
  /** Movement date formatted as YYYY-MM-DD. */
  create_date: string;
  /** Monetary amount returned by the API. */
  amount: number;
  /** Whether the movement is income or outcome. */
  operation_type: OperationType;
  /** Financial category assigned to the movement. */
  category: Category;
  /** Business line assigned to the movement. */
  business_type: BusinessType;
}

/** Supported aggregation periods for summaries and alerts. */
export type GroupBy = "day" | "week" | "month";

/** Date and filter facets exposed by GET /api/metrics/facets. */
export interface FacetsResponse {
  /** Operation values currently present in the dataset. */
  operation_types: OperationType[];
  /** Business lines currently present in the dataset. */
  business_types: BusinessType[];
  /** Categories currently present in the dataset. */
  categories: Category[];
  /** Earliest available movement date, formatted as YYYY-MM-DD. */
  min_date: string;
  /** Latest available movement date, formatted as YYYY-MM-DD. */
  max_date: string;
}

/** A single anomaly returned by GET /api/metrics/alerts. */
export interface MetricsAlert {
  /** Aggregation period, for example 2025-12 when group_by=month. */
  period: string;
  /** Outcome amount recorded for the period. */
  outcome_total: number;
  /** Average outcome baseline calculated from preceding periods. */
  baseline_average: number;
  /** Relative increase as a ratio, not a percentage; 0.3 means 30%. */
  increase_ratio: number;
}

/** One category row returned by GET /api/metrics/categories/top. */
export interface TopCategoryItem {
  /** Category identifier. */
  category: Category;
  /** Operation used for ranking; income for the comparison view. */
  operation_type: OperationType;
  /** Total amount for this category after filters. */
  total_amount: number;
}

/** One monthly or daily summary item returned by GET /api/metrics/summary. */
export interface MetricsSummaryItem {
  /** Aggregation period in the format selected by group_by. */
  period: string;
  /** Income total for the period. */
  income: number;
  /** Outcome total for the period. */
  outcome: number;
  /** Income minus outcome for the period. */
  net: number;
}

/**
 * Derived data for one business section in the B2B versus B2C view.
 * This is a frontend view model, not a direct API response.
 */
export interface BusinessComparisonGroup {
  /** Business line represented by the section. */
  business_type: BusinessType;
  /** Up to five income categories returned by the top-categories endpoint. */
  categories: TopCategoryItem[];
  /** Full income total used as the percentage denominator. */
  total_income: number;
}

/**
 * Derived data assembled by the comparison page from API responses.
 * The API exposes category rows and summaries separately.
 */
export interface BusinessComparisonResponse {
  /** B2B category ranking and total. */
  b2b: BusinessComparisonGroup;
  /** B2C category ranking and total. */
  b2c: BusinessComparisonGroup;
}
