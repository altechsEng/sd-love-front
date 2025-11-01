import { useRoute } from "@react-navigation/native"
import { View, TouchableOpacity } from "react-native"
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useGlobalVariable } from "../../context/global"
import { CustomRegularPoppingText, CustomSemiBoldPoppingText } from "../../components/text";
import { SucessScreenTick } from "../../components/vectors";
import { TEXT_SIZE } from "../../utils/constants";
import Entypo from '@expo/vector-icons/Entypo';

const Accademy = ({ navigation }) => {

    return (
        <View style={{ flex: 1, backgroundColor: "white", padding: 20, alignItems: "center", justifyContent: "center" }}>

            <View style={{ flex: 5, alignItems: "center", justifyContent: "center" }}>
                <View style={{ height: hp("10%"), marginBottom: 15, width: hp("10%"), borderRadius: "100%", alignItems: "center", justifyContent: "center" }}>
                    <Entypo name="open-book" size={64} color="gray" />
                </View>
                <CustomSemiBoldPoppingText value={`In development`} style={{ textTransform: "capitalize" }} fontSize={TEXT_SIZE.primary + 2} color={"black"} />
                <CustomRegularPoppingText style={{ width: wp("85%"), marginTop: 5, textAlign: "center" }} value={"This module is corrently under contruction"} fontSize={TEXT_SIZE.medium} color={"gray"} />

            </View>

        </View>
    )
}

export default Accademy