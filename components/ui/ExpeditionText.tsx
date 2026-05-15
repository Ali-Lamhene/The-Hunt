import { Text, TextProps, StyleSheet } from 'react-native';
import { Typography } from '@/constants/Typography';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ExpeditionTextProps extends TextProps {
  variant?: 'title' | 'body' | 'bodyBold' | 'mono' | 'journal';
  size?: keyof typeof Typography.size;
  color?: string;
}

export function ExpeditionText({
  style,
  variant = 'body',
  size = 'md',
  color,
  ...rest
}: ExpeditionTextProps) {
  const themeColor = useThemeColor({}, 'text');
  
  const getFontFamily = () => {
    const fontFamilies = {
      title: Typography.family.title,
      journal: Typography.family.subtitle,
      body: Typography.family.body,
      bodyBold: Typography.family.bodyBold,
      mono: Typography.family.mono,
    };

    return fontFamilies[variant] || Typography.family.body;
  };

  return (
    <Text
      style={[
        {
          color: color || themeColor,
          fontSize: Typography.size[size],
          fontFamily: getFontFamily(),
          lineHeight: Typography.size[size] * Typography.lineHeight.normal,
        },
        variant === 'title' && styles.title,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
