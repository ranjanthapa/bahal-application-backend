import { ObjectLiteral, SelectQueryBuilder } from "typeorm";

export function createPaginatedResponse<T>(
  data: T[],
  currentPage: number,
  pageSize: number,
  totalItems: number,
) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasMore = currentPage < totalPages;

  return {
    data,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasMore,
  };
}



export const applyPagination = <T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  page: number = 1,
  pageSize: number = 10,
): void => {
  qb.skip((page - 1) * pageSize).take(pageSize);
};
