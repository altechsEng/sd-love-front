import { Tabs } from 'expo-router';
import {
    BottomTabsIconActive_Chats,
    BottomTabsIconActive_Heart,
    BottomTabsIconActive_Home,
    BottomTabsIconActive_Learn,
    BottomTabsIconActive_Profile,
    BottomTabsIconInactive_Chats,
    BottomTabsIconInactive_Heart,
    BottomTabsIconInactive_Home,
    BottomTabsIconInactive_Learn,
    BottomTabsIconInactive_Profile,
    ProfileScreenBars
} from "../../../components/vectors";
import { FAMILLY } from '../../../utils/constants';
import CustomProfileScreenHeader from '../../../components/customProfileScreenHeader';

export default function PrivateLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{
                // headerShown: false,
                tabBarIcon: (({ _, focused }) => (
                    focused == false ? <BottomTabsIconInactive_Home /> : <BottomTabsIconActive_Home />
                )),
                tabBarLabelStyle: {
                    fontFamily: FAMILLY.regular,
                },
            }} />
            <Tabs.Screen name="matches" options={{
                headerShown: false,
                title: 'Matches',
                tabBarIcon: (({ _, focused }) => (
                    focused == false ? <BottomTabsIconInactive_Heart /> : <BottomTabsIconActive_Heart />
                )),
                tabBarLabelStyle: {
                    fontFamily: FAMILLY.regular,
                },
            }} />
            <Tabs.Screen name="chat" options={{
                // headerShown: false,
                title: 'Chat',
                tabBarIcon: (({ _, focused }) => (
                    focused == false ? <BottomTabsIconInactive_Chats /> : <BottomTabsIconActive_Chats />
                )),
                tabBarLabelStyle: {
                    fontFamily: FAMILLY.regular,
                },
            }} />
            <Tabs.Screen name="profile" options={{
                // headerShown: false,
                title: 'Profile',
                tabBarIcon: (({ _, focused }) => (
                    focused == false ? <BottomTabsIconInactive_Profile /> : <BottomTabsIconActive_Profile />
                )),
                tabBarLabelStyle: {
                    fontFamily: FAMILLY.regular,
                },
                // header: ({ navigation }) => {
                //     return <CustomProfileScreenHeader navigation={navigation} />
                // }
            }} />
        </Tabs>
    );
}