// Speech Synthesis & Voice Utilities for V Astra AI

export interface VoiceSettings {
  voiceURI: string;
  pitch: number;
  rate: number;
  volume: number;
}

export const LANGUAGE_CODES: Record<string, { recognition: string; synthesis: string }> = {
  "English (India)": { recognition: "en-IN", synthesis: "en-IN" },
  "English (US)": { recognition: "en-US", synthesis: "en-US" },
  "English (UK)": { recognition: "en-GB", synthesis: "en-GB" },
  "Other English dialects": { recognition: "en-US", synthesis: "en-US" },
  "Malayalam (മലയാളം)": { recognition: "ml-IN", synthesis: "ml-IN" },
  "Hindi (हिंदी)": { recognition: "hi-IN", synthesis: "hi-IN" },
  "Tamil (தமிழ்)": { recognition: "ta-IN", synthesis: "ta-IN" },
  "Telugu (తెలుగు)": { recognition: "te-IN", synthesis: "te-IN" },
  "Bengali (বাংলা)": { recognition: "bn-IN", synthesis: "bn-IN" },
  "Spanish (Español)": { recognition: "es-ES", synthesis: "es-ES" },
  "French (Français)": { recognition: "fr-FR", synthesis: "fr-FR" },
  "German (Deutsch)": { recognition: "de-DE", synthesis: "de-DE" },
  "Italian (Italiano)": { recognition: "it-IT", synthesis: "it-IT" },
  "Japanese (日本語)": { recognition: "ja-JP", synthesis: "ja-JP" },
  "Korean (한국어)": { recognition: "ko-KR", synthesis: "ko-KR" },
  "Russian (Русский)": { recognition: "ru-RU", synthesis: "ru-RU" },
  "Arabic (العربية)": { recognition: "ar-SA", synthesis: "ar-SA" },
  "Portuguese (Português)": { recognition: "pt-BR", synthesis: "pt-BR" },
  "Dutch (Nederlands)": { recognition: "nl-NL", synthesis: "nl-NL" },
  "Chinese, Mandarin (中文)": { recognition: "zh-CN", synthesis: "zh-CN" },
  "Turkish (Türkçe)": { recognition: "tr-TR", synthesis: "tr-TR" },
  "Vietnamese (Tiếng Việt)": { recognition: "vi-VN", synthesis: "vi-VN" },
  "Swedish (Svenska)": { recognition: "sv-SE", synthesis: "sv-SE" },
  "Swahili (Kiswahili)": { recognition: "sw-KE", synthesis: "sw-KE" },
};

export const SAMPLE_PHRASES: Record<string, string> = {
  "Malayalam (മലയാളം)": "നമസ്കാരം! ഞാൻ വി-അസ്ത്ര എഐ ആണ്. ഇതാണ് നിങ്ങളുടെ വോയ്സ് പ്രിവ്യൂ.",
  "ml-IN": "നമസ്കാരം! ഞാൻ വി-അസ്ത്ര എഐ ആണ്. ഇതാണ് നിങ്ങളുടെ വോയ്സ് പ്രിവ്യൂ.",
  "ml": "നമസ്കാരം! ഞാൻ വി-അസ്ത്ര എഐ ആണ്. ഇതാണ് നിങ്ങളുടെ വോയ്സ് പ്രിവ്യൂ.",
  "Hindi (हिंदी)": "नमस्ते! मैं वी-अस्त्रा एआई हूँ। यह आपकी चयनित आवाज़ का पूर्वावलोकन है।",
  "hi-IN": "नमस्ते! मैं वी-अस्त्रा एआई हूँ। यह आपकी चयनित आवाज़ का पूर्वावलोकन है।",
  "hi": "नमस्ते! मैं वी-अस्त्रा एआई हूँ। यह आपकी चयनित आवाज़ का पूर्वावलोकन है।",
  "Tamil (தமிழ்)": "வணக்கம்! நான் வி-அஸ்ட்ரா ஏஐ. இது உங்கள் குரலின் மாதிரி முன்னோட்டம்.",
  "ta-IN": "வணக்கம்! நான் வி-அஸ்ட்ரா ஏஐ. இது உங்கள் குரலின் மாதிரி முன்னோட்டம்.",
  "ta": "வணக்கம்! நான் வி-அஸ்ட்ரா ஏஐ. இது உங்கள் குரலின் மாதிரி முன்னோட்டம்.",
  "Telugu (తెలుగు)": "నమస్కారం! నేను వి-ఆస్ట్రా ఏఐ. ఇది మీ వాయిస్ ప్రివ్యూ.",
  "te-IN": "నమస్కారం! నేను వి-ఆస్ట్రా ఏఐ. ఇది మీ వాయిస్ ప్రివ్యూ.",
  "te": "నమస్కారం! నేను వి-ఆస్ట్రా ఏఐ. ఇది మీ వాయిస్ ప్రివ్యూ.",
  "Bengali (বাংলা)": "নমস্কার! আমি ভি-অ্যাস্ট্রা এআই। এটি আপনার নির্বাচিত ভয়েস প্রিভিউ।",
  "bn-IN": "নমস্কার! আমি ভি-অ্যাস্ট্রা এআই। এটি আপনার নির্বাচিত ভয়েস প্রিভিউ।",
  "bn": "নমস্কার! আমি ভি-অ্যাস্ট্রা এআই। এটি আপনার নির্বাচিত ভয়েস প্রিভিউ।",
  "Spanish (Español)": "¡Hola! Soy V-Astra AI. Esta es una vista previa de la voz seleccionada.",
  "es-ES": "¡Hola! Soy V-Astra AI. Esta es una vista previa de la voz seleccionada.",
  "es": "¡Hola! Soy V-Astra AI. Esta es una vista previa de la voz seleccionada.",
  "French (Français)": "Bonjour ! Je suis V-Astra AI. Ceci est un aperçu de la voix sélectionnée.",
  "fr-FR": "Bonjour ! Je suis V-Astra AI. Ceci est un aperçu de la voix sélectionnée.",
  "fr": "Bonjour ! Je suis V-Astra AI. Ceci est un aperçu de la voix sélectionnée.",
  "German (Deutsch)": "Hallo! Ich bin V-Astra AI. Dies ist eine Vorschau der ausgewählten Stimme.",
  "de-DE": "Hallo! Ich bin V-Astra AI. Dies ist eine Vorschau der ausgewählten Stimme.",
  "de": "Hallo! Ich bin V-Astra AI. Dies ist eine Vorschau der ausgewählten Stimme.",
  "Italian (Italiano)": "Ciao! Sono V-Astra AI. Questa è un'anteprima della voce selezionata.",
  "it-IT": "Ciao! Sono V-Astra AI. Questa è un'anteprima della voce selezionata.",
  "it": "Ciao! Sono V-Astra AI. Questa è un'anteprima della voce selezionata.",
  "Japanese (日本語)": "こんにちは！V-Astra AIです。これは選択された音声のプレビューです。",
  "ja-JP": "こんにちは！V-Astra AIです。これは選択された音声のプレビューです。",
  "ja": "こんにちは！V-Astra AIです。これは選択された音声のプレビューです。",
  "Korean (한국어)": "안녕하세요! V-Astra AI입니다. 선택하신 음성의 미리듣기입니다.",
  "ko-KR": "안녕하세요! V-Astra AI입니다. 선택하신 음성의 미리듣기입니다.",
  "ko": "안녕하세요! V-Astra AI입니다. 선택하신 음성의 미리듣기입니다.",
  "Russian (Русский)": "Здравствуйте! Я V-Astra AI. Это предварительный просмотр выбранного голоса.",
  "ru-RU": "Здравствуйте! Я V-Astra AI. Это предварительный просмотр выбранного голоса.",
  "ru": "Здравствуйте! Я V-Astra AI. Это предварительный просмотр выбранного голоса.",
  "Arabic (العربية)": "مرحباً! أنا في-أسترا الذكاء الاصطناعي. هذه معاينة للصوت المحدد.",
  "ar-SA": "مرحباً! أنا في-أسترا الذكاء الاصطناعي. هذه معاينة للصوت المحدد.",
  "ar": "مرحباً! أنا في-أسترا الذكاء الاصطناعي. هذه معاينة للصوت المحدد.",
  "Portuguese (Português)": "Olá! Eu sou o V-Astra AI. Esta é uma prévia da voz selecionada.",
  "pt-BR": "Olá! Eu sou o V-Astra AI. Esta é uma prévia da voz selecionada.",
  "pt": "Olá! Eu sou o V-Astra AI. Esta é uma prévia da voz selecionada.",
  "Dutch (Nederlands)": "Hallo! Ik ben V-Astra AI. Dit is een voorvertoning van de geselecteerde stem.",
  "nl-NL": "Hallo! Ik ben V-Astra AI. Dit is een voorvertoning van de geselecteerde stem.",
  "nl": "Hallo! Ik ben V-Astra AI. Dit is een voorvertoning van de geselecteerde stem.",
  "Chinese, Mandarin (中文)": "你好！我是 V-Astra AI。这是您所选语音的预览。",
  "zh-CN": "你好！我是 V-Astra AI。这是您所选语音的预览。",
  "zh": "你好！我是 V-Astra AI。这是您所选语音的预览。",
  "Turkish (Türkçe)": "Merhaba! Ben V-Astra AI. Bu, seçtiğiniz sesin bir önizlemesidir.",
  "tr-TR": "Merhaba! Ben V-Astra AI. Bu, seçtiğiniz sesin bir önizlemesidir.",
  "tr": "Merhaba! Ben V-Astra AI. Bu, seçtiğiniz sesin bir önizlemesidir.",
  "Vietnamese (Tiếng Việt)": "Xin chào! Tôi là V-Astra AI. Đây là bản nghe thử giọng đọc đã chọn.",
  "vi-VN": "Xin chào! Tôi là V-Astra AI. Đây là bản nghe thử giọng đọc đã chọn.",
  "vi": "Xin chào! Tôi là V-Astra AI. Đây là bản nghe thử giọng đọc đã chọn.",
  "Swedish (Svenska)": "Hej! Jag är V-Astra AI. Detta är en förhandsvisning av den valda rösten.",
  "sv-SE": "Hej! Jag är V-Astra AI. Detta är en förhandsvisning av den valda rösten.",
  "sv": "Hej! Jag är V-Astra AI. Detta är en förhandsvisning av den valda rösten.",
  "Swahili (Kiswahili)": "Habari! Mimi ni V-Astra AI. Hiki ni kielelezo cha sauti uliyochagua.",
  "sw-KE": "Habari! Mimi ni V-Astra AI. Hiki ni kielelezo cha sauti uliyochagua.",
  "sw": "Habari! Mimi ni V-Astra AI. Hiki ni kielelezo cha sauti uliyochagua.",
  "English (India)": "Hello! I am V-Astra AI. This is a preview of your selected Indian English response voice.",
  "English (UK)": "Hello! I am V-Astra AI. This is a preview of your selected British English voice.",
  "English (US)": "Hello! I am V-Astra AI. This is a preview of your selected AI response voice.",
  "default": "Hello! I am V-Astra AI. This is a preview of your selected AI response voice.",
};

// Global cache for voices
let cachedVoices: SpeechSynthesisVoice[] = [];
let voiceListeners: Array<(voices: SpeechSynthesisVoice[]) => void> = [];

/**
 * Returns currently cached voices, or fetches immediately if available.
 */
export const getCachedVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    if (cachedVoices.length === 0) {
      const list = window.speechSynthesis.getVoices();
      if (list && list.length > 0) {
        cachedVoices = list;
      }
    }
  }
  return cachedVoices;
};

/**
 * Initializes and registers onvoiceschanged listener properly.
 */
export const initVoiceLoading = (onUpdate?: (voices: SpeechSynthesisVoice[]) => void): (() => void) => {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return () => {};
  }

  const handleVoices = () => {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      cachedVoices = list;
      voiceListeners.forEach((fn) => fn(list));
    }
  };

  if (onUpdate) {
    voiceListeners.push(onUpdate);
  }

  // Initial attempt
  handleVoices();

  // Bind onvoiceschanged
  window.speechSynthesis.onvoiceschanged = handleVoices;
  if ("addEventListener" in window.speechSynthesis) {
    window.speechSynthesis.addEventListener("voiceschanged", handleVoices);
  }

  // Fallback poll for browsers where onvoiceschanged fires with delay
  const interval = setInterval(() => {
    const list = window.speechSynthesis.getVoices();
    if (list && list.length > 0) {
      cachedVoices = list;
      voiceListeners.forEach((fn) => fn(list));
      clearInterval(interval);
    }
  }, 200);

  return () => {
    clearInterval(interval);
    if (onUpdate) {
      voiceListeners = voiceListeners.filter((fn) => fn !== onUpdate);
    }
    if ("removeEventListener" in window.speechSynthesis) {
      window.speechSynthesis.removeEventListener("voiceschanged", handleVoices);
    }
  };
};

/**
 * Finds the exact matching voice object from speechSynthesis.getVoices()
 */
export const findMatchingVoice = (
  voices: SpeechSynthesisVoice[],
  selectedVoiceURI: string,
  targetLangNameOrCode?: string
): SpeechSynthesisVoice | undefined => {
  const voiceList = voices && voices.length > 0 ? voices : getCachedVoices();
  if (!voiceList || voiceList.length === 0) return undefined;

  // 1. Direct match by voiceURI or name
  if (selectedVoiceURI && selectedVoiceURI !== "default") {
    const directMatch = voiceList.find(
      (v) => v.voiceURI === selectedVoiceURI || v.name === selectedVoiceURI
    );
    if (directMatch) return directMatch;
  }

  // 2. Language-based match
  if (targetLangNameOrCode) {
    const targetCode =
      LANGUAGE_CODES[targetLangNameOrCode]?.synthesis ||
      targetLangNameOrCode.toLowerCase().replace("_", "-");

    const codeBase = targetCode.split("-")[0].toLowerCase();

    // Exact lang match (e.g., 'ml-IN' === 'ml-in')
    const exactLangMatch = voiceList.find(
      (v) => v.lang.toLowerCase().replace("_", "-") === targetCode.toLowerCase()
    );
    if (exactLangMatch) return exactLangMatch;

    // Prefix lang match (e.g. 'ml' in 'ml-IN')
    const prefixMatch = voiceList.find((v) => {
      const vLang = v.lang.toLowerCase().replace("_", "-");
      return vLang.startsWith(codeBase);
    });
    if (prefixMatch) return prefixMatch;
  }

  return voiceList.find((v) => v.default) || voiceList[0];
};

/**
 * Gets the localized sample phrase for previewing a voice
 */
export const getSamplePhrase = (languageName: string, voice?: SpeechSynthesisVoice): string => {
  if (SAMPLE_PHRASES[languageName]) {
    return SAMPLE_PHRASES[languageName];
  }
  if (voice && voice.lang) {
    const vLang = voice.lang.toLowerCase().replace("_", "-");
    const vPrefix = vLang.split("-")[0];
    if (SAMPLE_PHRASES[voice.lang]) return SAMPLE_PHRASES[voice.lang];
    if (SAMPLE_PHRASES[vLang]) return SAMPLE_PHRASES[vLang];
    if (SAMPLE_PHRASES[vPrefix]) return SAMPLE_PHRASES[vPrefix];
  }
  return SAMPLE_PHRASES["default"];
};

/**
 * Reads voice settings from localStorage
 */
export const getStoredVoiceSettings = (): VoiceSettings => {
  if (typeof window === "undefined") {
    return { voiceURI: "default", pitch: 1.0, rate: 1.0, volume: 1.0 };
  }

  const voiceURI = localStorage.getItem("v_astra_selected_voice") || "default";
  const pitchStr = localStorage.getItem("v_astra_voice_pitch");
  const rateStr = localStorage.getItem("v_astra_voice_rate");
  const volumeStr = localStorage.getItem("v_astra_voice_volume");

  const pitch = pitchStr ? parseFloat(pitchStr) : 1.0;
  const rate = rateStr ? parseFloat(rateStr) : 1.0;
  const volume = volumeStr ? parseFloat(volumeStr) : 1.0;

  return {
    voiceURI,
    pitch: isNaN(pitch) ? 1.0 : pitch,
    rate: isNaN(rate) ? 1.0 : rate,
    volume: isNaN(volume) ? 1.0 : volume,
  };
};

/**
 * Persists voice settings into localStorage
 */
export const saveStoredVoiceSettings = (settings: Partial<VoiceSettings>): void => {
  if (typeof window === "undefined") return;

  if (settings.voiceURI !== undefined) {
    localStorage.setItem("v_astra_selected_voice", settings.voiceURI);
  }
  if (settings.pitch !== undefined) {
    localStorage.setItem("v_astra_voice_pitch", settings.pitch.toString());
  }
  if (settings.rate !== undefined) {
    localStorage.setItem("v_astra_voice_rate", settings.rate.toString());
  }
  if (settings.volume !== undefined) {
    localStorage.setItem("v_astra_voice_volume", settings.volume.toString());
  }
};
