import { rng, shuffle, sample, ch, lesson } from './util.js';
const SETS = {
  animals: [['dog', '🐶', 'كلب'], ['cat', '🐱', 'قطة'], ['bird', '🐦', 'عصفور'], ['fish', '🐟', 'سمكة'], ['cow', '🐄', 'بقرة'], ['horse', '🐴', 'حصان'], ['lion', '🦁', 'أسد'], ['elephant', '🐘', 'فيل'], ['rabbit', '🐰', 'أرنب'], ['duck', '🦆', 'بطة']],
  colors: [['red', '🔴', 'أحمر'], ['blue', '🔵', 'أزرق'], ['green', '🟢', 'أخضر'], ['yellow', '🟡', 'أصفر'], ['orange', '🟠', 'برتقالي'], ['purple', '🟣', 'بنفسجي'], ['black', '⚫', 'أسود'], ['white', '⚪', 'أبيض'], ['brown', '🟤', 'بنّي']],
  numbers: [['one', '1️⃣', '1'], ['two', '2️⃣', '2'], ['three', '3️⃣', '3'], ['four', '4️⃣', '4'], ['five', '5️⃣', '5'], ['six', '6️⃣', '6'], ['seven', '7️⃣', '7'], ['eight', '8️⃣', '8'], ['nine', '9️⃣', '9'], ['ten', '🔟', '10']],
  fruits: [['apple', '🍎', 'تفاحة'], ['banana', '🍌', 'موزة'], ['orange', '🍊', 'برتقالة'], ['grapes', '🍇', 'عنب'], ['strawberry', '🍓', 'فراولة'], ['watermelon', '🍉', 'بطّيخ'], ['lemon', '🍋', 'ليمونة'], ['pear', '🍐', 'إجّاصة']],
  family: [['mother', '👩', 'أمّ'], ['father', '👨', 'أب'], ['brother', '👦', 'أخ'], ['sister', '👧', 'أخت'], ['grandmother', '👵', 'جدّة'], ['grandfather', '👴', 'جدّ']],
  body: [['eye', '👁️', 'عين'], ['ear', '👂', 'أذن'], ['nose', '👃', 'أنف'], ['mouth', '👄', 'فم'], ['hand', '✋', 'يد'], ['foot', '🦶', 'قدم']],
  school: [['book', '📖', 'كتاب'], ['pencil', '✏️', 'قلم رصاص'], ['bag', '🎒', 'حقيبة'], ['ruler', '📏', 'مسطرة'], ['school', '🏫', 'مدرسة'], ['teacher', '🧑‍🏫', 'معلّم']],
  weather: [['sunny', '☀️', 'مشمس'], ['rainy', '🌧️', 'ممطر'], ['cloudy', '☁️', 'غائم'], ['snowy', '❄️', 'ثلجي'], ['windy', '💨', 'عاصف']],
  food: [['bread', '🍞', 'خبز'], ['milk', '🥛', 'حليب'], ['egg', '🥚', 'بيضة'], ['cheese', '🧀', 'جبن'], ['rice', '🍚', 'أرز'], ['water', '💧', 'ماء']],
};
const out = [];
const vocab = (key, slug, band, title, icon, n = 5) => {
  const r = rng('en-' + slug), set = SETS[key], pick = sample(set, Math.min(n, set.length), r), items = [];
  pick.forEach(([w, e, ar], i) => {
    const wrong = sample(set.filter(x => x[0] !== w), 2, r);
    if (i % 2 === 0) items.push(ch(`Which one is “${w}”?`, e, wrong.map(x => x[1]), r, { say: `Which one is ${w}?`, lang: 'en', big: true }));
    else items.push(ch(`ما معنى “${w}”؟`, ar, wrong.map(x => x[2]), r, { vis: e, say: w, lang: 'en' }));
  });
  out.push(lesson('english', 'en-' + slug, band, 'Words', title, icon, 'أتعلّم كلمات جديدة بالإنجليزية.', items));
};
vocab('animals', 'animals34', '3-4', 'Animals', '🐶'); vocab('colors', 'colors34', '3-4', 'Colors', '🎨'); vocab('numbers', 'numbers34', '3-4', 'Numbers', '🔢');
vocab('numbers', 'numbers56', '5-6', 'Numbers 1–10', '🔟', 6); vocab('family', 'family56', '5-6', 'My family', '👨‍👩‍👧'); vocab('fruits', 'fruits56', '5-6', 'Fruits', '🍓'); vocab('body', 'body56', '5-6', 'My body', '🖐️'); vocab('animals', 'animals56', '5-6', 'More animals', '🦁', 6);
vocab('school', 'school78', '7-8', 'At school', '🏫'); vocab('food', 'food78', '7-8', 'Food', '🍞'); vocab('weather', 'weather78', '7-8', 'Weather', '⛅'); vocab('fruits', 'fruits78', '7-8', 'Fruits and colors', '🍉', 6);
const G = (slug, band, title, icon, qs) => { const r = rng('en-' + slug); out.push(lesson('english', 'en-' + slug, band, 'Sentences', title, icon, 'أفهم جملاً بسيطة بالإنجليزية.', qs.map(([q, a, w1, w2, x]) => ch(q, a, [w1, w2], r, { lang: 'en', ...(x || {}) })))); };
G('greet56', '5-6', 'Greetings', '👋', [['What do we say in the morning?', 'Good morning', 'Good night', 'Goodbye'], ['What do we say when we leave?', 'Goodbye', 'Hello', 'Good morning'], ['What do we say to thank someone?', 'Thank you', 'Sorry', 'Please'], ['How do you say «من فضلك»؟', 'Please', 'Hello', 'Sorry'], ['How do you say «آسف»؟', 'Sorry', 'Thank you', 'Goodbye']]);
G('be78', '7-8', 'I am, he is', '🧑', [['I ___ a student.', 'am', 'is', 'are'], ['He ___ my brother.', 'is', 'am', 'are'], ['They ___ happy.', 'are', 'is', 'am'], ['She ___ a teacher.', 'is', 'are', 'am'], ['We ___ at school.', 'are', 'is', 'am']]);
G('ask78', '7-8', 'Questions', '❓', [['What is your name?', 'ما اسمك؟', 'كم عمرك؟', 'أين تسكن؟'], ['How old are you?', 'كم عمرك؟', 'ما اسمك؟', 'ما لونك المفضّل؟'], ['Where do you live?', 'أين تسكن؟', 'ما اسمك؟', 'من أنت؟'], ['What color is the sky?', 'ما لون السماء؟', 'ما لون الشمس؟', 'ما لون العشب؟']]);
G('days910', '9-10', 'Days of the week', '📅', [['Which day comes after Sunday?', 'Monday', 'Friday', 'Saturday'], ['Which day comes before Friday?', 'Thursday', 'Saturday', 'Tuesday'], ['How many days are in a week?', 'Seven', 'Six', 'Eight'], ['Which day comes after Wednesday?', 'Thursday', 'Tuesday', 'Monday']]);
G('plural910', '9-10', 'One and many', '🐱', [['One cat, two ___', 'cats', 'cat', 'cates'], ['One book, three ___', 'books', 'book', 'bookes'], ['One apple, five ___', 'apples', 'apple', 'applees'], ['One box, two ___', 'boxes', 'boxs', 'box']]);
G('opp910', '9-10', 'Opposites', '↔️', [['The opposite of big is…', 'small', 'tall', 'long'], ['The opposite of hot is…', 'cold', 'warm', 'sunny'], ['The opposite of open is…', 'closed', 'full', 'new'], ['The opposite of happy is…', 'sad', 'angry', 'tired']]);
export const english = out;
