import { Stack } from "expo-router";
import React from "react";

export default function SettingsLayout() {
    return (
        <React.Fragment>
            <Stack>
                <Stack.Screen name="chat-discussion-options" options={{ title: 'Edit profile' }} />
                <Stack.Screen name="chat-discussion" options={{ title: 'Account security' }} />
                <Stack.Screen name="engagement-requests" options={{ title: 'Engagement requests' }} />
            </Stack>
        </React.Fragment>
    );
}