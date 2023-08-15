import { z } from 'zod';

import { MarkdownSchema, uri, url } from './primitives.js';

export enum MarketplaceMetadataAttributeDisplayType {
  number = 'number',
  string = 'string',
  date = 'date',
}

export const MarketplaceMetadataAttributeSchema = z.object({
  displayType: z.nativeEnum(MarketplaceMetadataAttributeDisplayType).optional(),
  traitType: z.string({ description: 'The name of the trait.' }).optional(),
  value: z.string({ description: 'The value of the trait' }),
});
export type MarketplaceMetadataAttribute = z.infer<typeof MarketplaceMetadataAttributeSchema>;

export const MarketplaceMetadataSchema = z.object({
  description: MarkdownSchema.describe('A human-readable description of the item.'),

  external_url: url(
    `This is the URL that will appear below the asset's image on OpenSea and others etc. ` +
      'and will allow users to leave OpenSea and view the item on the site',
  ).optional(),

  name: z.string({ description: 'Name of the NFT item.' }).optional(),

  attributes: MarketplaceMetadataAttributeSchema.array()
    .optional()
    .describe(
      'These are the attributes for the item, which will show up on the OpenSea and others NFT trading websites on the item.',
    ),

  image: uri('Marketplaces will store any NFT image here.'),

  animation_url: url(
    'In spec for OpenSea and other providers - also used when using EMBED main publication focus' +
      'A URL to a multi-media attachment for the item. The file extensions GLTF, GLB, WEBM, MP4, M4V, OGV, ' +
      'and OGG are supported, along with the audio-only extensions MP3, WAV, and OGA. ' +
      'Animation_url also supports HTML pages, allowing you to build rich experiences and interactive NFTs using JavaScript canvas, ' +
      'WebGL, and more. Scripts and relative paths within the HTML page are now supported. However, access to browser extensions is not supported.',
  ).optional(),
});
export type MarketplaceMetadata = z.infer<typeof MarketplaceMetadataSchema>;