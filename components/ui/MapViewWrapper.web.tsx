import React from 'react';
import { View } from 'react-native';
import { ExpeditionText } from './ExpeditionText';

const MapView = React.forwardRef<any, any>(({ children, style }, ref) => {
  return (
    <View
      ref={ref}
      style={[
        style,
        {
          backgroundColor: '#0a0f0a',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'rgba(232, 213, 163, 0.2)',
        }
      ]}
    >
      <ExpeditionText variant="mono" size="xs" style={{ color: '#e8d5a3', letterSpacing: 2, textAlign: 'center', opacity: 0.8 }}>
        [ TACTICAL MAP ACTIVE (WEB DEMO) ]
      </ExpeditionText>
      {children}
    </View>
  );
});

export const Circle = () => null;
export const Marker = () => null;

export default MapView;
