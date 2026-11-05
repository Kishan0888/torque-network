/**
 * Weekly post ideas. Three ideas per member per week, chosen by domain and
 * week number so they refresh every Monday and differ between domains.
 * Each idea has a fill-in-the-blanks template for "Use template".
 */
import { weekStart } from '../../shared/memberConfig.js'

const LINKEDIN = [
  { title: 'A project that didn’t work, and what you learned', format: 'Story format · 150–250 words',
    template: 'Last [month], we tried [project] in [domain].\n\nIt didn’t work. Here’s what happened:\n• [What we expected]\n• [What actually happened]\n• [The moment we realised]\n\nWhat I’d do differently:\n1. [Lesson 1]\n2. [Lesson 2]\n3. [Lesson 3]\n\nWhat’s a failure that taught you more than a win?' },
  { title: 'Your 3 favourite tools for getting work done faster', format: 'List format · add one tip per tool',
    template: '3 tools that save me [X hours] a week in [domain]:\n\n1. [Tool] — [what I use it for]. Tip: [one specific tip]\n2. [Tool] — [what I use it for]. Tip: [one specific tip]\n3. [Tool] — [what I use it for]. Tip: [one specific tip]\n\nWhich tool would you add?' },
  { title: 'One metric your team watches, and why', format: 'Opinion format · end with a question',
    template: 'Most people in [domain] track [common metric].\n\nWe watch [your metric] instead.\n\nWhy: [reason in one line]\n\nWhat changed when we switched: [result]\n\nWhat’s the one number your team can’t ignore?' },
  { title: 'Advice you’d give yourself in year one', format: 'Reflection · 5 short lines',
    template: 'If I could talk to myself in my first year in [domain]:\n\n1. [Advice]\n2. [Advice]\n3. [Advice]\n4. [Advice]\n5. [Advice]\n\nThe one I needed most: #[number], because [why].' },
  { title: 'A myth in your industry you disagree with', format: 'Opinion format · back it with an example',
    template: 'Unpopular opinion in [domain]: [myth] isn’t true.\n\nHere’s what I’ve seen instead:\n[Example from your work]\n\nWhat actually works: [your view]\n\nAgree or disagree — and why?' },
  { title: 'How you’d explain your job to a 10-year-old', format: 'Story format · simple language',
    template: 'My niece asked what I do. Here’s how I explained [role]:\n\n“[Simple explanation]”\n\nFunny thing — explaining it simply made me realise [insight].' },
  { title: 'A small habit that improved your work', format: 'How-to format · steps',
    template: 'One habit that changed how I work: [habit].\n\nHow I do it:\n1. [Step]\n2. [Step]\n3. [Step]\n\nResult after [time]: [result].' },
  { title: 'A question you get asked all the time — answered', format: 'FAQ format · clear and practical',
    template: 'The question I get asked most about [domain]:\n\n“[Question]”\n\nMy honest answer:\n[Answer in 3–5 lines]\n\nWhat would you add?' },
  { title: 'What a great week at work looks like for you', format: 'Story format · specific details',
    template: 'A great week in [role] isn’t about [common assumption].\n\nIt looks like:\n• [Moment 1]\n• [Moment 2]\n• [Moment 3]\n\nWhat makes a week great for you?' },
  { title: 'A trend you’re watching this quarter', format: 'Industry view · what it means for peers',
    template: 'A trend I’m watching in [domain]: [trend].\n\nWhy it matters: [reason]\nWhat I’m doing about it: [action]\nWhat I’m not sure about yet: [open question]' },
  { title: 'Before vs after: something you improved', format: 'Before/after format · numbers if you can',
    template: 'Before: [situation, with a number]\nAfter: [situation, with a number]\n\nWhat changed:\n1. [Change]\n2. [Change]\n\nThe hardest part was [challenge].' },
  { title: 'Someone who shaped your career — and how', format: 'Gratitude story · tag them if you can',
    template: '[Name] taught me [lesson] when I was [situation].\n\nWhat they did: [specific action]\nWhy it stuck: [reason]\n\nWho shaped your career?' },
]

const INSTAGRAM = [
  { title: 'A behind-the-scenes look at how you make a post', format: 'Reel · 15–30 sec, fast cuts',
    template: 'Hook (first 2 sec): “Here’s what it really takes to make one [type of post]”\nShots: [setup] → [making] → [final result]\nCaption: [one line] + question for comments' },
  { title: 'Your top 3 tips for beginners in your niche', format: 'Carousel · 5 slides',
    template: 'Slide 1: “3 things I wish I knew when I started [niche]”\nSlide 2–4: [Tip + one line why]\nSlide 5: “Save this for later” + question' },
  { title: 'A mistake you made, and the fix', format: 'Talking reel · under 45 sec',
    template: 'Hook: “Don’t make this mistake with [topic]”\nThe mistake: [what you did]\nThe fix: [what to do instead]\nEnd: “Which one have you done?”' },
  { title: 'Day in your life as a creator', format: 'Reel · time-stamped clips',
    template: '7am: [clip]\n10am: [clip]\n2pm: [clip]\n6pm: [clip]\nCaption: the part people don’t see is [insight].' },
  { title: 'Myth vs fact in your niche', format: 'Carousel or reel · 3 myths',
    template: 'Myth 1: [myth] → Fact: [fact]\nMyth 2: [myth] → Fact: [fact]\nMyth 3: [myth] → Fact: [fact]\nCTA: which one surprised you?' },
  { title: 'Rate or review something your audience uses', format: 'Reel · honest verdict at the end',
    template: 'Hook: “I tried [product/place] so you don’t have to”\nGood: [point]\nNot so good: [point]\nVerdict: [score / buy or skip]' },
  { title: 'Answer a question from your comments or DMs', format: 'Reply reel · show the comment',
    template: 'Show comment: “[question]”\nAnswer in 3 steps:\n1. [Step]\n2. [Step]\n3. [Step]\nEnd: “Ask me anything below”' },
  { title: 'Before and after', format: 'Transition reel',
    template: 'Before shot: [state]\nTransition: [snap / swipe]\nAfter shot: [result]\nCaption: how long it took + one tip' },
  { title: 'Your favourite tools or apps for creating', format: 'Carousel · one tool per slide',
    template: 'Slide 1: “My creator toolkit for [niche]”\nSlides 2–5: [App] — what I use it for\nLast slide: “What’s in yours?”' },
  { title: 'A small win from this month', format: 'Story-time reel · relatable',
    template: 'Hook: “Small win this month: [win]”\nWhat led to it: [2–3 lines]\nWhat’s next: [goal]\nAsk: “What’s your win this month?”' },
  { title: 'Collab idea: duet or remix a peer’s post', format: 'Remix · credit the creator',
    template: 'Pick a peer’s post from your Timeline\nYour twist: [your angle]\nCredit: @[creator]\nCaption: why you liked theirs' },
  { title: 'Three things you’d tell your follower #1', format: 'Talking reel · warm tone',
    template: 'Hook: “To everyone who followed me early —”\n1. [Thing]\n2. [Thing]\n3. [Thing]\nEnd: thank you + question' },
]

function hash(text) {
  let h = 0
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h
}

/** Three ideas for this platform + domain, rotating every Monday (IST). */
export function weeklyIdeas(platform, domain, now = new Date()) {
  const pool = platform === 'instagram' ? INSTAGRAM : LINKEDIN
  const week = Math.floor(weekStart(now).getTime() / (7 * 86400000))
  const offset = (hash(domain || '') + week * 3) % pool.length
  return [0, 1, 2].map((i) => pool[(offset + i) % pool.length])
}
