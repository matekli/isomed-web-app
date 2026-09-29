/*
 * Název souboru:    createPool.ts
 * Autor:            Matěj Honzek (xhonze01)
 * Popis:            Funkce pro vytvoření připojení k databázi pomocí Pool.
 *                   Používá environmentální proměnnou DATABASE_URL pro získání
 *                   připojovacího řetězce.
 */

import { Pool } from 'pg';
import { env } from 'process';

export function createPool(): Pool {
  const databaseUrl = env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in environment variables.');
  }

  return new Pool({
    connectionString: databaseUrl,
  });
}
