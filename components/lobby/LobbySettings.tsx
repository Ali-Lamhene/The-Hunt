import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { LobbyParams } from '../../types/lobby';
import { MapPin, Clock, Users, Plus, Minus } from 'lucide-react-native';
import { ExpeditionText } from '@/components/ui/ExpeditionText';

interface LobbySettingsProps {
  params: LobbyParams;
  isHost: boolean;
  onUpdateParams?: (newParams: Partial<LobbyParams>) => void;
}

export default function LobbySettings({ params, isHost, onUpdateParams }: LobbySettingsProps) {
  const updateRadius = (delta: number) => {
    if (!onUpdateParams) return;
    const newRadius = Math.max(100, params.radius + delta);
    onUpdateParams({ radius: newRadius });
  };

  const updateDuration = (delta: number) => {
    if (!onUpdateParams) return;
    const newDuration = Math.max(10, params.durationMinutes + delta);
    onUpdateParams({ durationMinutes: newDuration });
  };

  const updateMaxPlayers = (delta: number) => {
    if (!onUpdateParams) return;
    const newMax = Math.max(2, params.maxPlayers + delta);
    onUpdateParams({ maxPlayers: newMax });
  };

  const formatCoordinate = (val: number, isLat: boolean) => {
    const dir = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'O');
    return `${Math.abs(val).toFixed(5)}° ${dir}`;
  };

  return (
    <View style={styles.cardContainer}>
      <ExpeditionText variant="mono" size="xs" style={styles.title}>
        /// ZONE & CONFIGURATION TACTIQUE
      </ExpeditionText>

      {/* 1. Zone GPS - Centre */}
      <View style={styles.settingRow}>
        <View style={styles.labelContainer}>
          <MapPin size={18} color="#e8d5a3" style={styles.icon} />
          <View>
            <ExpeditionText variant="mono" size="sm" style={styles.label}>Centre du Radar</ExpeditionText>
            <ExpeditionText variant="mono" size="xs" style={styles.subLabel}>Coordonnées GPS d'ancrage</ExpeditionText>
          </View>
        </View>
        <ExpeditionText variant="mono" size="xs" style={styles.gpsValue}>
          {formatCoordinate(params.center.latitude, true)} /{' '}
          {formatCoordinate(params.center.longitude, false)}
        </ExpeditionText>
      </View>

      <View style={styles.divider} />

      {/* 2. Rayon du radar */}
      <View style={styles.settingRow}>
        <View style={styles.labelContainer}>
          <Users size={18} color="#e8d5a3" style={styles.icon} />
          <View>
            <ExpeditionText variant="mono" size="sm" style={styles.label}>Rayon de Traque</ExpeditionText>
            <ExpeditionText variant="mono" size="xs" style={styles.subLabel}>Taille du dôme de chasse</ExpeditionText>
          </View>
        </View>
        <View style={styles.controlGroup}>
          {isHost && (
            <TouchableOpacity onPress={() => updateRadius(-50)} style={styles.btnAdjust}>
              <Minus size={14} color="#e8d5a3" />
            </TouchableOpacity>
          )}
          <ExpeditionText variant="title" size="xs" style={styles.valueText}>{params.radius} m</ExpeditionText>
          {isHost && (
            <TouchableOpacity onPress={() => updateRadius(50)} style={styles.btnAdjust}>
              <Plus size={14} color="#e8d5a3" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      {/* 3. Durée de la partie */}
      <View style={styles.settingRow}>
        <View style={styles.labelContainer}>
          <Clock size={18} color="#e8d5a3" style={styles.icon} />
          <View>
            <ExpeditionText variant="mono" size="sm" style={styles.label}>Durée Limite</ExpeditionText>
            <ExpeditionText variant="mono" size="xs" style={styles.subLabel}>Autonomie des trackers</ExpeditionText>
          </View>
        </View>
        <View style={styles.controlGroup}>
          {isHost && (
            <TouchableOpacity onPress={() => updateDuration(-5)} style={styles.btnAdjust}>
              <Minus size={14} color="#e8d5a3" />
            </TouchableOpacity>
          )}
          <ExpeditionText variant="title" size="xs" style={styles.valueText}>{params.durationMinutes} min</ExpeditionText>
          {isHost && (
            <TouchableOpacity onPress={() => updateDuration(5)} style={styles.btnAdjust}>
              <Plus size={14} color="#e8d5a3" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.divider} />

      {/* 4. Nombre maximum de joueurs */}
      <View style={styles.settingRow}>
        <View style={styles.labelContainer}>
          <Users size={18} color="#e8d5a3" style={styles.icon} />
          <View>
            <ExpeditionText variant="mono" size="sm" style={styles.label}>Max Effectif</ExpeditionText>
            <ExpeditionText variant="mono" size="xs" style={styles.subLabel}>Limitation réseau local</ExpeditionText>
          </View>
        </View>
        <View style={styles.controlGroup}>
          {isHost && (
            <TouchableOpacity onPress={() => updateMaxPlayers(-1)} style={styles.btnAdjust}>
              <Minus size={14} color="#e8d5a3" />
            </TouchableOpacity>
          )}
          <ExpeditionText variant="title" size="xs" style={styles.valueText}>{params.maxPlayers} max</ExpeditionText>
          {isHost && (
            <TouchableOpacity onPress={() => updateMaxPlayers(1)} style={styles.btnAdjust}>
              <Plus size={14} color="#e8d5a3" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(232, 213, 163, 0.03)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.08)',
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
  },
  title: {
    color: '#7a5c3a',
    letterSpacing: 2,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  icon: {
    marginTop: 2,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subLabel: {
    color: '#7a5c3a',
    marginTop: 1,
  },
  gpsValue: {
    color: '#e8d5a3',
    textAlign: 'right',
    opacity: 0.8,
  },
  controlGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  btnAdjust: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(232, 213, 163, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueText: {
    color: '#FFFFFF',
    minWidth: 60,
    textAlign: 'center',
    paddingTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(232, 213, 163, 0.05)',
    marginVertical: 12,
  },
});
