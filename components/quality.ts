import { colors } from '@/constants/theme';

/** Visual treatment for each answer quality. */
export const QUALITY_UI = {
  best: { icon: 'check-circle', color: colors.success, bg: colors.successBg, title: 'اختيار ممتاز!' },
  ok: { icon: 'thumb-up', color: colors.warning, bg: colors.warningBg, title: 'اختيار كويس، وفي أفضل منه' },
  avoid: { icon: 'alert-circle', color: colors.error, bg: colors.errorBg, title: 'فكّر تاني في الاختيار ده' },
} as const;

