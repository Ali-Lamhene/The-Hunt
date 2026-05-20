import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Modal, 
  Dimensions, 
  ActivityIndicator, 
  Platform 
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { X, ShieldAlert } from 'lucide-react-native';
import Svg, { Rect, Path, Line, Defs, Pattern, Mask } from 'react-native-svg';
import { ExpeditionText } from './ExpeditionText';

const { width: W, height: H } = Dimensions.get('screen');
const viewSize = Math.min(W * 0.7, 260);

interface QrCodeScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export default function QrCodeScannerModal({ 
  visible, 
  onClose, 
  onScan 
}: QrCodeScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Reset scanned state when modal becomes visible
  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    // Mechanical double click haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    onScan(data.trim());
  };

  const renderEyepieceOverlay = () => {
    return (
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        {/* Dark Jungle overlay outside eyepiece */}
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <Pattern id="scannerGrain" width="4" height="4" patternUnits="userSpaceOnUse">
              <Rect width="4" height="4" fill="rgba(26, 14, 5, 0.02)" />
              <Rect x="0" y="0" width="1" height="1" fill="rgba(122, 92, 58, 0.08)" />
            </Pattern>
            <Mask id="eyepieceMask">
              {/* White everything */}
              <Rect x="0" y="0" width="100%" height="100%" fill="white" />
              {/* Cutout eyepiece circle/rounded rect in the center */}
              <Rect 
                x={W / 2 - viewSize / 2} 
                y={H / 2 - viewSize / 2} 
                width={viewSize} 
                height={viewSize} 
                rx={24} 
                ry={24} 
                fill="black" 
              />
            </Mask>
          </Defs>

          {/* Masked jungle canopy background */}
          <Rect 
            x="0" 
            y="0" 
            width="100%" height="100%" 
            fill="rgba(13, 8, 2, 0.82)" 
            mask="url(#eyepieceMask)" 
          />

          <Rect 
            x="0" 
            y="0" 
            width="100%" height="100%" 
            fill="url(#scannerGrain)" 
            mask="url(#eyepieceMask)" 
          />
          
          {/* Eyepiece frames and copper rings */}
          <Rect 
            x={W / 2 - viewSize / 2} 
            y={H / 2 - viewSize / 2} 
            width={viewSize} 
            height={viewSize} 
            rx={24} 
            ry={24} 
            stroke="#7A5C3A" 
            strokeWidth={3} 
            fill="none" 
          />
          
          <Rect 
            x={W / 2 - viewSize / 2 - 4} 
            y={H / 2 - viewSize / 2 - 4} 
            width={viewSize + 8} 
            height={viewSize + 8} 
            rx={28} 
            ry={28} 
            stroke="#3D2410" 
            strokeWidth={1} 
            fill="none" 
          />

          {/* Target grid and measuring line styles */}
          <Line 
            x1={W / 2} 
            y1={H / 2 - viewSize / 2 + 10} 
            x2={W / 2} 
            y2={H / 2 - viewSize / 2 + 25} 
            stroke="#BC8F4F" 
            strokeWidth={1.5} 
          />
          <Line 
            x1={W / 2} 
            y1={H / 2 + viewSize / 2 - 25} 
            x2={W / 2} 
            y2={H / 2 + viewSize / 2 - 10} 
            stroke="#BC8F4F" 
            strokeWidth={1.5} 
          />
          <Line 
            x1={W / 2 - viewSize / 2 + 10} 
            y1={H / 2} 
            x2={W / 2 - viewSize / 2 + 25} 
            y2={H / 2} 
            stroke="#BC8F4F" 
            strokeWidth={1.5} 
          />
          <Line 
            x1={W / 2 + viewSize / 2 - 25} 
            y1={H / 2} 
            x2={W / 2 + viewSize / 2 - 10} 
            y2={H / 2} 
            stroke="#BC8F4F" 
            strokeWidth={1.5} 
          />

          {/* Compass corners on eyepiece */}
          <Path 
            d={`M ${W / 2 - viewSize / 2 + 16} ${H / 2 - viewSize / 2} L ${W / 2 - viewSize / 2} ${H / 2 - viewSize / 2} L ${W / 2 - viewSize / 2} ${H / 2 - viewSize / 2 + 16}`}
            stroke="#BC8F4F" 
            strokeWidth={2.5} 
            fill="none" 
          />
          <Path 
            d={`M ${W / 2 + viewSize / 2 - 16} ${H / 2 - viewSize / 2} L ${W / 2 + viewSize / 2} ${H / 2 - viewSize / 2} L ${W / 2 + viewSize / 2} ${H / 2 - viewSize / 2 + 16}`}
            stroke="#BC8F4F" 
            strokeWidth={2.5} 
            fill="none" 
          />
          <Path 
            d={`M ${W / 2 - viewSize / 2 + 16} ${H / 2 + viewSize / 2} L ${W / 2 - viewSize / 2} ${H / 2 + viewSize / 2} L ${W / 2 - viewSize / 2} ${H / 2 + viewSize / 2 - 16}`}
            stroke="#BC8F4F" 
            strokeWidth={2.5} 
            fill="none" 
          />
          <Path 
            d={`M ${W / 2 + viewSize / 2 - 16} ${H / 2 + viewSize / 2} L ${W / 2 + viewSize / 2} ${H / 2 + viewSize / 2} L ${W / 2 + viewSize / 2} ${H / 2 + viewSize / 2 - 16}`}
            stroke="#BC8F4F" 
            strokeWidth={2.5} 
            fill="none" 
          />
        </Svg>

        {/* Text instructions below view window */}
        <View style={styles.instructionsContainer}>
          <ExpeditionText variant="journal" size="sm" color="#BC8F4F" style={styles.instructionsText}>
            {"SCANNER LE QR CODE"}
          </ExpeditionText>
          <ExpeditionText variant="body" size="xs" color="#F4EDE0" style={styles.subInstructionsText}>
            {"Cadrez le QR Code pour rejoindre l'expédition"}
          </ExpeditionText>
        </View>
      </View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        {/* Loading camera state */}
        {permission === null && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#BC8F4F" />
            <ExpeditionText variant="journal" size="sm" color="#BC8F4F" style={{ marginTop: 12 }}>
              {"Chargement de la boussole..."}
            </ExpeditionText>
          </View>
        )}

        {/* No permission screen styled as exploration journal note */}
        {permission !== null && !permission.granted && (
          <View style={styles.permissionContainer}>
            <View style={styles.journalNote}>
              <View style={styles.journalHeader}>
                <ShieldAlert size={28} color="#C0392B" />
                <ExpeditionText variant="title" size="lg" color="#C0392B" style={styles.journalTitle}>
                  {"ACQUISITION BLOQUÉE"}
                </ExpeditionText>
              </View>
              
              <View style={styles.journalDivider} />
              
              <ExpeditionText variant="journal" size="md" color="#3D2410" style={styles.journalText}>
                {"L'objectif d'observation optique est scellé. Nous requérons votre permission pour accéder à la lentille de caméra de votre terminal."}
              </ExpeditionText>
              
              <ExpeditionText variant="journal" size="sm" color="#7A5C3A" style={[styles.journalText, { marginTop: 12, fontStyle: 'italic' }]}>
                {"Ceci est nécessaire pour lire le code d'activation de la traque et vous synchroniser avec l'expédition."}
              </ExpeditionText>
              
              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                  <ExpeditionText variant="title" size="xs" color="#FAF6EE">
                    {"RETOUR"}
                  </ExpeditionText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.grantBtn} onPress={requestPermission}>
                  <ExpeditionText variant="title" size="xs" color="#1A0E05">
                    {"DÉVERROUILLER"}
                  </ExpeditionText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Active camera view */}
        {permission !== null && permission.granted && (
          <View style={styles.cameraWrapper}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />

            {/* Custom eye-piece visual mask and lines */}
            {renderEyepieceOverlay()}

            {/* Top close compass rivet button */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color="#FAF6EE" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0802',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 24,
    backgroundColor: 'rgba(61, 36, 16, 0.85)',
    borderWidth: 1.5,
    borderColor: '#7A5C3A',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    zIndex: 100,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: H * 0.18,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsText: {
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subInstructionsText: {
    letterSpacing: 0.5,
    textAlign: 'center',
    opacity: 0.85,
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: 'rgba(13, 8, 2, 0.9)',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  journalNote: {
    backgroundColor: '#F4EDE0',
    borderWidth: 2,
    borderColor: '#7A5C3A',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  journalTitle: {
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  journalDivider: {
    height: 1,
    backgroundColor: '#7A5C3A',
    opacity: 0.25,
    marginBottom: 16,
  },
  journalText: {
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  grantBtn: {
    flex: 1,
    backgroundColor: '#BC8F4F',
    borderWidth: 1.5,
    borderColor: '#7A5C3A',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#3E2723',
    borderWidth: 1.5,
    borderColor: '#7A5C3A',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
