// In your page file (e.g., app/dashboard/chat/page.js)
import dynamic from 'next/dynamic';

const ChatComponent = dynamic(
  () => import('@/components/ChatComponent'),
  { ssr: false }
);

export default function ChatPage() {
  return <ChatComponent />;
}