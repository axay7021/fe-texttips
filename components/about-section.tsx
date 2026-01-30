import DocumentRewriteCard from './cards/document-rewrite-card';
import ParagraphRewriteCard from './cards/paragraph-rewrite-card';

const AboutSection = () => {
  return (
    <section
      className='relative h-auto min-h-screen py-[50px] md:py-[100px] min-[1080px]:!py-[250px]
 px-4 overflow-hidden bg-[linear-gradient(180deg,rgba(201,228,255,1)_0%,rgba(255,255,255,1)_100%)] rounded-t-[50px]'
    >
      <div className='max-w-7xl mx-auto space-y-10 md:!space-y-30 lg:!space-y-100'>
        <ParagraphRewriteCard />
        <DocumentRewriteCard />
      </div>
    </section>
  );
};

export default AboutSection;
