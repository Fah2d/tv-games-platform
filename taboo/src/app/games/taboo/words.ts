import type { TabooCard, TabooDifficulty } from './types'

export const TABOO_CARDS: TabooCard[] = [
  // ── سهل ───────────────────────────────────────────────────────────────────
  { id: 1,  targetWord: 'بيت',         tabooWords: ['غرفة', 'باب', 'سقف', 'حائط', 'عائلة'],        difficulty: 'Easy' },
  { id: 2,  targetWord: 'سيارة',       tabooWords: ['طريق', 'محرك', 'عجلة', 'قيادة', 'وقود'],       difficulty: 'Easy' },
  { id: 3,  targetWord: 'كتاب',        tabooWords: ['قراءة', 'صفحة', 'قصة', 'مكتبة', 'مؤلف'],       difficulty: 'Easy' },
  { id: 4,  targetWord: 'ماء',         tabooWords: ['شرب', 'بحر', 'نهر', 'مطر', 'عطش'],            difficulty: 'Easy' },
  { id: 5,  targetWord: 'شمس',         tabooWords: ['نور', 'حرارة', 'سماء', 'يوم', 'ضوء'],          difficulty: 'Easy' },
  { id: 6,  targetWord: 'قلم',         tabooWords: ['كتابة', 'ورقة', 'حبر', 'مدرسة', 'رسم'],        difficulty: 'Easy' },
  { id: 7,  targetWord: 'تلفاز',       tabooWords: ['شاشة', 'برامج', 'قناة', 'جهاز', 'مشاهدة'],     difficulty: 'Easy' },
  { id: 8,  targetWord: 'خبز',         tabooWords: ['أكل', 'مطبخ', 'قمح', 'دقيق', 'وجبة'],          difficulty: 'Easy' },
  { id: 9,  targetWord: 'سمكة',        tabooWords: ['بحر', 'ماء', 'صيد', 'شبكة', 'محيط'],           difficulty: 'Easy' },
  { id: 10, targetWord: 'نجمة',        tabooWords: ['سماء', 'ليل', 'فضاء', 'لمعان', 'كوكب'],        difficulty: 'Easy' },
  { id: 11, targetWord: 'قمر',         tabooWords: ['ليل', 'سماء', 'نجوم', 'أرض', 'مستدير'],        difficulty: 'Easy' },
  { id: 12, targetWord: 'مطر',         tabooWords: ['غيوم', 'ماء', 'مظلة', 'رطوبة', 'عاصفة'],       difficulty: 'Easy' },
  { id: 13, targetWord: 'مدرسة',       tabooWords: ['تعلم', 'فصل', 'معلم', 'طالب', 'واجب'],         difficulty: 'Easy' },
  { id: 14, targetWord: 'مستشفى',      tabooWords: ['دكتور', 'مريض', 'ممرضة', 'دواء', 'علاج'],      difficulty: 'Easy' },
  { id: 15, targetWord: 'طائرة',       tabooWords: ['سماء', 'مطار', 'ركاب', 'أجنحة', 'رحلة'],       difficulty: 'Easy' },
  { id: 16, targetWord: 'ثلج',         tabooWords: ['بارد', 'أبيض', 'شتاء', 'جليد', 'جبال'],        difficulty: 'Easy' },
  { id: 17, targetWord: 'كرة',         tabooWords: ['ركل', 'ملعب', 'هدف', 'فريق', 'لعب'],           difficulty: 'Easy' },
  { id: 18, targetWord: 'نوم',         tabooWords: ['سرير', 'ليل', 'حلم', 'راحة', 'وسادة'],          difficulty: 'Easy' },
  { id: 19, targetWord: 'شجرة',        tabooWords: ['أوراق', 'غابة', 'خشب', 'جذور', 'ظل'],          difficulty: 'Easy' },
  { id: 20, targetWord: 'نار',         tabooWords: ['دخان', 'لهب', 'حرارة', 'حريق', 'خطر'],         difficulty: 'Easy' },
  { id: 21, targetWord: 'موسيقى',      tabooWords: ['أغنية', 'صوت', 'إيقاع', 'آلة', 'طرب'],         difficulty: 'Easy' },
  { id: 22, targetWord: 'قط',          tabooWords: ['فأر', 'مواء', 'أليف', 'فراء', 'مخالب'],         difficulty: 'Easy' },
  { id: 23, targetWord: 'بحر',         tabooWords: ['موج', 'شاطئ', 'سمك', 'سفينة', 'أزرق'],         difficulty: 'Easy' },
  { id: 24, targetWord: 'هاتف',        tabooWords: ['اتصال', 'رسالة', 'شاشة', 'نغمة', 'شبكة'],      difficulty: 'Easy' },
  { id: 25, targetWord: 'باب',         tabooWords: ['فتح', 'قفل', 'دخول', 'خشب', 'مفتاح'],          difficulty: 'Easy' },

  // ── متوسط ─────────────────────────────────────────────────────────────────
  { id: 26, targetWord: 'برج',         tabooWords: ['مرتفع', 'بناية', 'طابق', 'حارس', 'ارتفاع'],    difficulty: 'Medium' },
  { id: 27, targetWord: 'بركان',       tabooWords: ['حمم', 'جبل', 'انفجار', 'ثوران', 'دمار'],       difficulty: 'Medium' },
  { id: 28, targetWord: 'جواز',        tabooWords: ['سفر', 'هوية', 'تأشيرة', 'حدود', 'دولة'],       difficulty: 'Medium' },
  { id: 29, targetWord: 'مطار',        tabooWords: ['رحلة', 'طائرة', 'بوابة', 'تذكرة', 'ركاب'],     difficulty: 'Medium' },
  { id: 30, targetWord: 'ذكاء',        tabooWords: ['عقل', 'تفكير', 'موهبة', 'فهم', 'نجاح'],        difficulty: 'Medium' },
  { id: 31, targetWord: 'كاميرا',      tabooWords: ['صورة', 'تصوير', 'عدسة', 'ذاكرة', 'فلاش'],      difficulty: 'Medium' },
  { id: 32, targetWord: 'قاموس',       tabooWords: ['كلمات', 'تعريف', 'لغة', 'أبجدية', 'بحث'],      difficulty: 'Medium' },
  { id: 33, targetWord: 'فنار',        tabooWords: ['بحر', 'ضوء', 'ساحل', 'مرشد', 'سفينة'],         difficulty: 'Medium' },
  { id: 34, targetWord: 'بوصلة',       tabooWords: ['اتجاه', 'شمال', 'جنوب', 'خريطة', 'ملاح'],      difficulty: 'Medium' },
  { id: 35, targetWord: 'مزاد',        tabooWords: ['بيع', 'عطاء', 'سعر', 'مزايدة', 'مشتري'],       difficulty: 'Medium' },
  { id: 36, targetWord: 'غواصة',       tabooWords: ['أعماق', 'غوص', 'بحرية', 'أسماك', 'تحت الماء'], difficulty: 'Medium' },
  { id: 37, targetWord: 'إعصار',       tabooWords: ['رياح', 'دوران', 'تدمير', 'طوارئ', 'موسمي'],    difficulty: 'Medium' },
  { id: 38, targetWord: 'متحف',        tabooWords: ['تاريخ', 'معروضات', 'فن', 'زوار', 'قطع'],       difficulty: 'Medium' },
  { id: 39, targetWord: 'لقاح',        tabooWords: ['إبرة', 'مرض', 'مناعة', 'وقاية', 'طبيب'],       difficulty: 'Medium' },
  { id: 40, targetWord: 'ثورة',        tabooWords: ['تغيير', 'شعب', 'انتفاضة', 'تاريخ', 'مطالب'],   difficulty: 'Medium' },
  { id: 41, targetWord: 'خريطة',       tabooWords: ['طريق', 'جغرافيا', 'بلد', 'أماكن', 'رحلة'],     difficulty: 'Medium' },
  { id: 42, targetWord: 'مسرح',        tabooWords: ['عرض', 'ممثل', 'خشبة', 'جمهور', 'أداء'],        difficulty: 'Medium' },
  { id: 43, targetWord: 'ملعب',        tabooWords: ['رياضة', 'جمهور', 'مباراة', 'حكم', 'حشد'],      difficulty: 'Medium' },
  { id: 44, targetWord: 'مرآة',        tabooWords: ['انعكاس', 'وجه', 'زجاج', 'شكل', 'جمال'],        difficulty: 'Medium' },
  { id: 45, targetWord: 'حديقة',       tabooWords: ['نباتات', 'أزهار', 'خضراء', 'أشجار', 'مشي'],    difficulty: 'Medium' },
  { id: 46, targetWord: 'عطلة',        tabooWords: ['راحة', 'إجازة', 'سياحة', 'فندق', 'أيام'],      difficulty: 'Medium' },
  { id: 47, targetWord: 'صاروخ',       tabooWords: ['فضاء', 'انطلاق', 'وقود', 'مدار', 'سرعة'],      difficulty: 'Medium' },
  { id: 48, targetWord: 'روبوت',       tabooWords: ['آلة', 'برمجة', 'تقنية', 'إنسان', 'مصنع'],      difficulty: 'Medium' },
  { id: 49, targetWord: 'ميزان',       tabooWords: ['وزن', 'عدل', 'كيلو', 'قياس', 'تساوي'],         difficulty: 'Medium' },
  { id: 50, targetWord: 'أهرام',       tabooWords: ['مصر', 'حجارة', 'قديم', 'مثلث', 'فرعون'],       difficulty: 'Medium' },

  // ── صعب ───────────────────────────────────────────────────────────────────
  { id: 51, targetWord: 'التضخم',      tabooWords: ['أسعار', 'اقتصاد', 'نقود', 'ارتفاع', 'غلاء'],   difficulty: 'Hard' },
  { id: 52, targetWord: 'الفلسفة',     tabooWords: ['تفكير', 'حكمة', 'وجود', 'حقيقة', 'عقل'],       difficulty: 'Hard' },
  { id: 53, targetWord: 'البيروقراطية',tabooWords: ['إجراءات', 'وثائق', 'دولة', 'نظام', 'طابور'],   difficulty: 'Hard' },
  { id: 54, targetWord: 'التسويف',     tabooWords: ['تأجيل', 'كسل', 'وقت', 'بكرة', 'تأخير'],        difficulty: 'Hard' },
  { id: 55, targetWord: 'الجاذبية',    tabooWords: ['سقوط', 'أرض', 'قوة', 'كتلة', 'نيوتن'],         difficulty: 'Hard' },
  { id: 56, targetWord: 'الاستعارة',   tabooWords: ['لغة', 'شعر', 'تشبيه', 'معنى', 'أدب'],          difficulty: 'Hard' },
  { id: 57, targetWord: 'المفارقة',    tabooWords: ['تناقض', 'منطق', 'غريب', 'صح', 'خطأ'],          difficulty: 'Hard' },
  { id: 58, targetWord: 'الديمقراطية', tabooWords: ['تصويت', 'حكومة', 'انتخاب', 'حقوق', 'رأي'],     difficulty: 'Hard' },
  { id: 59, targetWord: 'الآثار',      tabooWords: ['قديم', 'حفر', 'تاريخ', 'اكتشاف', 'حضارة'],     difficulty: 'Hard' },
  { id: 60, targetWord: 'التراث',      tabooWords: ['ثقافة', 'تاريخ', 'موروث', 'أجداد', 'أصيل'],    difficulty: 'Hard' },
  { id: 61, targetWord: 'الحنين',      tabooWords: ['ذكريات', 'ماضي', 'شعور', 'طفولة', 'غياب'],      difficulty: 'Hard' },
  { id: 62, targetWord: 'التضامن',     tabooWords: ['دعم', 'وحدة', 'معاً', 'مجتمع', 'مساعدة'],      difficulty: 'Hard' },
  { id: 63, targetWord: 'المتاهة',     tabooWords: ['ضياع', 'مسار', 'أروقة', 'خروج', 'دوران'],      difficulty: 'Hard' },
  { id: 64, targetWord: 'الكاريزما',   tabooWords: ['شخصية', 'جذب', 'قيادة', 'تأثير', 'حضور'],      difficulty: 'Hard' },
  { id: 65, targetWord: 'الفضول',      tabooWords: ['سؤال', 'اكتشاف', 'اهتمام', 'بحث', 'تعلم'],     difficulty: 'Hard' },
  { id: 66, targetWord: 'الإبداع',     tabooWords: ['خيال', 'فن', 'ابتكار', 'جديد', 'أفكار'],       difficulty: 'Hard' },
  { id: 67, targetWord: 'البيئة',      tabooWords: ['طبيعة', 'تلوث', 'حماية', 'غابات', 'حيوانات'],  difficulty: 'Hard' },
  { id: 68, targetWord: 'الشفقة',      tabooWords: ['حزن', 'رحمة', 'مساعدة', 'عاطفة', 'قلب'],       difficulty: 'Hard' },
  { id: 69, targetWord: 'الخيانة',     tabooWords: ['أمانة', 'ثقة', 'خداع', 'وعد', 'كذب'],          difficulty: 'Hard' },
  { id: 70, targetWord: 'النفاق',      tabooWords: ['ظاهر', 'باطن', 'كذب', 'شخص', 'وجهان'],         difficulty: 'Hard' },
]

export function pickTabooCard(difficulty: TabooDifficulty, usedIds: Set<number>): TabooCard {
  const pool = TABOO_CARDS.filter((c) => c.difficulty === difficulty && !usedIds.has(c.id))
  if (pool.length === 0) {
    usedIds.clear()
    return pickTabooCard(difficulty, usedIds)
  }
  return pool[Math.floor(Math.random() * pool.length)]
}

function normalizeArabic(s: string): string {
  return s
    .replace(/[ً-ٰٟ]/g, '') // Remove tashkeel
    .replace(/[أإآ]/g, 'ا')               // Normalize alef
    .replace(/ة/g, 'ه')                    // Normalize ta marbuta
    .replace(/ى/g, 'ي')                    // Normalize alef maqsura
    .trim()
}

export function validateClue(
  clue: string,
  card: { targetWord: string; tabooWords: string[] },
): { valid: boolean; violatedWord?: string } {
  const normClue = normalizeArabic(clue)
  const forbidden = [card.targetWord, ...card.tabooWords]

  for (const taboo of forbidden) {
    const normTaboo = normalizeArabic(taboo)
    // Check if the taboo word (or its root) appears anywhere in the clue
    if (normClue.includes(normTaboo)) {
      return { valid: false, violatedWord: taboo }
    }
  }
  return { valid: true }
}

export function validateGuess(guess: string, targetWord: string): boolean {
  const clean = (s: string) =>
    normalizeArabic(s)
      .replace(/^ال/, '')   // Strip definite article
      .replace(/\s+/g, '')  // Ignore spaces
  return clean(guess) === clean(targetWord)
}
