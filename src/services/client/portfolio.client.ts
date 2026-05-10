import { apiGet } from "@/lib/api-client";
import type { PortfolioSummaryData } from "@/types/portfolio";

export function getPortfolio(): Promise<PortfolioSummaryData> {
  return apiGet<PortfolioSummaryData>("/api/portfolio");
}
