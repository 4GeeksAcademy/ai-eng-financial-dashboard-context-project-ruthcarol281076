import type { BusinessType, GroupBy, OperationType } from "./api-types";

/** Optional inclusive date bounds sent to API endpoints as YYYY-MM-DD. */
export interface DateRangeFilter {
  /** Inclusive lower bound; omit the query parameter when empty. */
  start_date?: string;
  /** Inclusive upper bound; omit the query parameter when empty. */
  end_date?: string;
}

/** Query parameters for GET /api/metrics/alerts. */
export interface AlertsParam extends DateRangeFilter {
  /** Alert ratio; the UI accepts 0.01 through 1.0, defaulting to 0.3. */
  threshold?: number;
  /** Aggregation granularity supported by the API. */
  group_by?: GroupBy;
  /** Optional business line filter supported by the API. */
  business_type?: BusinessType;
}

/** Query parameters for GET /api/metrics/categories/top. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Operation to rank; the comparison view fixes this to income. */
  operation_type?: OperationType;
  /** Number of rows requested; API accepts integers from 1 through 20. */
  limit?: number;
  /** Business line to rank; required by the comparison view as B2B or B2C. */
  business_type?: BusinessType;
}
