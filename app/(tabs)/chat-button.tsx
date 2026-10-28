import { Redirect } from 'expo-router';
/** Placeholder route for the middle tab; the tab button itself opens /chat. */
export default function ChatTab() {
  return <Redirect href="/chat" />;
}
