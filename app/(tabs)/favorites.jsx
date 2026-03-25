import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { TabWebView } from "@/components/tab-webview";

const BASE_URL = (
  process.env.EXPO_PUBLIC_WEB_URL || "http://192.168.68.127:80"
).replace(/\/$/, "");

const HEADER_PATHS = ["/", "/home", "/catalog", "/cart", "/favorites"];

function getUrlPath(url) {
  try {
    const path = new URL(url).pathname.replace(/\/+$/, "") || "/";
    return path;
  } catch {
    return "/favorites";
  }
}

export default function FavoritesScreen() {
  const navigation = useNavigation();

  const handleUrlChange = useCallback(
    (url) => {
      const path = getUrlPath(url);
      navigation.setOptions({ headerShown: HEADER_PATHS.includes(path) });
    },
    [navigation]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "bottom"]}>
      <TabWebView url={BASE_URL + "/favorites"} onUrlChange={handleUrlChange} />
    </SafeAreaView>
  );
}
