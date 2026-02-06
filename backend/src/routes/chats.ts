import { Router } from 'express';
import { ChatModel } from '../services/storage/ChatModel.js';
import { TranslationModel } from '../services/storage/TranslationModel.js';
import type { ApiResponse, PaginatedResponse, Translation } from 'shared';

const router = Router();

// GET /api/chats - List all active chats
router.get('/', (_req, res) => {
  try {
    const chats = ChatModel.getAll();
    const response: ApiResponse<typeof chats> = {
      success: true,
      data: chats,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chats',
    });
  }
});

// GET /api/chats/:chatId - Get chat details
router.get('/:chatId', (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = ChatModel.getById(chatId);

    if (!chat) {
      res.status(404).json({
        success: false,
        error: 'Chat not found',
      });
      return;
    }

    const response: ApiResponse<typeof chat> = {
      success: true,
      data: chat,
    };
    res.json(response);
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat',
    });
  }
});

// GET /api/chats/:chatId/messages - Message history
router.get('/:chatId/messages', (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const { translations, total } = TranslationModel.getByChatId(chatId, page, limit);

    const response: PaginatedResponse<Translation> = {
      success: true,
      data: translations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
});

// PUT /api/chats/:chatId/settings - Update chat settings
router.put('/:chatId/settings', (req, res) => {
  try {
    const { chatId } = req.params;
    const { word_of_hour_enabled, is_active } = req.body;

    const chat = ChatModel.getById(chatId);
    if (!chat) {
      res.status(404).json({
        success: false,
        error: 'Chat not found',
      });
      return;
    }

    ChatModel.updateSettings(chatId, {
      word_of_hour_enabled,
      is_active,
    });

    const updatedChat = ChatModel.getById(chatId);

    const response: ApiResponse<typeof updatedChat> = {
      success: true,
      data: updatedChat,
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating chat settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update chat settings',
    });
  }
});

export default router;
