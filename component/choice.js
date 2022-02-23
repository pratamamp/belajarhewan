import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {items} from '../config';

export default function Choice({idHewan, pressHandler, status}) {
  const animal = items.find(el => el.id === idHewan);

  return (
    <TouchableOpacity
      onPress={pressHandler(status)}
      style={{
        height: 250,
        width: 250,
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
      <Image
        source={animal.image}
        style={{
          width: '100%',
          height: '100%',
        }}
        blurRadius={0}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}
