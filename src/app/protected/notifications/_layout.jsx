import { Stack } from "expo-router";
import React from "react";

export default function NotificationLayout() {
    return (
        <React.Fragment>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Notifications' }} />
            </Stack>
        </React.Fragment>
    );
}