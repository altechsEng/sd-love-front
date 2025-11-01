import { Stack } from "expo-router";
import React from "react";

export default function SettingsLayout() {
    return (
        <React.Fragment>
            <Stack>
                <Stack.Screen name="edit-profile" options={{ title: 'Edit profile' }} />
                <Stack.Screen name="account-security" options={{ title: 'Account security' }} />
            </Stack>
        </React.Fragment>
    );
}