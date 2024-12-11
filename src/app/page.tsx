import { auth } from '$libs/auth';

import { LandingPageCTA1 } from './_components/cta1';
import { LandingPageFeatures } from './_components/features';
import { LandingPageFooter } from './_components/footer';
import { LandingPageHeader } from './_components/header';
import { LandingPageHero } from './_components/hero';
import { LandingPageNotes } from './_components/notes';
import { LandingPageParticles } from './_components/particles';
import { LandingPagePricing } from './_components/princing';
import { LandingPageSaasImage } from './_components/saas-image';

export default async function HomeLandingPage() {
  const session = await auth();

  return (
    <div className="relative overflow-hidden">
      <LandingPageHeader user={session?.user} />

      <main className="w-full h-full py-14 flex flex-col gap-4 items-center justify-center">
        <LandingPageHero />
        <LandingPageSaasImage />

        <div className="w-full flex flex-col gap-8 mt-16">
          <LandingPageFeatures />
          <LandingPageCTA1 />
          <LandingPagePricing />
          <LandingPageNotes />
        </div>
      </main>

      <LandingPageFooter />

      <LandingPageParticles />
    </div>
  );
}
