import * as Joi from 'joi';

export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  CORS_ORIGIN: string;
}

export const envValidationSchema = Joi.object<EnvironmentVariables>({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  CORS_ORIGIN: Joi.string().default('*'),
});

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const result: Joi.ValidationResult<EnvironmentVariables> =
    envValidationSchema.validate(config, {
      abortEarly: false,
      allowUnknown: true,
    });
  if (result.error) {
    throw new Error(`Variáveis de ambiente inválidas: ${result.error.message}`);
  }
  return result.value;
}
