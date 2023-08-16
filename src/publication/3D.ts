import { z } from 'zod';

import { PublicationMainFocus } from './PublicationMainFocus';
import { SchemaId } from './SchemaId';
import {
  AnyMediaSchema,
  metadataDetailsWith,
  MetadataLicenseTypeSchema,
  notEmptyString,
  publicationWith,
  uri,
} from './common';

export enum ThreeDFormat {
  gLTF = 'gLTF/GLB',
  fbx = 'FBX',
  vrm = 'VRM',
  obj = 'OBJ',
}

/**
 * @internal
 */
export const ThreeDAssetSchema = z.object({
  url: uri('The 3D asset url or zip'),
  zipPath: notEmptyString()
    .optional()
    .describe('path in extracted zip. Relative. 3D start point, must be 3D file type'),
  playerUrl: uri('Link to web based 3D player'),
  format: z.nativeEnum(ThreeDFormat).describe('format of the 3D object. gLTF/GLB, FBX, VRM or OBJ'),
  license: MetadataLicenseTypeSchema.optional().describe('The license for the 3D asset'),
});
export type ThreeDAsset = z.infer<typeof ThreeDAssetSchema>;

export const ThreeDMetadataSchema = publicationWith({
  $schema: z.literal(SchemaId.THREE_D),

  lens: metadataDetailsWith({
    mainContentFocus: z.literal(PublicationMainFocus.THREE_D),

    threeDAssets: ThreeDAssetSchema.array().min(1).describe('The 3D items for the publication'),

    attachments: AnyMediaSchema.array()
      .min(1)
      .optional()
      .describe('The other attachments you want to include with it.'),
  }),
});
export type ThreeDMetadata = z.infer<typeof ThreeDMetadataSchema>;
