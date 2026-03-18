import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, Pressable, View } from 'react-native';
import { WebView } from 'react-native-webview';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';

const ONBOARDING_PHONE_URL = 'https://shop.miobeauty.uz/';

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    parsed.search = '';
    const path = parsed.pathname.replace(/\/+$/, '');
    parsed.pathname = path === '' ? '/' : path;
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return String(url ?? '').replace(/\/+$/, '');
  }
}

export default function OnboardingPhoneScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const webViewRef = useRef(null);
  const [navState, setNavState] = useState({ canGoBack: false, url: ONBOARDING_PHONE_URL });

  const normalizedHomeUrl = useMemo(() => normalizeUrl(ONBOARDING_PHONE_URL), []);
  const normalizedCurrentUrl = useMemo(() => normalizeUrl(navState.url), [navState.url]);
  const canGoBackInWebView = navState.canGoBack && normalizedCurrentUrl !== normalizedHomeUrl;

  const handleBackPress = useCallback(() => {
    if (canGoBackInWebView) {
      webViewRef.current?.goBack();
      return true;
    }

    if (Platform.OS === 'android') {
      BackHandler.exitApp();
      return true;
    }

    if (typeof router.canGoBack === 'function' && router.canGoBack()) {
      router.back();
      return true;
    }

    return true;
  }, [canGoBackInWebView, router]);

  const onNavigationStateChange = useCallback((nextNavState) => {
    setNavState({ canGoBack: nextNavState.canGoBack, url: nextNavState.url });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={handleBackPress}
          hitSlop={10}
          style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
          <MaterialIcons
            name={Platform.OS === 'ios' ? 'arrow-back-ios-new' : 'arrow-back'}
            size={22}
            color="#000"
          />
        </Pressable>
      ),
    });
  }, [navigation, handleBackPress]);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;

      const sub = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => sub.remove();
    }, [handleBackPress]),
  );

  const webOrigin = useMemo(() => {
    try {
      return new URL(ONBOARDING_PHONE_URL).origin;
    } catch {
      return null;
    }
  }, []);

  const onShouldStartLoadWithRequest = useCallback(
    (request) => {
      const nextUrl = request?.url;
      if (!nextUrl) return true;

      if (webOrigin && nextUrl.startsWith(webOrigin)) {
        return true;
      }

      openBrowserAsync(nextUrl).catch(() => {});
      return false;
    },
    [webOrigin],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <WebView
        ref={webViewRef}
        source={{ uri: ONBOARDING_PHONE_URL }}
        onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        setSupportMultipleWindows={false}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
