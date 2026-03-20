// src/sanity/sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool }    from '@sanity/vision';
import { media }         from 'sanity-plugin-media';
import { schemaTypes }   from './schemaTypes';
import { sanityConfig }  from './config';

export default defineConfig({
  ...sanityConfig,
  name:  'tatiana-portfolio-studio',
  title: '✨ Tatiana Nohra — Portfolio',

  plugins: [
    structureTool({
      structure: S =>
        S.list()
          .title('Portfolio')
          .items([

            // ── Identity ──────────────────────────────────────────────
            S.listItem()
              .title('👤 About & Bio')
              .id('about')
              .icon(() => '👤')
              .child(
                S.document()
                  .title('About & Bio')
                  .schemaType('about')
                  .documentId('singleton-about')
              ),

            S.divider(),

            // ── Work ──────────────────────────────────────────────────
            S.listItem()
              .title('🌺 Projects')
              .icon(() => '🌺')
              .child(
                S.documentTypeList('project')
                  .title('Projects')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),

            S.divider(),

            // ── Experience — split by type ────────────────────────────
            S.listItem()
              .title('💼 Work Experience')
              .icon(() => '💼')
              .child(
                S.documentList()
                  .title('Work Experience')
                  .apiVersion('2024-01-01')
                  .filter('_type == "experience" && type == "work"')
                  .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
              ),

            S.listItem()
              .title('🌱 Leadership & Activities')
              .icon(() => '🌱')
              .child(
                S.documentList()
                  .title('Leadership & Activities')
                  .apiVersion('2024-01-01')
                  .filter('_type == "experience" && type == "leadership"')
                  .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
              ),

            S.listItem()
              .title('🎓 Education')
              .icon(() => '🎓')
              .child(
                S.documentList()
                  .title('Education')
                  .apiVersion('2024-01-01')
                  .filter('_type == "experience" && type == "education"')
                  .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
              ),

            S.divider(),

            // ── Skills ────────────────────────────────────────────────
            S.listItem()
              .title('🛠️ Skills')
              .icon(() => '🛠️')
              .child(
                S.documentTypeList('skillGroup')
                  .title('Skill Groups')
                  .defaultOrdering([{ field: 'order', direction: 'asc' }])
              ),

            S.divider(),

            // ── Corridor Photos ────────────────────────────────────────
            S.listItem()
              .title('🖼️ Corridor Photos')
              .icon(() => '🖼️')
              .child(
                S.documentTypeList('corridorPhoto')
                  .title('Wall Frames (0–7)')
                  .defaultOrdering([{ field: 'frameIndex', direction: 'asc' }])
              ),

          ]),
    }),
    visionTool(),
    media(),
  ],

  schema: { types: schemaTypes as import('sanity').SchemaTypeDefinition[] },
});