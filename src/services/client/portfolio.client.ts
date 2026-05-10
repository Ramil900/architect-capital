import { apiGet, apiMutate, apiPut, apiDelete } from "@/lib/api-client";
import type { PortfolioSummaryData } from "@/types/portfolio";

export interface AddPositionInput {
  ticker:       string;
  quantity:     number;
  averagePrice: number;
  currentPrice: number;
}

export interface UpdatePositionInput {
  quantity:     number;
  averagePrice: number;
  currentPrice: number;
}

export function getPortfolio(): Promise<PortfolioSummaryData> {
  return apiGet<PortfolioSummaryData>("/api/portfolio");
}

export function addPosition(input: AddPositionInput): Promise<void> {
  return apiMutate("POST", "/api/portfolio", input);
}

export function updatePosition(positionId: string, input: UpdatePositionInput): Promise<void> {
  return apiPut("/api/portfolio", { positionId, ...input });
}

export function deletePosition(positionId: string): Promise<void> {
  return apiDelete("/api/portfolio", { positionId });
}
