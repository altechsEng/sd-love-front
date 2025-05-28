import { FAMILLY } from '../../utils/constants'
import React from 'react'
import {Text} from 'react-native'


export const CustomRegularPoppingText = ({fontSize,value,color,style}) => {
     return( <Text style={{color:color||'#5E5E5E',fontSize,fontFamily:FAMILLY.regular,...style}}>{`${value}`}</Text>)
}

export const CustomMeduimPoppingText = ({fontSize,value,color,style}) => {
     return <Text style={{color:color||'#5E5E5E',fontSize,fontFamily:FAMILLY.medium,...style}}>{value}</Text>
}

export const CustomSemiBoldPoppingText = ({fontSize,value,color,style}) => {
     return <Text style={{color:color||'#5E5E5E',fontSize,fontFamily:FAMILLY.semibold,...style}}>{value}</Text>
}

export const CustomLightPoppingText = ({fontSize,value,color,style}) => {
     return <Text style={{color:color||'#5E5E5E',fontSize,fontFamily:FAMILLY.light,...style}}>{value}</Text>
}