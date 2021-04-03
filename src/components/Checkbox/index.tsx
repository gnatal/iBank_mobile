import CheckBox from '@react-native-community/checkbox'
import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface CheckBoxProps {
  text: string;
}

export const Checkbox: React.FC<CheckBoxProps> = ({ text }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  
  return (
    <View style={styles.Container}>
      <CheckBox
        disabled={false}
        value={toggleCheckBox}
        onValueChange={(newValue) => setToggleCheckBox(newValue)}
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
