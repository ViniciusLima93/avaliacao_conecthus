export type User = {
  id: string;
  name: string;
  registration: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserInput = {
  name: string;
  registration: string;
  email: string;
  password: string;
  isActive?: boolean;
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
