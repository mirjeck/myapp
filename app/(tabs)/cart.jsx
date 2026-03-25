import { SafeAreaView } from "react-native-safe-area-context";
import { TabWebView } from "@/components/tab-webview";

const BASE_URL = (
  process.env.EXPO_PUBLIC_WEB_URL || "http://192.168.68.127:80"
).replace(/\/$/, "");

export default function CartScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top", "bottom"]}>
      <TabWebView url={BASE_URL + "/cart"} />
    </SafeAreaView>
  );
}
