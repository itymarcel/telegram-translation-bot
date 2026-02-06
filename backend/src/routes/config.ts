import { Router } from 'express';
import { ConfigModel } from '../services/storage/ConfigModel.js';
import type { ApiResponse } from 'shared';

const router = Router();

// GET /api/config - Current config
router.get('/', (_req, res) => {
  try {
    const config = ConfigModel.getAll();

    // Remove sensitive data
    const { OPENAI_API_KEY, ...safeConfig } = config;

    const response: ApiResponse<typeof safeConfig> = {
      success: true,
      data: safeConfig,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch config',
    });
  }
});

// PUT /api/config/api-keys - Update OpenAI API key
router.put('/api-keys', (req, res) => {
  try {
    const { openai_api_key } = req.body;

    if (!openai_api_key) {
      res.status(400).json({
        success: false,
        error: 'OpenAI API key is required',
      });
      return;
    }

    ConfigModel.set('OPENAI_API_KEY', openai_api_key);

    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'API key updated successfully' },
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating API key:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update API key',
    });
  }
});

export default router;
