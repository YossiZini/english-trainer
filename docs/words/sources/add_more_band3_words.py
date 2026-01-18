#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Continue adding Band III words - Part 2
"""

import csv

# Continue Band III Core I from where we left off
more_band3_core1 = [
    ("cold", "לא ידידותי, קר", "He gave me a cold stare."),
    ("collar", "צווארון", "Turn up your collar, it's windy."),
    ("collector", "אוסף", "He's a stamp collector."),
    ("come after/first/last, etc", "לבוא אחרי/ראשון/אחרון", "Z comes after Y in the alphabet."),
    ("common", "משותף", "They have a common interest in music."),
    ("competitive", "תחרותי", "The job market is very competitive."),
    ("complicated", "מסובך, מורכב", "The situation is quite complicated."),
    ("concern", "לעניין, להדאיג", "This matter concerns us all."),
    ("conditions", "תנאים", "The working conditions are good."),
    ("conduct", "לבצע, לנהל", "They will conduct a survey."),
    ("consequence", "תוצאה, השלכה", "Every action has consequences."),
    ("considerable", "ניכר, משמעותי", "There was considerable damage."),
    ("contemporary", "בן זמננו, עכשווי", "He studies contemporary art."),
    ("contest", "תחרות", "She won the singing contest."),
    ("continent", "יבשת", "Africa is a large continent."),
    ("cope", "להתמודד", "She's coping well with the stress."),
    ("copy", "עותק יחיד", "I have a copy of that book."),
    ("correspond", "להתכתב, לכתוב", "They corresponded for years."),
    ("costume", "תלבושת", "She wore a Halloween costume."),
    ("courage", "אומץ", "It takes courage to admit mistakes."),
    ("cover", "לסקר, סיקור", "The media covered the event."),
    ("crash", "התרסקות, להתרסק", "The plane crash was tragic."),
    ("criterion", "קריטריון, מדד", "What is the criterion for success?"),
    ("critic", "מבקר", "The film critic loved the movie."),
    ("cross", "צלב, סמל", "The Red Cross helps people."),
    ("cure", "תרופה, לרפא", "There's no cure for the common cold."),
    ("current", "נוכחי, שוטף", "What's the current situation?"),
    ("customs", "מכס", "Go through customs at the airport."),
    ("cut down sth", "לכרות, לצמצם", "We need to cut down expenses."),
    ("cyberbullying", "בריונות רשת", "Cyberbullying is a serious problem."),
    ("cycle", "אופניים, רכיבה", "I cycle to work every day."),
    ("date", "דייט, פגישה רומנטית", "They're going on a date tonight."),
    ("deaf", "חירש", "He's deaf in one ear."),
    ("debt", "חוב", "They're in debt to the bank."),
    ("decade", "עשור", "Three decades have passed."),
    ("deck", "סיפון", "We sat on the ship's deck."),
    ("declare", "להצהיר, להכריז", "He declared his love for her."),
    ("decorate", "לקשט, לעטר", "They decorated the house for Christmas."),
    ("decrease", "ירידה, להפחית", "There's been a decrease in crime."),
    ("dedicate", "להקדיש לזכר", "The statue is dedicated to fallen soldiers."),
    ("defeat", "תבוסה, להביס", "They suffered a crushing defeat."),
    ("degree", "תואר אקדמי", "She has a degree in engineering."),
    ("delayed", "מאוחר, עוכב", "The flight was delayed by two hours."),
    ("deliberately", "במתכוון, בכוונה", "He deliberately ignored me."),
    ("deliver", "לספק, למסור", "Please deliver this package."),
    ("demanding", "תובעני, דורש", "It's a demanding job."),
    ("demonstrate", "להפגין", "Thousands demonstrated against the war."),
    ("departure", "יציאה, המראה", "The departure time is 3 PM."),
    ("deposit", "פיקדון, לשם", "I need to make a deposit at the bank."),
    ("deserve", "לזכות, להגיע", "She deserves a promotion."),
    ("design", "עיצוב", "I love the design of this dress."),
    ("destination", "יעד", "What's your final destination?"),
    ("destruction", "הרס", "The earthquake caused massive destruction."),
    ("detect", "לזהות, לגלות", "The device can detect smoke."),
    ("determine", "לקבוע", "We need to determine the cause."),
    ("development", "אירוע, תהליך", "This is an interesting development."),
    ("devil", "שטן", "Speak of the devil, here he comes!"),
    ("diagram", "תרשים, דיאגרמה", "Draw a diagram to explain."),
    ("differ", "לא להסכים", "I differ with you on this point."),
    ("differ", "להשתנות מאוד", "Opinions differ widely on this issue."),
    ("difficult", "לא ידידותי", "He's a difficult person to work with."),
    ("direct", "לביים", "Who directed this film?"),
    ("disabled", "נכה", "There are facilities for disabled people."),
    ("disagreement", "אי הסכמה", "We had a disagreement about the plan."),
    ("disappointed", "מאוכזב", "I was disappointed with the results."),
    ("disaster", "אסון", "The flood was a natural disaster."),
    ("discovery", "תגלית", "This is an important scientific discovery."),
    ("dishonest", "לא ישר", "That was a dishonest thing to do."),
    ("disk", "דיסק", "Save the file to disk."),
    ("dislike", "לשנוא, שנאה", "I dislike his attitude."),
    ("dispute", "מחלוקת", "There's a dispute over the land."),
    ("distinguish", "להבדיל, לזהות", "Can you distinguish between them?"),
    ("disturb", "להפריע, להטריד", "Sorry to disturb you."),
    ("divide", "לחשב, לחלק", "Divide 20 by 4."),
    ("divorce", "גירושין", "Their divorce was finalized."),
    ("do", "עושה, לשם הדגשה", "I do like chocolate!"),
    ("do a good/excellent, etc. job", "לעשות עבודה טובה", "You did an excellent job."),
    ("domestic", "מקומי, פנים מדינה", "This is a domestic flight."),
    ("done", "גמור, מוכן", "Is dinner done yet?"),
    ("Don't ask me!", "אל תשאל אותי!", "Don't ask me, I have no idea!"),
    ("Don't ask!", "אל תשאל!", "How was the exam? Don't ask!"),
    ("double", "כפול, להכפיל", "House prices have doubled."),
    ("doubt", "ספק, לפקפק", "I have my doubts about this plan."),
    ("dozen", "תריסר", "I bought a dozen eggs."),
    ("draft", "טיוטה", "This is just a rough draft."),
    ("dramatic", "דרמטי", "There's been a dramatic change."),
    ("dreadful", "נורא, איום", "The weather was dreadful."),
    ("drink", "לשתות אלכוהול", "He doesn't drink alcohol."),
    ("drive", "כונן", "Save it to the C drive."),
    ("drop", "לרדת, לרכת", "Temperatures will drop tonight."),
    ("drop", "טיפה", "Just a drop of milk, please."),
    ("drunk", "שיכור", "He was arrested for drunk driving."),
    ("earth", "אדמה, קרקע", "Plant the seeds in rich earth."),
    ("earthquake", "רעידת אדמה", "The earthquake measured 6.5."),
    ("economical", "חסכוני", "This car is very economical."),
    ("editor", "עורך", "She's the editor of the magazine."),
    ("educate", "לחנך", "We need to educate people about health."),
    ("efficient", "יעיל", "We need a more efficient system."),
    ("either way", "כך או כך", "Either way, we'll have to pay."),
    ("elbow", "מרפק", "He hurt his elbow playing tennis."),
    ("elderly", "קשיש, מבוגר", "Services for elderly people."),
    ("element", "יסוד, מרכיב", "Water contains two elements: hydrogen and oxygen."),
    ("emerge", "לצוץ, להופיע", "New evidence has emerged."),
    ("emotion", "רגש", "She showed no emotion."),
    ("emphasis", "דגש, הדגשה", "The emphasis is on quality."),
    ("engagement", "אירוסין", "They announced their engagement."),
    ("enjoyable", "מהנה", "We had a very enjoyable evening."),
    ("enter", "להזין מידע", "Enter your password here."),
    ("episode", "פרק", "Did you watch the last episode?"),
    ("equal", "שווה, שוויון", "All people are created equal."),
    ("escape", "בריחה", "There's no escape from reality."),
    ("essay", "חיבור, מסה", "Write an essay about your summer."),
    ("essentially", "בעיקרו, למעשה", "They're essentially the same thing."),
    ("even if", "אפילו אם", "I'll go even if it rains."),
    ("even though", "למרות ש-", "She passed even though she didn't study."),
    ("event", "אירוע", "The wedding was a big event."),
    ("exactly", "בדיוק, הדגשה", "That's exactly what I mean!"),
    ("except that", "חוץ מזה ש-", "I'd come except that I'm busy."),
    ("exception", "חריג", "We'll make an exception this time."),
    ("exchange", "להחליף", "Can I exchange this shirt?"),
    ("exist", "להתקיים", "Do ghosts really exist?"),
    ("expected", "צפוי", "The expected arrival time is 5 PM."),
    ("expedition", "משלחת", "They went on an expedition to Antarctica."),
]

def append_more_words():
    """Append more Band III words to the processed file"""
    output_file = '/Users/Yossi.Zini/development/eng-tu/docs/words/sources/LexicalBand3_processed.csv'

    # Read existing entries
    existing = []
    with open(output_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        existing = list(reader)

    # Add new entries
    for english, hebrew, sentence in more_band3_core1:
        existing.append({
            'English Word': english,
            'Hebrew Translation': hebrew,
            'Difficulty Level': 8,
            'Source': 'lexisband3',
            'Example Sentence': sentence
        })

    # Write all entries
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['English Word', 'Hebrew Translation', 'Difficulty Level', 'Source', 'Example Sentence']
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        writer.writeheader()
        for word in existing:
            writer.writerow(word)

    print(f"✓ Added {len(more_band3_core1)} more words")
    print(f"✓ Total in file: {len(existing)} words")

if __name__ == "__main__":
    append_more_words()
