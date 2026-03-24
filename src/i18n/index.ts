import de from './de.json';
import en from './en.json';

export type Lang = 'de' | 'en';

const dictionaries = { de, en } as const;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'de';
}

export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = dictionaries[lang];
    for (const k of keys) {
      if (val == null) return key;
      val = val[k];
    }
    return typeof val === 'string' ? val : key;
  };
}

/** Return the href for the opposite language */
export function getAlternateHref(url: URL, lang: Lang): string {
  const otherLang: Lang = lang === 'de' ? 'en' : 'de';
  const segments = url.pathname.split('/').filter(Boolean);
  // Remove current lang prefix
  segments.shift();

  // Map DE slugs → EN slugs and vice versa
  const deToEn: Record<string, string> = {
    krankenkasse: 'health-insurance',
    'krankenkasse/grundversicherung': 'health-insurance/basic-insurance',
    'krankenkasse/zusatzversicherung': 'health-insurance/supplementary-insurance',
    vorsorge: 'pension-planning',
    'vorsorge/saeule-3a': 'pension-planning/pillar-3a',
    'vorsorge/saeule-3b': 'pension-planning/pillar-3b',
    'vorsorge/lebensversicherung': 'pension-planning/life-insurance',
    'vorsorge/risikoversicherung': 'pension-planning/risk-insurance',
    'vorsorge/kinderplaene': 'pension-planning/childrens-plans',
    sachversicherung: 'property-insurance',
    'sachversicherung/auto': 'property-insurance/auto',
    'sachversicherung/hausrat': 'property-insurance/household',
    'sachversicherung/haftpflicht': 'property-insurance/liability',
    'sachversicherung/rechtsschutz': 'property-insurance/legal-protection',
    kontakt: 'contact',
    impressum: 'legal-notice',
    datenschutz: 'privacy-policy',
    nutzungsbedingungen: 'terms-of-use',
    vag45: 'vag45',
  };

  const enToDe: Record<string, string> = Object.fromEntries(
    Object.entries(deToEn).map(([k, v]) => [v, k])
  );

  const currentSlug = segments.join('/');

  let targetSlug: string;
  if (lang === 'de') {
    targetSlug = deToEn[currentSlug] ?? currentSlug;
  } else {
    targetSlug = enToDe[currentSlug] ?? currentSlug;
  }

  if (!targetSlug) return `/${otherLang}/`;
  return `/${otherLang}/${targetSlug}/`;
}

export function getLocalizedHref(slug: string, lang: Lang): string {
  if (!slug) return `/${lang}/`;
  return `/${lang}/${slug}/`;
}

/** Nav links per language */
export function getNavLinks(lang: Lang) {
  if (lang === 'de') {
    return [
      { href: '/de/krankenkasse/', key: 'nav.health' },
      { href: '/de/vorsorge/', key: 'nav.pension' },
      { href: '/de/sachversicherung/', key: 'nav.property' },
      { href: '/de/kontakt/', key: 'nav.contact' },
    ];
  }
  return [
    { href: '/en/health-insurance/', key: 'nav.health' },
    { href: '/en/pension-planning/', key: 'nav.pension' },
    { href: '/en/property-insurance/', key: 'nav.property' },
    { href: '/en/contact/', key: 'nav.contact' },
  ];
}

export function getFooterLinks(lang: Lang) {
  if (lang === 'de') {
    return {
      legal: '/de/impressum/',
      privacy: '/de/datenschutz/',
      terms: '/de/nutzungsbedingungen/',
      vag45: '/de/vag45/',
      contact: '/de/kontakt/',
    };
  }
  return {
    legal: '/en/legal-notice/',
    privacy: '/en/privacy-policy/',
    terms: '/en/terms-of-use/',
    vag45: '/en/vag45/',
    contact: '/en/contact/',
  };
}

export function getServiceLinks(lang: Lang) {
  if (lang === 'de') {
    return {
      health: '/de/krankenkasse/',
      healthSubs: [
        { href: '/de/krankenkasse/grundversicherung/', key: 'Grundversicherung' },
        { href: '/de/krankenkasse/zusatzversicherung/', key: 'Zusatzversicherung' },
      ],
      pension: '/de/vorsorge/',
      pensionSubs: [
        { href: '/de/vorsorge/saeule-3a/', key: 'Säule 3a' },
        { href: '/de/vorsorge/saeule-3b/', key: 'Säule 3b' },
        { href: '/de/vorsorge/lebensversicherung/', key: 'Lebensversicherung' },
        { href: '/de/vorsorge/risikoversicherung/', key: 'Risikoversicherung' },
        { href: '/de/vorsorge/kinderplaene/', key: 'Kinderpläne' },
      ],
      property: '/de/sachversicherung/',
      propertySubs: [
        { href: '/de/sachversicherung/auto/', key: 'Autoversicherung' },
        { href: '/de/sachversicherung/hausrat/', key: 'Hausratversicherung' },
        { href: '/de/sachversicherung/haftpflicht/', key: 'Haftpflichtversicherung' },
        { href: '/de/sachversicherung/rechtsschutz/', key: 'Rechtsschutzversicherung' },
      ],
    };
  }
  return {
    health: '/en/health-insurance/',
    healthSubs: [
      { href: '/en/health-insurance/basic-insurance/', key: 'Basic Insurance' },
      { href: '/en/health-insurance/supplementary-insurance/', key: 'Supplementary Insurance' },
    ],
    pension: '/en/pension-planning/',
    pensionSubs: [
      { href: '/en/pension-planning/pillar-3a/', key: 'Pillar 3a' },
      { href: '/en/pension-planning/pillar-3b/', key: 'Pillar 3b' },
      { href: '/en/pension-planning/life-insurance/', key: 'Life Insurance' },
      { href: '/en/pension-planning/risk-insurance/', key: 'Risk Insurance' },
      { href: '/en/pension-planning/childrens-plans/', key: "Children's Plans" },
    ],
    property: '/en/property-insurance/',
    propertySubs: [
      { href: '/en/property-insurance/auto/', key: 'Auto Insurance' },
      { href: '/en/property-insurance/household/', key: 'Household Insurance' },
      { href: '/en/property-insurance/liability/', key: 'Liability Insurance' },
      { href: '/en/property-insurance/legal-protection/', key: 'Legal Protection' },
    ],
  };
}
