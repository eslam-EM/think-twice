/** Think Twice design tokens — light lavender theme matching the product mockup. */
export const colors = {
  bg: '#F4F2FF',
  surface: '#FFFFFF',
  lavender: '#EEEBFF',
  lavenderStrong: '#DDD7FF',
  sky: '#E6F3FC',
  skyStrong: '#CFE7F8',
  primary: '#5B4FD9',
  primaryDark: '#3E2FA8',
  violet: '#7B6CF0',
  text: '#23215B',
  textSecondary: '#5F5B8F',
  muted: '#8E8AB5',
  border: '#E3DFFA',
  success: '#2FA866',
  successBg: '#E5F7EC',
  warning: '#F08A3E',
  warningBg: '#FFF1E6',
  error: '#E5534B',
  errorBg: '#FDECEB',
  blue: '#2E8BC9',
  flame: '#F26B3A',
} as const;

export const fonts = {
  regular: 'Cairo_400Regular',
  semibold: 'Cairo_600SemiBold',
  bold: 'Cairo_700Bold',
  black: 'Cairo_900Black',
} as const;

export const type = {
  hero: { fontSize: 30, lineHeight: 46, fontFamily: fonts.black },
  title: { fontSize: 21, lineHeight: 34, fontFamily: fonts.bold },
  heading: { fontSize: 17, lineHeight: 28, fontFamily: fonts.bold },
  body: { fontSize: 15, lineHeight: 26, fontFamily: fonts.regular },
  bodyStrong: { fontSize: 15, lineHeight: 26, fontFamily: fonts.semibold },
  caption: { fontSize: 13, lineHeight: 21, fontFamily: fonts.regular },
  label: { fontSize: 12, lineHeight: 18, fontFamily: fonts.semibold },
} as const;
export type TypeVariant = keyof typeof type;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 10, md: 16, lg: 22, pill: 999 } as const;
export const shadow = { elevation: 3, shadowColor: '#5B4FD9', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } } as const;
export const minTouch = 48;
