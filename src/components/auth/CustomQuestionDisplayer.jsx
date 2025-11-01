import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS, FAMILLY, TEXT_SIZE } from '../../utils/constants'

const CustomQuestionDisplayer = ({ answers, direction, onSelect, currentValue }) => {

    let firstStyles = {}
    if (direction == "column") {
        firstStyles = { flexDirection: direction, alignItems: "flex-start", justifyContent: "center" }
    } else {
        firstStyles = { flexDirection: direction, alignItems: "center" }
    }

    return (
        <View style={{ ...firstStyles, marginTop: 10 }}>
            {answers.map((an) => {
                return (
                    <TouchableOpacity key={`${an}`} style={{ marginBottom: direction == "column" ? 10 : 0, flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}
                        onPress={async () => {
                            onSelect(an)
                        }}
                    >
                        <View className={'flex'} style={{ alignItems: "center", justifyContent: "center", marginRight: 10, height: 20, width: 20, borderColor: COLORS.primary, backgroundColor: currentValue == an ? COLORS.primary : 'transparent', borderWidth: 2, borderRadius: 50 }}>
                            {currentValue == an && (
                                <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>
                            )}
                        </View>
                        <Text className={'text-gray-400'} style={{ fontFamily: FAMILLY.regular, fontSize: TEXT_SIZE.medium, marginTop: 2, paddingRight: 20 }}>{an}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

export default CustomQuestionDisplayer