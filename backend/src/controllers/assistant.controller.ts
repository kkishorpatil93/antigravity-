import { Response } from 'express';
import { AuthenticatedRequest } from '../types/index.js';
import { GeminiService } from '../services/gemini/gemini.service.js';
import { supabaseAdmin } from '../services/supabase/supabase.service.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export async function chat(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { conversationId, message, preferredLanguage = 'en', farmerContext } = req.body;

    let activeConversationId = conversationId;

    // 1. Create conversation if not provided
    if (!activeConversationId) {
      const title = message.slice(0, 45) + (message.length > 45 ? '...' : '');
      const { data: conv, error: convError } = await supabaseAdmin
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title,
          language: preferredLanguage,
        })
        .select()
        .single();

      if (convError || !conv) {
        logger.error('Failed to create conversation:', convError);
        sendError(res, 'DB_ERROR', 'Could not create new chat conversation', 500);
        return;
      }
      activeConversationId = conv.id;
    } else {
      // Verify conversation ownership
      const { data: conv, error: verifyError } = await supabaseAdmin
        .from('chat_conversations')
        .select('id')
        .eq('id', activeConversationId)
        .eq('user_id', userId)
        .maybeSingle();

      if (verifyError || !conv) {
        sendError(res, 'FORBIDDEN', 'Conversation not found or unauthorized', 403);
        return;
      }
    }

    // 2. Fetch past 8 messages for context
    const { data: historyMessages } = await supabaseAdmin
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', activeConversationId)
      .order('created_at', { ascending: true })
      .limit(8);

    const history = (historyMessages || []).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // 3. Save user message to database
    await supabaseAdmin.from('chat_messages').insert({
      conversation_id: activeConversationId,
      user_id: userId,
      role: 'user',
      content: message,
    });

    // 4. Call Gemini AI Chat
    const aiResponse = await GeminiService.generateFarmingChatResponse(
      message,
      history,
      preferredLanguage,
      farmerContext
    );

    // 5. Save assistant reply to database
    await supabaseAdmin.from('chat_messages').insert({
      conversation_id: activeConversationId,
      user_id: userId,
      role: 'assistant',
      content: aiResponse.answer,
    });

    // Touch updated_at on conversation
    await supabaseAdmin
      .from('chat_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', activeConversationId);

    sendSuccess(
      res,
      {
        conversationId: activeConversationId,
        ...aiResponse,
      },
      'Assistant replied successfully'
    );
  } catch (err) {
    logger.error('Exception in assistant chat controller:', err);
    sendError(res, 'AI_ERROR', 'The agricultural assistant is currently unavailable. Please retry.', 500);
  }
}

export async function getConversations(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const { data: conversations, error } = await supabaseAdmin
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      logger.error('Error fetching conversations:', error);
      sendError(res, 'DB_ERROR', 'Failed to retrieve chat conversations', 500);
      return;
    }

    sendSuccess(res, conversations || [], 'Conversations retrieved');
  } catch (err) {
    logger.error('Exception in getConversations:', err);
    sendError(res, 'INTERNAL_ERROR', 'Failed to fetch conversations', 500);
  }
}

export async function createConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { title = 'New Farming Chat', language = 'en' } = req.body;

    const { data: conversation, error } = await supabaseAdmin
      .from('chat_conversations')
      .insert({
        user_id: userId,
        title,
        language,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating conversation:', error);
      sendError(res, 'DB_ERROR', 'Failed to create conversation', 500);
      return;
    }

    sendSuccess(res, conversation, 'Conversation created', 201);
  } catch (err) {
    logger.error('Exception in createConversation:', err);
    sendError(res, 'INTERNAL_ERROR', 'Failed to create conversation', 500);
  }
}

export async function getMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id: conversationId } = req.params;

    // Verify ownership
    const { data: conv } = await supabaseAdmin
      .from('chat_conversations')
      .select('id')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!conv) {
      sendError(res, 'NOT_FOUND', 'Conversation not found', 404);
      return;
    }

    const { data: messages, error } = await supabaseAdmin
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('Error retrieving messages:', error);
      sendError(res, 'DB_ERROR', 'Failed to retrieve messages', 500);
      return;
    }

    sendSuccess(res, messages || [], 'Messages retrieved');
  } catch (err) {
    logger.error('Exception in getMessages:', err);
    sendError(res, 'INTERNAL_ERROR', 'Failed to retrieve messages', 500);
  }
}

export async function deleteConversation(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id: conversationId } = req.params;

    const { error } = await supabaseAdmin
      .from('chat_conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', userId);

    if (error) {
      logger.error('Error deleting conversation:', error);
      sendError(res, 'DB_ERROR', 'Failed to delete conversation', 500);
      return;
    }

    sendSuccess(res, { deleted: true }, 'Conversation deleted successfully');
  } catch (err) {
    logger.error('Exception in deleteConversation:', err);
    sendError(res, 'INTERNAL_ERROR', 'Failed to delete conversation', 500);
  }
}

