import React from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Clipboard, 
  Platform,
  Alert 
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';
import { Copy, Compass } from 'lucide-react-native';
import { ExpeditionText } from '../ui/ExpeditionText';

interface LobbyQrCodeProps {
  lobbyId: string;
}

export default function LobbyQrCode({ lobbyId }: LobbyQrCodeProps) {
  // Format code to "xxx - xxx" if 6 digits
  const formattedCode = lobbyId.length === 6 
    ? `${lobbyId.slice(0, 3)} - ${lobbyId.slice(3)}`
    : lobbyId.toUpperCase();

  const handleCopyCode = () => {
    Clipboard.setString(lobbyId);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      "COORDONNÉES ACQUISES",
      "Le code de salon a été copié dans vos notes de voyage."
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.brassPlate}>
        {/* Ancient book corner decorations */}
        <View style={[styles.cornerDecorator, styles.topLeftCorner]} />
        <View style={[styles.cornerDecorator, styles.topRightCorner]} />
        <View style={[styles.cornerDecorator, styles.bottomLeftCorner]} />
        <View style={[styles.cornerDecorator, styles.bottomRightCorner]} />

        {/* Section Header */}
        <View style={styles.headerContainer}>
          <Compass size={18} color="#E8D5A3" style={styles.compassIcon} />
          <ExpeditionText variant="journal" size="xs" color="#E8D5A3" style={styles.headerLabel}>
            {"/// COORDONNÉES D'EXPÉDITION"}
          </ExpeditionText>
        </View>

        {/* Code display */}
        <View style={styles.codeContainer}>
          <ExpeditionText variant="title" size="xl" color="#FAF6EE" style={styles.codeText}>
            {formattedCode}
          </ExpeditionText>
          
          <TouchableOpacity 
            style={styles.copyBtn} 
            onPress={handleCopyCode}
            activeOpacity={0.7}
          >
            <Copy size={14} color="#E8D5A3" />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* QR Code generator */}
        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            <QRCode
              value={lobbyId}
              size={150}
              color="#E8D5A3"
              backgroundColor="#141E15"
            />
          </View>
        </View>

        <ExpeditionText variant="journal" size="xs" color="#E8D5A3" style={styles.instructions}>
          {"Scannez le QR code pour rejoindre la partie"}
        </ExpeditionText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  brassPlate: {
    backgroundColor: '#141E15', // Deep forest canopy green/black
    borderWidth: 2,
    borderColor: '#7A5C3A', // Laiton/Bronze border
    borderRadius: 6,
    padding: 16,
    position: 'relative',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  cornerDecorator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: '#7A5C3A',
  },
  topLeftCorner: {
    top: 4,
    left: 4,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
  },
  topRightCorner: {
    top: 4,
    right: 4,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
  },
  bottomLeftCorner: {
    bottom: 4,
    left: 4,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
  },
  bottomRightCorner: {
    bottom: 4,
    right: 4,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  compassIcon: {
    opacity: 0.8,
  },
  headerLabel: {
    letterSpacing: 1.5,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
  },
  codeText: {
    letterSpacing: 3,
    fontSize: 26,
  },
  copyBtn: {
    padding: 6,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.25)',
    borderRadius: 4,
    backgroundColor: 'rgba(232, 213, 163, 0.05)',
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: '#7A5C3A',
    opacity: 0.3,
    marginBottom: 14,
  },
  qrContainer: {
    padding: 10,
    backgroundColor: '#141E15', // Same deep tactical green
    borderWidth: 1.5,
    borderColor: '#7A5C3A', // Brass border
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  qrWrapper: {
    padding: 4,
    backgroundColor: '#141E15',
  },
  instructions: {
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontStyle: 'italic',
    opacity: 0.8,
  },
});
