/**
 * All app content (offline). Written in Egyptian colloquial Arabic for ages 13–18.
 * Gendered first-person words use the token {masculine|feminine}, resolved by `genderize()`.
 */
export type Gender = 'm' | 'f';
export type Quality = 'best' | 'ok' | 'avoid';

export interface ChoiceOption { id: string; label: string; icon: string; quality: Quality; feedback: string }

/* ------------------------------------------------------------------ */
/* كلمة بداية — social situations                                       */
/* ------------------------------------------------------------------ */

export type SituationId = 'conflict' | 'help' | 'school' | 'other';
export type PersonId = 'mom' | 'dad' | 'friend' | 'teacher' | 'other';

export const situations: { id: SituationId; title: string; icon: string }[] = [
  { id: 'conflict', title: 'خلاف أو توتر', icon: 'message-alert-outline' },
  { id: 'help', title: 'طلب مساعدة', icon: 'hand-heart-outline' },
  { id: 'school', title: 'مشكلة في المدرسة', icon: 'school-outline' },
  { id: 'other', title: 'موقف آخر', icon: 'dots-horizontal' },
];

export const persons: { id: PersonId; title: string; avatar?: number; icon?: string; withLabel: string }[] = [
  { id: 'mom', title: 'أمي', avatar: require('../assets/images/avatar-mom.png'), withLabel: 'مع أمي' },
  { id: 'dad', title: 'أبي', avatar: require('../assets/images/avatar-dad.png'), withLabel: 'مع أبي' },
  { id: 'friend', title: 'صديق موثوق', icon: 'account-group', withLabel: 'مع صديق موثوق' },
  { id: 'teacher', title: 'معلم / مرشد', avatar: require('../assets/images/avatar-teacher.png'), withLabel: 'مع المعلم أو المرشد' },
  { id: 'other', title: 'شخص آخر', icon: 'plus', withLabel: 'مع شخص آخر' },
];

export const openers: Record<SituationId, Record<PersonId, string>> = {
  conflict: {
    mom: 'ماما، في حاجة {مزعّلاني|مزعّلاني} من فترة و{محتاج|محتاجة} أتكلم معاكي بصراحة. ممكن تسمعيني للآخر من غير ما نتعصب؟',
    dad: 'بابا، أنا {مضايق|مضايقة} من اللي حصل بينا، ومش {عايز|عايزة} نفضل زعلانين. ممكن نتكلم بهدوء شوية؟',
    friend: 'بص، أنا {متضايق|متضايقة} من اللي حصل بينا، ومش {عايز|عايزة} ده يأثر على صحوبيتنا. ممكن نتكلم ونفهم بعض؟',
    teacher: 'لو سمحت، كنت {عايز|عايزة} آخد من وقت حضرتك دقيقتين. {حاسس|حاسة} إن في سوء تفاهم حصل، و{حابب|حابة} أوضّح وجهة نظري باحترام.',
    other: 'ممكن نتكلم بهدوء؟ أنا {مضايق|مضايقة} من اللي حصل، و{عايز|عايزة} أفهم وجهة نظرك وأقول وجهة نظري.',
  },
  help: {
    mom: 'ماما، أنا {محتاج|محتاجة} مساعدتك في حاجة مضايقاني ومش {عارف|عارفة} أتصرف فيها لوحدي. ممكن نقعد نتكلم؟',
    dad: 'بابا، في موضوع مقلقني و{محتاج|محتاجة} رأيك فيه. ممكن نتكلم لما تفضى؟',
    friend: 'أنا {عارف|عارفة} إنك بتفهمني، و{محتاج|محتاجة} أحكيلك على حاجة شاغلاني. ممكن تسمعني شوية؟',
    teacher: 'لو سمحت، {محتاج|محتاجة} مساعدة حضرتك في حاجة مضايقاني. ينفع أكلم حضرتك بعد الحصة؟',
    other: '{محتاج|محتاجة} مساعدة في حاجة صعبة عليّا شوية. ممكن تساعدني أو تقولّي أكلم مين؟',
  },
  school: {
    mom: 'ماما، في مشكلة حصلت في المدرسة ومش {مرتاح|مرتاحة} لها، و{عايز|عايزة} أحكيلك عليها عشان تساعديني أتصرف صح.',
    dad: 'بابا، حصلت حاجة في المدرسة مضايقاني، و{محتاج|محتاجة} أعرف رأيك أعمل إيه.',
    friend: 'في حاجة حصلت في المدرسة مضايقاني. ممكن نتكلم فيها ونفكر سوا نعمل إيه؟',
    teacher: 'لو سمحت، في مشكلة بتواجهني في المدرسة و{محتاج|محتاجة} توجيه حضرتك. ممكن أحكيلك عليها؟',
    other: 'في مشكلة بتواجهني في المدرسة و{محتاج|محتاجة} حد أتكلم معاه. ينفع أحكيلك؟',
  },
  other: {
    mom: 'ماما، في حاجة شاغلة بالي و{محتاج|محتاجة} أتكلم معاكي فيها. وقتك يسمح دلوقتي؟',
    dad: 'بابا، عندي حاجة {عايز|عايزة} أشاركك فيها ويهمني رأيك. ممكن نتكلم؟',
    friend: 'عندي حاجة {عايز|عايزة} أحكيلك عليها ويهمني رأيك فيها. فاضي شوية؟',
    teacher: 'لو سمحت، عندي سؤال مهم بالنسبالي و{حابب|حابة} آخد رأي حضرتك. ممكن؟',
    other: 'عندي حاجة {عايز|عايزة} أتكلم فيها، ويهمني نسمع بعض بهدوء. ينفع دلوقتي؟',
  },
};

const IGNORE = 'تجاهل الموقف ممكن يريّحك شوية، لكن المشكلة غالبًا بتفضل موجودة ومشاعرك بتتراكم جواك.';
const HARSH = 'الرد بعصبية أو بكلام جارح بيكبّر المشكلة، وبيخلّي الطرف التاني يدافع عن نفسه بدل ما يسمعك.';
const KIND_BEST = 'الرد بلطف بيهدّي الموقف، وبيخلّي الطرف التاني مستعد يسمعك، وبيوصّل مشاعرك من غير ما تجرح حد.';
const KIND_OK = 'اللطف دايمًا اختيار كويس، بس في الموقف ده إنت محتاج دعم حقيقي، فمتترددش تطلب المساعدة.';
const HELP_BEST = 'طلب المساعدة خيار جيد لأنه بيوضح مشاعرك ويخليك تحصل على الدعم اللي تحتاجه بدون ما تزيد التوتر.';
const HELP_OK = 'طلب المساعدة من شخص موثوق فكرة كويسة لو الموقف كبر، بس جرّب الأول تتكلم بهدوء مع الطرف التاني.';

export function responseOptions(s: SituationId): ChoiceOption[] {
  const helpBest = s === 'help' || s === 'school';
  return [
    { id: 'ignore', label: 'أهمل الموقف', icon: 'eye-off-outline', quality: 'avoid', feedback: IGNORE },
    { id: 'kind', label: 'أرد بلطف', icon: 'hand-heart-outline', quality: helpBest ? 'ok' : 'best', feedback: helpBest ? KIND_OK : KIND_BEST },
    { id: 'harsh', label: 'أواجه بسوء', icon: 'emoticon-angry-outline', quality: 'avoid', feedback: HARSH },
    { id: 'help', label: 'أطلب المساعدة', icon: 'account-supervisor-outline', quality: helpBest ? 'best' : 'ok', feedback: helpBest ? HELP_BEST : HELP_OK },
  ];
}

export const alternatives: Record<SituationId, string[]> = {
  conflict: ['خد نفس عميق واستنى لحد ما تهدى قبل ما تتكلم', 'اكتب مشاعرك الأول عشان ترتّب كلامك', 'التحدث مع صديق موثوق'],
  help: ['كلّم الأخصائي الاجتماعي في المدرسة', 'التحدث مع صديق موثوق', 'لو {حاسس|حاسة} بخطر، كلّم شخص كبير فورًا أو خط نجدة الطفل 16000'],
  school: ['كلّم الأخصائي الاجتماعي أو المرشد', 'اكتب اللي حصل بالتفصيل عشان تحكيه بوضوح', 'احكي لأهلك'],
  other: ['اختار وقت مناسب للكلام', 'ابدأ بجملة فيها مشاعرك: «أنا {حاسس|حاسة} إن…»', 'التحدث مع صديق موثوق'],
};

/* ------------------------------------------------------------------ */
/* ثانية تفكير — digital situations                                     */
/* ------------------------------------------------------------------ */

export type CategoryId = 'messages' | 'news';
export const categories: { id: CategoryId; title: string; subtitle: string; icon: string; tint: 'sky' | 'lavender' }[] = [
  { id: 'messages', title: 'الرسائل والمحادثات', subtitle: 'رسائل مزعجة، ضغط اجتماعي، طلبات غريبة.', icon: 'chat-processing-outline', tint: 'sky' },
  { id: 'news', title: 'الأخبار والمحتوى', subtitle: 'تحقق من المصدر قبل المشاركة.', icon: 'newspaper-variant-outline', tint: 'lavender' },
];

export interface DigitalTopic { id: string; category: CategoryId; title: string; icon: string; color: string }
export const topics: DigitalTopic[] = [
  { id: 'provoking', category: 'messages', title: 'رسالة مستفزة', icon: 'message-alert-outline', color: '#5B4FD9' },
  { id: 'stranger', category: 'messages', title: 'طلب غريب', icon: 'account-question-outline', color: '#2E8BC9' },
  { id: 'pressure', category: 'messages', title: 'ضغط في الجروب', icon: 'account-group-outline', color: '#7B6CF0' },
  { id: 'fake-news', category: 'news', title: 'خبر غير موثوق', icon: 'file-question-outline', color: '#5B4FD9' },
  { id: 'harmful', category: 'news', title: 'محتوى مؤذي', icon: 'alert-outline', color: '#F08A3E' },
  { id: 'scam', category: 'news', title: 'إعلان أو جايزة مريبة', icon: 'gift-outline', color: '#2E8BC9' },
];

export interface Scenario { id: string; topic: string; situation: string; question: string; options: { label: string; quality: Quality; feedback: string }[]; tip: string }

export const scenarios: Scenario[] = [
  {
    id: 'provoking-1', topic: 'provoking',
    situation: 'حد في جروب الفصل كتب تعليق بيتريق فيه على صورتك قدام الكل.',
    question: 'هترد إزاي؟',
    options: [
      { label: 'أرد عليه بشتيمة قدام الكل', quality: 'avoid', feedback: 'الرد بإساءة بيكبّر المشكلة، وممكن يخليك إنت كمان في موقف غلط.' },
      { label: 'أستنى أهدى، وبعدين أكلمه على الخاص بهدوء أو أتجاهل', quality: 'best', feedback: 'ممتاز! الهدوء بيحميك من رد فعل تندم عليه، والكلام على الخاص بيحل المشكلة من غير جمهور.' },
      { label: 'أعمل سكرين شوت وأنشرها عشان أفضحه', quality: 'avoid', feedback: 'الفضيحة بتحوّل الموقف لحرب، وبتنشر الإساءة لناس أكتر.' },
      { label: 'أبلّغ مشرف الجروب أو شخص كبير لو اتكرر', quality: 'ok', feedback: 'اختيار كويس لو التريقة اتكررت أو بقت تنمّر. ومن الأحسن تبدأ بالهدوء الأول.' },
    ],
    tip: 'قبل ما ترد: خد نفس، واسأل نفسك «هل ردي ده هيحل المشكلة ولا هيكبّرها؟»',
  },
  {
    id: 'provoking-2', topic: 'provoking',
    situation: 'صاحبك بعتلك رسالة فيها كلام جارح وهو متعصب.',
    question: 'إيه أفضل رد؟',
    options: [
      { label: 'أرد فورًا بكلام أجرح منه', quality: 'avoid', feedback: 'الرد وإنت متعصب غالبًا بيقول حاجات تندم عليها، وبيضيّع الصحوبية.' },
      { label: 'أستنى شوية وأكتب: «شايفك متضايق، تعالى نتكلم لما نهدى»', quality: 'best', feedback: 'رد ناضج جدًا! بيهدّي الموقف وبيفتح باب للحل.' },
      { label: 'أعمله بلوك على طول', quality: 'ok', feedback: 'البلوك ممكن يحميك لو الإساءة مستمرة، بس مع صاحب قريب الكلام بهدوء غالبًا أحسن.' },
      { label: 'أبعت رسالته لباقي الصحاب', quality: 'avoid', feedback: 'نشر رسايل خاصة بيكسر الثقة وبيكبّر الخلاف.' },
    ],
    tip: 'الرسالة المكتوبة مبتتمسحش من دماغ اللي قراها. اكتب كلام تقدر تقف وراه.',
  },
  {
    id: 'stranger-1', topic: 'stranger',
    situation: 'شخص ماتعرفوش بعتلك طلب صداقة ورسالة بيطلب صورك واسم مدرستك.',
    question: 'هتتصرف إزاي؟',
    options: [
      { label: 'أبعتله، شكله لطيف', quality: 'avoid', feedback: 'مينفعش تبعت صور أو معلومات شخصية لحد ماتعرفوش، حتى لو كان لطيف.' },
      { label: 'أبعتله اسم المدرسة بس', quality: 'avoid', feedback: 'اسم المدرسة بيوصّل لمكانك. أي معلومة شخصية ممكن تتستخدم ضدك.' },
      { label: 'مشاركش أي حاجة، أعمل بلوك وريبورت، وأحكي لشخص كبير', quality: 'best', feedback: 'صح جدًا! ده التصرف الآمن، وإنك تحكي لشخص كبير بيحميك وبيحمي غيرك.' },
      { label: 'أتجاهل الرسالة وخلاص', quality: 'ok', feedback: 'كويس إنك ماردتش، بس الأحسن كمان تعمل بلوك وريبورت وتحكي لحد كبير.' },
    ],
    tip: 'القاعدة الذهبية: مفيش صور ولا عنوان ولا مدرسة ولا أرقام لأي حد ماتعرفوش في الحقيقة.',
  },
  {
    id: 'stranger-2', topic: 'stranger',
    situation: 'رسالة بتقول: «مبروك كسبت جايزة! ابعت الكود اللي جالك في رسالة SMS عشان تستلمها».',
    question: 'تعمل إيه؟',
    options: [
      { label: 'أبعت الكود بسرعة قبل ما الجايزة تروح', quality: 'avoid', feedback: 'ده أسلوب نصب معروف. الكود ده ممكن يدّي حد تاني تحكم في حسابك.' },
      { label: 'أطلب منه يثبتلي إنه صادق', quality: 'avoid', feedback: 'النصابين شاطرين جدًا في الإقناع. متدخلش في نقاش معاهم أصلًا.' },
      { label: 'مبعتش الكود لأي حد، وأحكي لأهلي', quality: 'best', feedback: 'برافو! أكواد التحقق سرية ومحدش له حق يطلبها منك أبدًا.' },
      { label: 'أدخل اللينك اللي بعته أتأكد منه', quality: 'avoid', feedback: 'اللينكات المجهولة ممكن تسرق بياناتك. ماتضغطش عليها.' },
    ],
    tip: 'لو العرض أحلى من إنه يتصدق، غالبًا هو نصب.',
  },
  {
    id: 'pressure-1', topic: 'pressure',
    situation: 'الجروب كله بيتريق على زميل، وطالبين منك تشارك بتعليق.',
    question: 'هتعمل إيه؟',
    options: [
      { label: 'أشارك عشان ما أبانش «دقة قديمة»', quality: 'avoid', feedback: 'المشاركة في التنمر بتأذي حد حقيقي، حتى لو شكلها «هزار».' },
      { label: 'مشاركش، وأقول إن ده مش لطيف أو أدعم زميلي على الخاص', quality: 'best', feedback: 'شجاعة حقيقية! وقفتك ممكن تشجع غيرك يوقفوا التنمر.' },
      { label: 'مشاركش وأسكت', quality: 'ok', feedback: 'كويس إنك ماشاركتش، ولو قدرت تدعم زميلك أو تبلّغ حد كبير هيبقى أحسن.' },
      { label: 'أعمل لايك بس', quality: 'avoid', feedback: 'اللايك برضه مشاركة وتشجيع للتنمر.' },
    ],
    tip: 'إنك تقول «لأ» للجروب مش سهل، بس هو اللي بيفرق.',
  },
  {
    id: 'pressure-2', topic: 'pressure',
    situation: 'صحابك عايزينك تنشر صورة لزميل من غير ما يعرف عشان «هزار».',
    question: 'إيه الصح؟',
    options: [
      { label: 'أنشرها، كلنا بنهزر', quality: 'avoid', feedback: 'نشر صورة حد من غير إذنه ممكن يجرحه جدًا، وممكن يعرّضك لمشاكل.' },
      { label: 'أرفض وأقول: «مش هنشر صورة حد من غير إذنه»', quality: 'best', feedback: 'ممتاز! احترام خصوصية الناس قيمة مهمة جدًا.' },
      { label: 'أنشرها في ستوري بيختفي', quality: 'avoid', feedback: 'الستوري ممكن يتصوّر سكرين شوت وينتشر بسهولة.' },
    ],
    tip: 'اسأل نفسك: «لو دي صورتي أنا، هبقى مبسوط إنها اتنشرت؟»',
  },
  {
    id: 'fake-news-1', topic: 'fake-news',
    situation: 'شفت خبر منتشر بيقول إن الدراسة اتلغت بكرة، والصفحة اللي نشرته مش معروفة.',
    question: 'هل هذا الخبر من مصدر موثوق؟ هل من الأفضل التحقق من المصدر قبل مشاركته؟',
    options: [
      { label: 'أشاركه على طول، ناس كتير نشرته', quality: 'avoid', feedback: 'كتر المشاركات مش دليل إن الخبر صح. الأخبار الكاذبة بتنتشر أسرع.' },
      { label: 'أتحقق من الصفحة الرسمية للوزارة أو المدرسة الأول', quality: 'best', feedback: 'تحقق من المصدر قبل المشاركة يقلل من انتشار المعلومات المزيفة ويجنبك الوقوع في المشاكل.' },
      { label: 'أبعته لصحابي وأقولهم «مش متأكد»', quality: 'avoid', feedback: 'حتى مع «مش متأكد»، إنت كده بتنشر الخبر.' },
    ],
    tip: 'اسأل: مين نشر؟ إمتى؟ وهل في مصدر رسمي قال نفس الكلام؟',
  },
  {
    id: 'fake-news-2', topic: 'fake-news',
    situation: 'فيديو منتشر عنوانه «عاجل!! صدق أو لا تصدق» عن اختراع غريب يعالج كل الأمراض.',
    question: 'تعمل إيه قبل ما تشاركه؟',
    options: [
      { label: 'أشاركه، يمكن يفيد حد', quality: 'avoid', feedback: 'المعلومات الطبية الغلط ممكن تأذي ناس حقيقيين.' },
      { label: 'أدوّر في مصادر موثوقة، ولو مالقيتش تأكيد ماأشاركوش', quality: 'best', feedback: 'تفكير علمي ممتاز! العناوين المبالغ فيها علامة إنذار.' },
      { label: 'أصدّقه لأن الفيديو شكله احترافي', quality: 'avoid', feedback: 'الشكل الاحترافي سهل تقليده. المصدر أهم من الشكل.' },
    ],
    tip: 'العناوين اللي فيها «عاجل!!» و«صدق أو لا تصدق» غالبًا هدفها الانتشار مش الحقيقة.',
  },
  {
    id: 'harmful-1', topic: 'harmful',
    situation: 'ظهرلك فيديو فيه «تحدّي» خطير بيطلب من الناس يعملوا حاجة ممكن تأذيهم.',
    question: 'إيه التصرف الصح؟',
    options: [
      { label: 'أجرّبه أنا وصحابي', quality: 'avoid', feedback: 'التحديات الخطيرة سببت إصابات حقيقية. حياتك أهم من أي ترند.' },
      { label: 'أبعته لصحابي عشان أحذّرهم', quality: 'avoid', feedback: 'نيتك كويسة، بس الإرسال بينشر الفيديو أكتر. حذّرهم بالكلام من غير ما تبعته.' },
      { label: 'مكمّلوش، أعمل ريبورت، وأحكي لشخص كبير', quality: 'best', feedback: 'تصرف مسؤول جدًا! الريبورت بيساعد المنصة تشيل المحتوى ده.' },
      { label: 'أعدّي الفيديو وخلاص', quality: 'ok', feedback: 'كويس إنك ماتفاعلتش معاه، والأحسن كمان تعمل ريبورت.' },
    ],
    tip: 'أي محتوى بيطلب منك تأذي نفسك أو غيرك: وقّف، بلّغ، واحكي لحد بتثق فيه.',
  },
  {
    id: 'harmful-2', topic: 'harmful',
    situation: 'حد بعتلك صورة لزميل متعدّل عليها بشكل مُهين.',
    question: 'هتعمل إيه؟',
    options: [
      { label: 'أبعتها لحد تاني يضحك عليها', quality: 'avoid', feedback: 'كل إرسال بيزوّد الأذى اللي بيتعرّض له زميلك.' },
      { label: 'مأبعتهاش، وأقول للي بعتها إن ده غلط، وأبلّغ شخص كبير', quality: 'best', feedback: 'ممتاز! إنت كده بتحمي زميلك وبتوقف الأذى.' },
      { label: 'أمسحها وأسكت', quality: 'ok', feedback: 'كويس إنك مانشرتهاش، بس زميلك ممكن يحتاج حد يقف جنبه أو يبلّغ.' },
    ],
    tip: 'التنمر الإلكتروني أذى حقيقي. وقفتك مع زميلك بتفرق جدًا.',
  },
  {
    id: 'scam-1', topic: 'scam',
    situation: 'إعلان بيقول: «ادخل اللينك واكسب موبايل مجانًا»، وبيطلب باسورد حسابك.',
    question: 'تعمل إيه؟',
    options: [
      { label: 'أكتب الباسورد، الموبايل يستاهل', quality: 'avoid', feedback: 'مفيش أي جهة حقيقية بتطلب الباسورد بتاعك. ده نصب.' },
      { label: 'ماأدخلش اللينك، وأعمل ريبورت للإعلان', quality: 'best', feedback: 'صح! الباسورد سر، وأي حد بيطلبه غالبًا نصاب.' },
      { label: 'أدخل اللينك أتفرج بس', quality: 'avoid', feedback: 'بعض اللينكات بتسرق البيانات بمجرد فتحها.' },
    ],
    tip: 'الباسورد زي مفتاح البيت: ماتدّيهوش لأي حد.',
  },
  {
    id: 'scam-2', topic: 'scam',
    situation: 'رسالة شكلها من «إدارة اللعبة» بتقولك: «حسابك هيتقفل، ابعت بيانات الدخول عشان نأمّنه».',
    question: 'إيه الصح؟',
    options: [
      { label: 'أبعت البيانات بسرعة عشان ماأخسرش حسابي', quality: 'avoid', feedback: 'الضغط والاستعجال من أشهر حيل النصب.' },
      { label: 'ماأبعتش حاجة، وأتأكد من داخل اللعبة نفسها أو أسأل حد كبير', quality: 'best', feedback: 'تفكير ممتاز! الشركات الحقيقية مش بتطلب بيانات الدخول في رسايل.' },
      { label: 'أرد وأسأله هو مين', quality: 'avoid', feedback: 'الرد بيأكّد للنصاب إن حسابك شغال. الأفضل ماتردش وتبلّغ.' },
    ],
    tip: 'لو رسالة بتستعجلك وبتطلب بيانات، دي علامة نصب.',
  },
];

export function genderize(text: string, g: Gender): string {
  return text.replace(/\{([^|{}]*)\|([^|{}]*)\}/g, (_, m, f) => (g === 'f' ? f : m));
}

export const kalmaId = (s: SituationId, p: PersonId) => `kalma:${s}:${p}`;
export const TOTAL_KALMA = situations.length * persons.length;
export const TOTAL_DIGITAL = scenarios.length;
