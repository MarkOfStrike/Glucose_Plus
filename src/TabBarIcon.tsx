import { Ionicons } from '@expo/vector-icons';
import React from 'react'

const TabBarIcon = (props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) => {
  return <Ionicons size={25} style={{ marginBottom: -3 }} {...props} />;
}

export default TabBarIcon;