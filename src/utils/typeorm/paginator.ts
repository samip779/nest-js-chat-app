export interface IPaginateResponse {
  nextPage: number | null;
  prevPage: number | null;
  currentPage: number;
  lastPage: number;
  totalCount: number;
  itemsPerpage: number;
  result: any[];
}

export const paginatedResponse = (
  data: any,
  page: number,
  limit: number,
): IPaginateResponse => {
  const [result, total] = data;
  const lastPage = Math.ceil(total / limit);
  const nextPage = page < lastPage ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return {
    nextPage,
    prevPage,
    currentPage: page,
    lastPage,
    totalCount: total,
    itemsPerpage: limit,
    result,
  };
};
