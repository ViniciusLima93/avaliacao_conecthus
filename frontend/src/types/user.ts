export type User = {
  id: string;
  name: string;
  registration: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  name: string;
  registration: string;
  email: string;
  password: string;
};

export type UpdateUserInput = Partial<CreateUserInput>;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

export type ListUsersParams = {
  page: number;
  limit: number;
  search?: string;
};
