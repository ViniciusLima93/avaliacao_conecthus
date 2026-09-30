import { Prisma } from '../generated/prisma/client';

/**
 * Operações que recebem `where` e, portanto, precisam ignorar registros excluídos.
 * Inclui as de escrita por filtro (update/upsert/delete) para que um registro
 * excluído não possa ser alterado nem "excluído de novo".
 */
const FILTERED_OPERATIONS = new Set<string>([
  'findUnique',
  'findUniqueOrThrow',
  'findFirst',
  'findFirstOrThrow',
  'findMany',
  'count',
  'aggregate',
  'groupBy',
  'update',
  'updateMany',
  'updateManyAndReturn',
  'upsert',
  'delete',
  'deleteMany',
]);

/**
 * Soft delete de `User`: acrescenta `deletedAt: null` ao `where` de toda operação
 * filtrada, então registros excluídos nunca aparecem em find/findOne/count etc.
 *
 * Não cobre SQL bruto (`$queryRaw`/`$executeRaw`): consultas raw em `users`
 * precisam filtrar `deleted_at IS NULL` manualmente.
 */
export const softDeleteExtension = Prisma.defineExtension({
  name: 'soft-delete',
  query: {
    user: {
      $allOperations({ operation, args, query }) {
        if (FILTERED_OPERATIONS.has(operation)) {
          const filtered = args as { where?: Prisma.UserWhereInput };
          filtered.where = { ...filtered.where, deletedAt: null };
        }
        return query(args);
      },
    },
  },
});
