import CheckBox from '@react-native-community/checkbox'
import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface CheckBoxProps {
  text: string;
  value: boolean;
  onCheckboxChange: (value: boolean) => void;
}

export const Checkbox: React.FC<CheckBoxProps> = ({ text, value, onCheckboxChange }) => {
 
  return (
    <View style={styles.Container}>
      <CheckBox
        disabled={false}
        value={value}
        onValueChange={(newValue) => onCheckboxChange(newValue)}
        tintColor={'#50c878'}
        tintColors={{ 
          true: '#50c878', 
          false: '#B9B7BD' 
        }}
      />

      <Text>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
