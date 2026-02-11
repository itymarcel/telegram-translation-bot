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
    // Check for Italian indicators. If not Italian, assume English.
    const italianIndicators = [
      // Italian-specific accented characters
      'è', 'à', 'ì', 'ò', 'ù', 'é',
      // Articles
      'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una',
      // Common prepositions
      'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra', 'del', 'dello', 'della', 'dei', 'degli', 'delle',
      'al', 'allo', 'alla', 'ai', 'agli', 'alle', 'dal', 'dallo', 'dalla', 'dai', 'dagli', 'dalle',
      'nel', 'nello', 'nella', 'nei', 'negli', 'nelle', 'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle',
      // Common verbs and conjugations
      'sono', 'sei', 'è', 'siamo', 'siete', 'essere', 'ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno', 'avere',
      'faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno', 'fare',
      'vado', 'vai', 'va', 'andiamo', 'andate', 'vanno', 'andare',
      'dico', 'dici', 'dice', 'diciamo', 'dite', 'dicono', 'dire',
      'vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono', 'venire',
      'posso', 'puoi', 'può', 'possiamo', 'potete', 'possono', 'potere',
      'voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono', 'volere',
      'devo', 'devi', 'deve', 'dobbiamo', 'dovete', 'devono', 'dovere',
      // Common pronouns
      'io', 'tu', 'lui', 'lei', 'noi', 'voi', 'loro', 'mi', 'ti', 'si', 'ci', 'vi',
      'me', 'te', 'se', 'lo', 'gli', 'ne',
      // Common adjectives
      'bello', 'bella', 'buono', 'buona', 'grande', 'piccolo', 'piccola', 'nuovo', 'nuova', 'vecchio', 'vecchia',
      'molto', 'molta', 'molti', 'molte', 'poco', 'poca', 'pochi', 'poche', 'tutto', 'tutta', 'tutti', 'tutte',
      // Common words
      'che', 'ma', 'o', 'e', 'anche', 'quando', 'dove', 'come', 'perché', 'se',
      'questo', 'questa', 'questi', 'queste', 'quello', 'quella', 'quelli', 'quelle',
      'più', 'meno', 'ancora', 'già', 'sempre', 'mai', 'non', 'sì', 'no',
      // Common nouns
      'casa', 'giorno', 'tempo', 'anno', 'vita', 'uomo', 'donna', 'bambino', 'bambina',
      'ciao', 'grazie', 'prego', 'scusa', 'per favore', 'buongiorno', 'buonasera', 'arrivederci'
    ];

    const lowerText = text.toLowerCase();
    let italianScore = 0;

    for (const indicator of italianIndicators) {
      if (lowerText.includes(indicator)) {
        italianScore++;
      }
    }

    // If we found Italian indicators, it's Italian
    if (italianScore > 0) {
      return { language: 'it', confidence: Math.min(italianScore / 3, 1) };
    }

    // Otherwise, it's English
    return { language: 'en', confidence: 1 };
  }

  async translate(text: string, sourceLang: Language, targetLang: Language): Promise<string> {
    // Check cache first
    const cached = TranslationModel.getCached(text, sourceLang, targetLang);
    if (cached) {
      console.log('Using cached translation');
      return cached;
    }

    const targetLangName = targetLang === 'it' ? 'Italian' : 'English';

    try {
      // Always provide Italian learning context regardless of input language
      const systemPrompt = `You are an expert Italian language teacher. When translating between Italian and English, always provide educational context to help learn Italian.

For the Italian ${sourceLang === 'it' ? 'input' : 'translation'}, provide:

1. **Translation**: The accurate ${targetLangName} translation (NEVER include brackets or placeholders, always provide the actual translation)
2. **Related Italian Words**: 3-4 Italian words from the same context or topic (NOT synonyms for "other ways to say it", but related vocabulary). Format: "Italian word - English meaning"
3. **Other Ways to Say It**: 2-3 alternative Italian phrases with the same or similar meaning. Format: "Italian phrase - English translation"

Format your response EXACTLY like this:
🔤 Translation
[The actual ${targetLangName} translation here]

📚 Related Italian Words
• [Italian word 1] - [English meaning 1]
• [Italian word 2] - [English meaning 2]
• [Italian word 3] - [English meaning 3]
• [Italian word 4] - [English meaning 4]

🔄 Other Ways to Say It
• [Italian alternative 1] - [English translation 1]
• [Italian alternative 2] - [English translation 2]
• [Italian alternative 3] - [English translation 3]

Example:
If input is "All good?":

🔤 Translation
Tutto bene?

📚 Related Italian Words
• bene - well/good
• male - bad
• così così - so-so
• benissimo - very well

🔄 Other Ways to Say It
• Va tutto bene? - Is everything okay?
• Tutto a posto? - Everything in order?
• Come va? - How's it going?

Keep it concise and practical. Focus on useful vocabulary for learning Italian.`;

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
    const { language: sourceLang } = await this.detectLanguage(text);
    const targetLang: Language = sourceLang === 'it' ? 'en' : 'it';
    const translation = await this.translate(text, sourceLang, targetLang);

    return { translation, sourceLang, targetLang };
  }
}
