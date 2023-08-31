import { describe, it } from '@jest/globals';

import { expectSchema } from '../__helpers__/assertions.js';
import { legacy } from '../index.js';

describe(`Given the legacy.PublicationMetadataSchema`, () => {
  describe(`when parsing an empty object`, () => {
    it(`then it should complain about the missing version`, () => {
      expectSchema(() => legacy.PublicationMetadataSchema.safeParse({})).toMatchInlineSnapshot(`
        "fix the following issues
        · "version": Required"
      `);
    });

    it(`then it should complain about invalid version`, () => {
      expectSchema(() => legacy.PublicationMetadataSchema.safeParse({ version: '42' }))
        .toMatchInlineSnapshot(`
        "fix the following issues
        · "version": Invalid enum value. Expected '1.0.0' | '2.0.0', received '42'"
      `);
    });
  });

  describe(`when parsing an invalid v1 object`, () => {
    it(`then it should complain about missing basic mandatory fields`, () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '1.0.0',
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "metadata_id": Required
        · "name": Required
        · "attributes": Required"
      `);
    });

    it(`then it should check at least one between content, image, and media is present`, () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '1.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "content": At least one between content, image, and media must be present. Content must be over 1 character.
        · "image": At least one between content, image, and media must be present.
        · "media": At least one between content, image, and media must be present."
      `);
    });

    it('then it should complain about empty content', () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '1.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          content: '',
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "content": At least one between content, image, and media must be present. Content must be over 1 character.
        · "image": At least one between content, image, and media must be present.
        · "media": At least one between content, image, and media must be present."
      `);
    });

    it('then it should complain about too long content', () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '1.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          content: 'a'.repeat(30001),
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "content": String must contain at most 30000 character(s)"
      `);
    });

    it('then it should complain about invalid media items', () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '1.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          media: [
            {},
            {
              item: 'https://example.com/image.png',
              cover: 'not valid URI',
            },
          ],
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "media[0].item": Required
        · "media[1].cover": Invalid url"
      `);
    });
  });

  describe(`when parsing an invalid v2 object`, () => {
    it(`then it should complain about missing basic mandatory fields`, () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '2.0.0',
          mainContentFocus: legacy.PublicationMainFocus.TEXT_ONLY,
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "metadata_id": Required
        · "name": Required
        · "attributes": Required
        · "content": Required
        · "locale": Required"
      `);
    });

    it('then it should complain about invalid v2 fields', () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '2.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          content: 'a',
          locale: '',
          contentWarning: 'NOVALID',
          mainContentFocus: legacy.PublicationMainFocus.TEXT_ONLY,
          tags: ['a'.repeat(51), '', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "locale": String must contain at least 2 character(s)
        · "contentWarning": Invalid enum value. Expected 'NSFW' | 'SENSITIVE' | 'SPOILER', received 'NOVALID'
        · "tags": Array must contain at most 10 element(s)
        · "tags[0]": String must contain at most 50 character(s)
        · "tags[1]": String must contain at least 1 character(s)"
      `);
    });

    it(`then it should complain about invalid ${legacy.PublicationMainFocus.ARTICLE} metadata`, () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '2.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          locale: 'en',
          mainContentFocus: legacy.PublicationMainFocus.ARTICLE,
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "content": Required"
      `);
    });

    it(`then it should complain about invalid ${legacy.PublicationMainFocus.AUDIO} metadata`, () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '2.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          locale: 'en',
          mainContentFocus: legacy.PublicationMainFocus.AUDIO,
          media: [
            {
              item: 'https://example.com/image.png',
              type: 'image/png',
            },
          ],
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "media": Metadata AUDIO requires an audio to be attached."
      `);
    });

    it(`then it should complain about invalid ${legacy.PublicationMainFocus.EMBED} metadata`, () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '2.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          locale: 'en',
          mainContentFocus: legacy.PublicationMainFocus.EMBED,
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "animation_url": Required"
      `);
    });

    it(`then it should complain about invalid ${legacy.PublicationMainFocus.IMAGE} metadata`, () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '2.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          locale: 'en',
          mainContentFocus: legacy.PublicationMainFocus.IMAGE,
          media: [
            {
              item: 'https://example.com/dunno.42',
            },
          ],
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "media": Metadata IMAGE requires an image to be attached."
      `);
    });

    it(`then it should complain about invalid ${legacy.PublicationMainFocus.LINK} metadata`, () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '2.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          locale: 'en',
          content: 'somehting without a URL',
          mainContentFocus: legacy.PublicationMainFocus.LINK,
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "content": Metadata LINK requires a valid https link"
      `);
    });

    it(`then it should complain about invalid ${legacy.PublicationMainFocus.TEXT_ONLY} metadata`, () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '2.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          locale: 'en',
          mainContentFocus: legacy.PublicationMainFocus.TEXT_ONLY,
          media: [
            {
              item: 'https://example.com/image.png',
            },
          ],
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "content": Required
        · "media": Metadata TEXT cannot have media"
      `);
    });

    it(`then it should complain about invalid ${legacy.PublicationMainFocus.VIDEO} metadata`, () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '2.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          locale: 'en',
          mainContentFocus: legacy.PublicationMainFocus.VIDEO,
          media: [
            {
              item: 'https://example.com/dunno.42',
            },
          ],
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "media": Metadata VIDEO requires an image to be attached."
      `);
    });

    it('then it should complain about invalid encryptionParams', () => {
      expectSchema(() =>
        legacy.PublicationMetadataSchema.safeParse({
          version: '2.0.0',
          metadata_id: '123',
          name: '123',
          attributes: [],
          locale: 'en',
          mainContentFocus: legacy.PublicationMainFocus.TEXT_ONLY,
          content: 'a',
          encryptionParams: {
            accessCondition: {
              and: {
                criteria: [],
              },
              or: {
                criteria: [
                  {
                    collect: {
                      publicationId: '0x01-0x01',
                    },
                    profile: {
                      profileId: '0x01',
                    },
                  },
                ],
              },
            },
            encryptionKey: '0x...',
          },
        }),
      ).toMatchInlineSnapshot(`
        "fix the following issues
        · "encryptionParams.accessCondition.or.criteria": Invalid OR condition: should have at least 2 conditions
        · "encryptionParams.accessCondition.or.criteria[0]": Unrecognized key(s) in object: 'collect'
        · "encryptionParams.accessCondition": Unrecognized key(s) in object: 'and'
        · "encryptionParams.encryptionKey": Encryption key should be 368 characters long."
      `);
    });
  });
});