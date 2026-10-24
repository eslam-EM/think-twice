import { I18nManager, Platform } from 'react-native';
/** Always RTL (native forces it; web sets dir="rtl"). */
export const isRTL = Platform.OS === 'web' ? true : I18nManager.isRTL;
export const backIcon = isRTL ? 'arrow-right' : 'arrow-left';
export const forwardChevron = isRTL ? 'chevron-left' : 'chevron-right';
