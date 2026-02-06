import { Router } from 'express';
import { TranslationModel } from '../services/storage/TranslationModel.js';
import type { ApiResponse, PaginatedResponse, Translation, TranslationStats } from 'shared';

const router = Router();

// GET /api/translations - All translations (paginated)
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const { translations, total } = TranslationModel.getAll(page, limit);

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
    console.error('Error fetching translations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch translations',
    });
  }
});

// GET /api/translations/stats - Statistics
router.get('/stats', (_req, res) => {
  try {
    const stats = TranslationModel.getStats();

    const response: ApiResponse<TranslationStats> = {
      success: true,
      data: stats,
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
    });
  }
});

export default router;
