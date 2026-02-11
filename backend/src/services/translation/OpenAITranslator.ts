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
      'il', 'la', 'lo', 'gli', 'le', 'di', 'da', 'in', 'su', 'a',
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
      let systemPrompt: string;

      if (sourceLang === 'en') {
        // English to Italian: Just provide the translation
        systemPrompt = `You are an expert translator. Translate the following English text to Italian. Provide ONLY the translation, nothing else.`;
      } else {
        // Italian to English: Provide translation with practical usage context
        systemPrompt = `You are an expert language teacher specializing in ${sourceLangName} and ${targetLangName}. When translating, provide:

1. **Translation**: The accurate translation
2. **Usage Context**: How and when to use this phrase/word in real situations (e.g., formal vs informal settings, common scenarios)
3. **Example Situations**: 2-3 brief examples of when you'd use this

Format your response like this:
🔤 Translation
[The translation]

💡 How to Use It
[Practical usage context - when and how to use this in conversation]

📝 Example Situations
• [situation 1]
• [situation 2]
• [situation 3]

Keep it concise and practical. Focus on real-world usage rather than grammar theory.`;
      }

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
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
