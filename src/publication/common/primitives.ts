import { z } from 'zod';

import { Brand } from '../../utils.js';

/**
 * A locale identifier.
 *
 * Syntax: [language]-[region] where:
 * - [language] is a lowercase ISO 639-1 language code
 * - [region] is an optional uppercase ISO 3166-1 alpha-2 country code
 *
 * You can pass just the language code, or both the language and region codes.
 *
 * @example
 * - `en` any English
 * - `en-US` English as used in the United States
 * - `en-GB` English as used in the United Kingdom
 */
export type Locale = Brand<string, 'Locale'>;
export const LocaleSchema: z.Schema<Locale, z.ZodTypeDef, string> = z
  .string({
    description: 'A locale identifier.',
  })
  .transform((value) => value as Locale);

/**
 * A Lens App identifier.
 */
export type AppId = Brand<string, 'AppId'>;
export const AppIdSchema: z.Schema<AppId, z.ZodTypeDef, string> = z
  .string({
    description: 'A Lens App identifier.',
  })
  .transform((value) => value as AppId);

/**
 * A Uniform Resource Locator.
 */
export type URL = Brand<string, 'URL'>;
export function url(
  description: string = 'A Uniform Resource Identifier. ',
): z.Schema<URL, z.ZodTypeDef, string> {
  return z
    .string({ description })
    .url()
    .transform((value) => value as URL);
}

/**
 * A cryptographic signature.
 */
export type Signature = Brand<string, 'Signature'>;
export const SignatureSchema: z.Schema<Signature, z.ZodTypeDef, string> = z
  .string({
    description: 'A cryptographic signature of the Lens metadata.',
  })
  .transform((value) => value as Signature);

export type Markdown = Brand<string, 'Markdown'>;
export const MarkdownSchema: z.Schema<Markdown, z.ZodTypeDef, string> = z
  .string({
    description: 'A Markdown text.',
  })
  .transform((value) => value as Markdown);

/**
 * A Uniform Resource Identifier.
 *
 * It could be a URL pointing to a specific resource,
 * an IPFS URI (e.g. ipfs://Qm...), or an Arweave URI (e.g. ar://Qm...).
 */
export type URI = Brand<string, 'URI'>;
export function uri(
  description: string = 'A Uniform Resource Identifier. ',
): z.Schema<URI, z.ZodTypeDef, string> {
  return z.string({ description }).transform((value) => value as URI);
}

/**
 * The textual content of a publication.
 */
export const ContentSchema = MarkdownSchema.describe('The textual content of a publication.');