import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

type Params = {
  id: string;
};

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<Params>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Event ID: {id}</Text>
    </View>
  );
}
