import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Player } from '../../types/lobby';
import { Crown, Check, Shield, Crosshair, User } from 'lucide-react-native';
import { ExpeditionText } from '@/components/ui/ExpeditionText';

interface PlayerListProps {
  players: Record<string, Player>;
  hostId: string;
  currentUserId: string;
}

export default function PlayerList({ players, hostId, currentUserId }: PlayerListProps) {
  // Tri : le Host en premier, puis par date d'arrivée
  const playersArray = Object.entries(players || {}).map(([id, player]) => ({
    id,
    ...player,
  })).sort((a, b) => {
    if (a.id === hostId) return -1;
    if (b.id === hostId) return 1;
    return a.joinedAt - b.joinedAt;
  });

  const renderPlayerItem = ({ item }: { item: typeof playersArray[0] }) => {
    const isHost = item.id === hostId;
    const isMe = item.id === currentUserId;



    return (
      <View style={[styles.playerRow, isMe && styles.meRow]}>
        {/* Identité */}
        <View style={styles.playerInfo}>
          <User size={16} color="#7a5c3a" style={styles.roleIcon} />
          <ExpeditionText variant="mono" size="sm" style={[styles.playerName, isMe && styles.meText]}>
            {item.displayName}
          </ExpeditionText>
        </View>

        {/* Badge Host / État de préparation */}
        <View style={styles.playerStatus}>
          {isHost && (
            <View style={styles.hostBadge}>
              <Crown size={12} color="#e8d5a3" />
              <ExpeditionText variant="mono" size="xs" style={styles.hostText}>HOST</ExpeditionText>
            </View>
          )}
          
          <View style={[styles.readyIndicator, item.isReady ? styles.readyActive : styles.readyInactive]}>
            {item.isReady ? (
              <Check size={14} color="#0d0802" strokeWidth={3} />
            ) : (
              <View style={styles.dotInactive} />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.cardContainer}>
      <ExpeditionText variant="mono" size="xs" style={styles.title}>
        /// JOUEURS CONNECTÉS ({playersArray.length})
      </ExpeditionText>
      
      <FlatList
        data={playersArray}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayerItem}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
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
    marginTop: 16,
  },
  title: {
    color: '#7a5c3a',
    letterSpacing: 2,
    marginBottom: 12,
  },
  listContainer: {
    gap: 8,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(232, 213, 163, 0.01)',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(232, 213, 163, 0.04)',
  },
  meRow: {
    borderColor: 'rgba(232, 213, 163, 0.2)',
    backgroundColor: 'rgba(232, 213, 163, 0.04)',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleIcon: {
    marginRight: 2,
  },
  playerName: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  meText: {
    color: '#e8d5a3',
  },
  playerRoleText: {
    color: '#7a5c3a',
    marginTop: 2,
  },
  playerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 213, 163, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 2,
    gap: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(232, 213, 163, 0.2)',
  },
  hostText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#e8d5a3',
    letterSpacing: 0.5,
  },
  readyIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  readyActive: {
    backgroundColor: '#e8d5a3',
    borderColor: '#e8d5a3',
  },
  readyInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(232, 213, 163, 0.2)',
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(232, 213, 163, 0.15)',
  },
});
