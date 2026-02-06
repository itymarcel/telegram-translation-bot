import OpenAI from 'openai';
import type { Language, DetectedLanguage } from 'shared';
import { TranslationModel } from '../storage/TranslationModel.js';

export class OpenAITranslator {
  private openai: OpenAI;
  private model: string;

  constructor(apiKey: string, model = 'gpt-4-turbo-preview') {
    this.openai = new OpenAI({ apiKey });
    this.model = model;
  }

  async detectLanguage(text: string): Promise<DetectedLanguage> {
    // Simple heuristic: check for Italian-specific characters and common words
    const italianIndicators = [
      'è', 'à', 'ì', 'ò', 'ù',
      'che', 'per', 'una', 'sono', 'con', 'della', 'dei', 'nel', 'anche',
      'questo', 'questa', 'molto', 'più', 'può', 'però'
    ];

    const englishIndicators = [
      'the', 'is', 'are', 'was', 'were', 'been', 'have', 'has', 'had',
      'this', 'that', 'these', 'those', 'with', 'from', 'about'
    ];

    const lowerText = text.toLowerCase();

    let italianScore = 0;
    let englishScore = 0;

    for (const indicator of italianIndicators) {
      if (lowerText.includes(indicator)) {
        italianScore++;
      }
    }

    for (const indicator of englishIndicators) {
      if (lowerText.includes(indicator)) {
        englishScore++;
      }
    }

    // If no clear indicators, use OpenAI for detection
    if (italianScore === 0 && englishScore === 0) {
      try {
        const response = await this.openai.chat.completions.create({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a language detector. Respond with only "it" for Italian or "en" for English.',
            },
            {
              role: 'user',
              content: `Detect the language of this text: "${text}"`,
            },
          ],
          temperature: 0,
          max_tokens: 10,
        });

        const detected = response.choices[0]?.message?.content?.trim().toLowerCase();
        if (detected === 'it' || detected === 'en') {
          return { language: detected as Language, confidence: 0.8 };
        }
      } catch (error) {
        console.error('Error detecting language with OpenAI:', error);
      }

      return { language: 'unknown', confidence: 0 };
    }

    if (italianScore > englishScore) {
      return { language: 'it', confidence: Math.min(italianScore / 3, 1) };
    } else if (englishScore > italianScore) {
      return { language: 'en', confidence: Math.min(englishScore / 3, 1) };
    }

    return { language: 'unknown', confidence: 0 };
  }

  async translate(text: string, sourceLang: Language, targetLang: Language): Promise<string> {
    // Check cache first
    const cached = TranslationModel.getCached(text, sourceLang, targetLang);
    if (cached) {
      console.log('Using cached translation');
      return cached;
    }

    const sourceLangName = sourceLang === 'it' ? 'Italian' : 'English';
    const targetLangName = targetLang === 'it' ? 'Italian' : 'English';

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert language teacher specializing in ${sourceLangName} and ${targetLangName}. When translating, provide:

1. **Translation**: The accurate translation
2. **Context**: Brief explanation of usage or meaning
3. **Related Words**: 2-3 related vocabulary words
4. **Alternatives**: Other ways to express the same idea
5. **Grammar Note**: Any interesting conjugation, formation, or linguistic notes

Format your response like this:
🔤 Translation
[The translation]

💡 Context
[Brief context or usage note]

📚 Related Words
• [word 1] - [meaning]
• [word 2] - [meaning]

🔄 Alternatives
• [alternative phrase 1]
• [alternative phrase 2]

📖 Grammar Note
[Any interesting grammatical or linguistic insight]

Keep it concise and educational. If the input is a single word, focus on vocabulary and usage. If it's a sentence, focus on context and alternatives.`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 800,
      });

      const translation = response.choices[0]?.message?.content?.trim();

      if (!translation) {
        throw new Error('No translation received from OpenAI');
      }

      // Cache the translation
      TranslationModel.cache(text, translation, sourceLang, targetLang);

      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error(`Failed to translate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async translateWithDetection(text: string): Promise<{ translation: string; sourceLang: Language; targetLang: Language }> {
    const { language: sourceLang, confidence } = await this.detectLanguage(text);

    if (sourceLang === 'unknown' || confidence < 0.5) {
      throw new Error('Could not reliably detect language');
    }

    const targetLang: Language = sourceLang === 'it' ? 'en' : 'it';
    const translation = await this.translate(text, sourceLang, targetLang);

    return { translation, sourceLang, targetLang };
  }
}
