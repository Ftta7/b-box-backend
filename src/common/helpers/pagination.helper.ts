export interface PaginationParams {
    page?: number;
    limit?: number;
  }
  
  export interface PaginationOptions {
    skip: number;
    take: number;
    page: number;
    limit: number;
  }
  
  export function getPagination(query: PaginationParams, defaultLimit = 10): PaginationOptions {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : defaultLimit;
    const skip = (page - 1) * limit;
    return { skip, take: limit, page, limit };
  }
  
  export function toPaginationResponse<T>(data: T[], total: number, page: number, limit: number) {
    return {
      list: data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }