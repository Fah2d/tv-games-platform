import type { FawazeeerQuestion } from './types'

export const QUESTIONS: FawazeeerQuestion[] = [
  { id: 'fz1',  question: 'ما الشيء الذي له أسنان ولا يعض؟', answer: 'المشط' },
  { id: 'fz2',  question: 'لي بيت من قشرة صلبة، من يريد الدخول عليه كسر الجدار، ما أنا؟', answer: 'البيضة' },
  { id: 'fz3',  question: 'ما الشيء الذي يبتلّ كلما جفَّف؟', answer: 'المنشفة' },
  { id: 'fz4',  question: 'كلما أخذت منه زاد، ما هو؟', answer: 'الحفرة' },
  { id: 'fz5',  question: 'ما الشيء الذي يملك يدين ولكنه لا يستطيع التصفيق؟', answer: 'الساعة' },
  { id: 'fz6',  question: 'ما الشيء الذي يعبر الجبال والأنهار ولكنه لا يتحرك قط؟', answer: 'الطريق' },
  { id: 'fz7',  question: 'ما الشيء الذي ترى فيه وجهك وهو ليس مرآة؟', answer: 'الماء' },
  { id: 'fz8',  question: 'كلما أكلته لم يشبع، ما هو؟', answer: 'النار' },
  { id: 'fz9',  question: 'ما الشيء الذي يُضيء ليلاً ويختفي نهاراً؟', answer: 'النجوم' },
  { id: 'fz10', question: 'ما الذي يخرج من البيت دون أن يمشي؟', answer: 'الدخان' },
  { id: 'fz11', question: 'طويل في الصيف وقصير في الشتاء، ما هو؟', answer: 'النهار' },
  { id: 'fz12', question: 'ما الشيء الذي يُرى ولا يُلمس، وإذا لمسته اختفى؟', answer: 'الظل' },
  { id: 'fz13', question: 'كلما اشتعل كلما قصر، ما هو؟', answer: 'الشمعة' },
  { id: 'fz14', question: 'أربعة أخوة يجرون معاً دون أن يلتقوا، ما هم؟', answer: 'عجلات السيارة' },
  { id: 'fz15', question: 'ما الذي يدخل البيت من كل جهة ولا يملأه؟', answer: 'الضوء' },
  { id: 'fz16', question: 'ما الذي يمشي على أربعة في الصغر وعلى اثنين في الكبر وعلى ثلاثة في الشيخوخة؟', answer: 'الإنسان' },
  { id: 'fz17', question: 'ما الشيء الذي لا يُرى ولكن يُشعر به ويحرك الأشجار والأمواج؟', answer: 'الريح' },
  { id: 'fz18', question: 'ما الشيء الذي كلما طال كلما نقص؟', answer: 'العمر' },
  { id: 'fz19', question: 'ما الذي تحمله في جيبك وهو يفتح شيئاً أكبر منك بكثير؟', answer: 'المفتاح' },
  { id: 'fz20', question: 'ما الشيء الذي يكسره الإنسان بمجرد النطق به؟', answer: 'الصمت' },
  { id: 'fz21', question: 'أنا أتكلم بكل اللغات دون أن يكون لي لسان، من أنا؟', answer: 'الكتاب' },
  { id: 'fz22', question: 'ما الشيء الذي يطير ويبكي دون عيون ودون أجنحة؟', answer: 'السحابة' },
  { id: 'fz23', question: 'ما الشيء الذي يكثر في الشتاء ويقل في الصيف؟', answer: 'المطر' },
  { id: 'fz24', question: 'ما الذي يمنحك دفئاً دون أن يكون له جسد ولا يدين؟', answer: 'الشمس' },
  { id: 'fz25', question: 'ما الشيء الذي يمكنك رؤيته ولكن لا يمكنك لمسه، وكلما مشيت نحوه ابتعد عنك؟', answer: 'الأفق' },
]

export function shuffleQuestions(questions: FawazeeerQuestion[]): FawazeeerQuestion[] {
  const arr = [...questions]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
