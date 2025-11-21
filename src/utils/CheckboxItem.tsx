import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

interface CheckboxItemProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({
  label,
  selected,
  onPress,
  disabled = false,
}) => (
  <TouchableOpacity
    onPress={!disabled ? onPress : undefined}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 1.8,
        borderColor: selected ? '#047857' : '#ccc',
        backgroundColor: selected ? '#047857' : '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
      }}
    >
      {selected && (
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>✓</Text>
      )}
    </View>
    <Text
      style={{
        color: '#333',
        fontWeight: selected ? '600' : '400',
        fontSize: 15,
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

export default CheckboxItem;
