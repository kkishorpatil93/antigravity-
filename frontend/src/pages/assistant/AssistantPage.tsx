import React, { useEffect, useRef, useState } from 'react';
import { api } from '../../services/api';
import { ChatConversation, ChatMessage as ChatMessageType, ChatApiResponse } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { ChatInput } from '../../components/chat/ChatInput';
import { TypingIndicator } from '../../components/chat/TypingIndicator';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';
import {
  MessageSquareText,
  Plus,
  Trash2,
  Sprout,
  HelpCircle,
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const { profile } = useAuth();
  const { language, t } = useLanguage();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [latestAiResponse, setLatestAiResponse] = useState<ChatApiResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // Load conversations
  useEffect(() => {
    api.assistant
      .conversations()
      .then((data) => {
        setConversations(data);
        if (data.length > 0) {
          setActiveConvId(data[0].id);
        }
      })
      .catch((err) => console.warn('Could not load conversations:', err))
      .finally(() => setLoadingConv(false));
  }, []);

  // Load messages for active conversation
  useEffect(() => {
    if (activeConvId) {
      setLoadingMessages(true);
      api.assistant
        .messages(activeConvId)
        .then((data) => setMessages(data))
        .catch((err) => console.warn('Could not load messages:', err))
        .finally(() => setLoadingMessages(false));
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  const handleCreateNew = async () => {
    try {
      const conv = await api.assistant.createConversation('New Agronomy Chat');
      setConversations((prev) => [conv, ...prev]);
      setActiveConvId(conv.id);
      setMessages([]);
      setLatestAiResponse(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not create new chat');
    }
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this chat conversation?')) return;
    try {
      await api.assistant.deleteConversation(convId);
      const remaining = conversations.filter((c) => c.id !== convId);
      setConversations(remaining);
      if (activeConvId === convId) {
        setActiveConvId(remaining[0]?.id || null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not delete conversation');
    }
  };

  const handleSendMessage = async (text: string) => {
    setErrorMsg(null);
    setSending(true);

    const tempUserMsg: ChatMessageType = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConvId || '',
      user_id: profile?.id || '',
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await api.assistant.chat({
        conversationId: activeConvId || undefined,
        message: text,
        preferredLanguage: language,
        farmerContext: profile
          ? {
              district: profile.district,
              state: profile.state,
              soilType: profile.soil_type,
              farmArea: profile.farm_area,
            }
          : undefined,
      });

      if (!activeConvId) {
        setActiveConvId(response.conversationId);
        // Refresh conversation list
        api.assistant.conversations().then((data) => setConversations(data));
      }

      setLatestAiResponse(response);

      const assistantMsg: ChatMessageType = {
        id: `asst-${Date.now()}`,
        conversation_id: response.conversationId,
        user_id: profile?.id || '',
        role: 'assistant',
        content: response.answer,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to get answer from assistant');
    } finally {
      setSending(false);
    }
  };

  const defaultStarterQuestions =
    language === 'kn'
      ? [
          'ಟೊಮೆಟೊ ಬೆಳೆಯ ಎಲೆ ಮುದುರು ರೋಗವನ್ನು ಹೇಗೆ ತಡೆಯುವುದು?',
          'ಖಾರಿಫ್ ಹಂಗಾಮಿನಲ್ಲಿ ರಾಗಿ ಬಿತ್ತನೆಗೆ ಸೂಕ್ತ ಸಮಯ ಯಾವುದು?',
          'ಹನಿ ನೀರಾವರಿ ಪದ್ಧತಿಯಲ್ಲಿ ಗೊಬ್ಬರ ನೀಡುವುದು (ಫರ್ಟಿಗೇಷನ್) ಹೇಗೆ?',
          'ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಲು ಹಸಿರೆಲೆ ಗೊಬ್ಬರಗಳು ಯಾವುವು?',
        ]
      : [
          'How do I manage leaf curl virus in tomatoes organically?',
          'What is the optimal sowing window for Ragi in Kharif season?',
          'How to calculate water requirement for drip irrigation?',
          'What are the best biofertilizers for improving soil health?',
        ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 h-[calc(100vh-8.5rem)] flex flex-col">
      <div className="flex items-center justify-between pb-2 border-b border-earth-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-agri-700 text-white flex items-center justify-center shadow-2xs">
            <MessageSquareText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-agri-950">
              {t.nav.assistant}
            </h1>
            <p className="text-[11px] text-gray-500">
              Instant, practical answers in Kannada or English
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleCreateNew}
          icon={<Plus className="w-4 h-4" />}
        >
          New Chat
        </Button>
      </div>

      {errorMsg && (
        <Alert type="danger" className="py-2 text-xs">
          {errorMsg}
        </Alert>
      )}

      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left: Conversation List (Desktop) */}
        <div className="hidden md:flex flex-col w-64 bg-white rounded-xl border border-earth-100 shadow-2xs p-3 space-y-1 overflow-y-auto flex-shrink-0">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1 block">
            Chat Sessions
          </span>
          {conversations.length === 0 && !loadingConv ? (
            <p className="text-xs text-gray-400 p-2">No prior chats.</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setActiveConvId(conv.id);
                  setLatestAiResponse(null);
                }}
                className={`group flex items-center justify-between p-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  activeConvId === conv.id
                    ? 'bg-agri-100 text-agri-900 font-semibold'
                    : 'text-gray-600 hover:bg-cream-100 hover:text-agri-900'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquareText className="w-3.5 h-3.5 flex-shrink-0 text-agri-700" />
                  <span className="truncate">{conv.title}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity"
                  title="Delete chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right: Message Stream & Input */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-earth-100 shadow-2xs overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.length === 0 && !loadingMessages ? (
              <div className="flex flex-col items-center justify-center text-center h-full max-w-md mx-auto py-8">
                <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center mb-3">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-agri-950 mb-1">
                  How can I help your farm today?
                </h3>
                <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                  Ask about planting times, pest control remedies, soil amendments, or weather advice in Karnataka.
                </p>

                <div className="space-y-2 w-full text-left">
                  <span className="text-[11px] font-semibold text-gray-400 block px-1">
                    Try asking:
                  </span>
                  {defaultStarterQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left text-xs p-2.5 rounded-lg border border-earth-100 bg-cream-50 hover:bg-agri-50 hover:border-agri-200 text-gray-800 transition-colors flex items-center gap-2"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-agri-600 flex-shrink-0" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <ChatMessage
                    key={msg.id || idx}
                    message={msg}
                    followUpQuestions={
                      msg.role === 'assistant' && idx === messages.length - 1
                        ? latestAiResponse?.followUpQuestions
                        : undefined
                    }
                    warnings={
                      msg.role === 'assistant' && idx === messages.length - 1
                        ? latestAiResponse?.warnings
                        : undefined
                    }
                    onSelectFollowUp={(q) => handleSendMessage(q)}
                  />
                ))}
                {sending && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-3 bg-cream-50/60 border-t border-earth-100">
            <ChatInput onSendMessage={handleSendMessage} isLoading={sending} />
          </div>
        </div>
      </div>
    </div>
  );
};

