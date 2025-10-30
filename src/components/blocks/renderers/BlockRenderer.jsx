import { HeroSimpleBlock } from './HeroSimpleBlock';
import { TextContentBlock } from './TextContentBlock';
import { TextImageBlock } from './TextImageBlock';
import { TwoColumnTextBlock } from './TwoColumnTextBlock';
import { GalleryBlock } from './GalleryBlock';
import { VideoBlock } from './VideoBlock';
import { FeaturesGridBlock } from './FeaturesGridBlock';
import { IconListBlock } from './IconListBlock';
import { StatsBlock } from './StatsBlock';
import { CTASimpleBlock } from './CTASimpleBlock';
import { CTABoxedBlock } from './CTABoxedBlock';
import { TestimonialsSliderBlock } from './TestimonialsSliderBlock';
import { LoopGridBlock } from './LoopGridBlock';
import { LoopCarouselBlock } from './LoopCarouselBlock';

/**
 * BlockRenderer - Centralized component that renders content blocks
 *
 * Maps block types to their renderer components and renders the blocks array
 *
 * Usage:
 * <BlockRenderer blocks={contentBlocks} context={{serviceGroupId: '123'}} />
 */

const BLOCK_COMPONENTS = {
  'hero_simple': HeroSimpleBlock,
  'text_content': TextContentBlock,
  'text_image': TextImageBlock,
  'two_column_text': TwoColumnTextBlock,
  'gallery': GalleryBlock,
  'video': VideoBlock,
  'features_grid': FeaturesGridBlock,
  'icon_list': IconListBlock,
  'stats': StatsBlock,
  'cta_simple': CTASimpleBlock,
  'cta_boxed': CTABoxedBlock,
  'testimonials_slider': TestimonialsSliderBlock,
  'loop_grid': LoopGridBlock,
  'loop_carousel': LoopCarouselBlock
};

export const BlockRenderer = ({ blocks = [], context = {} }) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <>
      {blocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.type];

        if (!Component) {
          console.warn(`Block type "${block.type}" not found in BLOCK_COMPONENTS`);
          return (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
              <p className="text-red-600 font-body">
                Unknown block type: <strong>{block.type}</strong>
              </p>
            </div>
          );
        }

        return (
          <Component
            key={block.id || index}
            data={block.data}
            context={context}
            order={block.order}
          />
        );
      })}
    </>
  );
};
