import type {
  CreateUserInput,
  ListUsersParams,
  Paginated,
  UpdateUserInput,
  User,
} from '../types/user';
import { http } from './http';

export const usersService = {
  list: (params: ListUsersParams) =>
    http.get<Paginated<User>>('/users', params),

  getById: (id: string) => http.get<User>(`/users/${id}`),

  create: (input: CreateUserInput) => http.post<User>('/users', input),

  update: (id: string, input: UpdateUserInput) =>
    http.patch<User>(`/users/${id}`, input),

  remove: (id: string) => http.delete(`/users/${id}`),
};
