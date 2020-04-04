import React from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';

// acesso aos parâmetros enviados para alguma rota {navigation}
function Profile({ navigation }) {
    const githubUsername = navigation.getParam('github_username');

    return <WebView style={{ flex: 1 }} source={{ uri: `https://github.com/${githubUsername}` }} />
}

export default Profile;