import ContentBlock from 'components/Sitecore/ContentBlock'
// import SampleRendering from 'components/Sitecore/SampleRendering'
import Generic from 'components/Sitecore/Generic'
import ImageRight from 'components/Sitecore/ImageRight'
import ImageLeft from 'components/Sitecore/ImageLeft'
import Promo from 'components/Sitecore/Promo'
import Panel from 'components/Sitecore/Panel'
import Headline from 'components/Sitecore/Headline'
import BlogPost from 'components/Sitecore/BlogPost'

const components = new Map()
components.set('ContentBlock', ContentBlock)
components.set('Sample Rendering', Generic)
components.set('Teaser Section', Generic)
components.set('ThreeColumnNavigation', Generic)
components.set('Image Gallery', Generic)

components.set('OneColumnNarrow', Generic)
components.set('ImageRightText', ImageRight)
components.set('ImageLeftText', ImageLeft)
components.set('Promo', Promo)
components.set('Panel', Panel)
components.set('Headline', Headline)
components.set('Blog Post', BlogPost)

export function componentFactory(componentName: string) {
  return components.get(componentName)
}
