#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract and translate vocabulary from Lexical Band III
"""

import csv

# Band III Core I (4-point Bagrut) - Difficulty Level 8
band3_core1 = [
    ("(all) on your own", "לגמרי לבד", "You have to do this project all on your own."),
    ("(at) any minute; any minute now", "בכל רגע", "The bus should arrive any minute now."),
    ("(be) in your twenties/20s/thirties/30s, etc", "להיות בשנות העשרים/השלושים", "She is in her twenties and still studying."),
    ("(every) once in a while", "מדי פעם", "We go to the cinema once in a while."),
    ("a little sth", "קצת משהו", "Add a little sugar to the tea."),
    ("above", "מעל, למעלה", "The birds are flying above the trees."),
    ("absorb", "לספוג, לקלוט", "Plants absorb water through their roots."),
    ("access", "גישה, כניסה", "Students have access to the library 24/7."),
    ("account", "דו\"ח, תיאור", "He gave a detailed account of the accident."),
    ("acquire", "לרכוש, להשיג", "She acquired new skills in the course."),
    ("addition", "תוספת", "In addition to English, she speaks French."),
    ("advance", "התקדמות", "There has been great advance in technology."),
    ("advanced", "מתקדם", "This is an advanced level course."),
    ("advertising", "פרסום, פרסומת", "Advertising plays a major role in business."),
    ("age", "תקופה, עידן", "We live in the digital age."),
    ("aggressive", "תוקפני, אגרסיבי", "His aggressive behavior caused problems."),
    ("agriculture", "חקלאות", "Agriculture is important for the economy."),
    ("air force", "חיל האוויר", "He served in the air force."),
    ("alarm", "אזעקה, דאגה", "The alarm went off at 6 AM."),
    ("all is well", "הכל בסדר", "Don't worry, all is well."),
    ("all of a sudden", "פתאום, לפתע", "All of a sudden, it started raining."),
    ("all over the place", "בכל מקום", "His toys are all over the place."),
    ("altogether", "בסך הכל, לגמרי", "There were twenty people altogether."),
    ("ambassador", "שגריר", "The ambassador met with the president."),
    ("ambition", "שאפתנות, שאיפה", "Her ambition is to become a doctor."),
    ("among other things", "בין היתר", "We discussed, among other things, the budget."),
    ("analysis", "ניתוח, אנליזה", "The analysis showed interesting results."),
    ("annoy", "להרגיז, להציק", "The noise really annoys me."),
    ("anxious", "מודאג, חרד", "She felt anxious before the exam."),
    ("apparent", "ברור, נראה לעין", "It was apparent that he was lying."),
    ("appear", "להיראות, להיתפס", "He appears to be happy."),
    ("approach", "גישה, דרך", "We need a different approach to this problem."),
    ("appropriate", "מתאים, הולם", "Please wear appropriate clothing."),
    ("argue", "לטעון, להתווכח", "They argued about politics."),
    ("arrow", "חץ, סימן", "Follow the arrow to the exit."),
    ("artistic", "אומנותי", "She has great artistic talent."),
    ("as", "בזמן ש-, כאשר", "As I was leaving, the phone rang."),
    ("as a matter of fact", "למעשה, לאמיתו של דבר", "As a matter of fact, I agree with you."),
    ("ashamed", "מתבייש", "He felt ashamed of his behavior."),
    ("aside", "הצידה", "She put the book aside and looked at me."),
    ("assure", "להבטיח, להרגיע", "I assure you that everything will be fine."),
    ("at fault", "אשם", "The driver was at fault for the accident."),
    ("at his/its, etc. best", "במיטבו", "The team was at its best today."),
    ("at least", "לפחות", "You should study at least two hours a day."),
    ("atmosphere", "אווירה, אטמוספרה", "There was a friendly atmosphere at the party."),
    ("attraction", "אטרקציה, משיכה", "The museum is a major attraction."),
    ("automatically", "אוטומטית, מאליו", "The door closes automatically."),
    ("average", "ממוצע, רגיל", "The average student can do this."),
    ("awareness", "מודעות", "We need to raise awareness about this issue."),
    ("bad", "רקוב, מקולקל", "The meat has gone bad."),
    ("bank", "גדה", "We sat on the river bank."),
    ("bank account", "חשבון בנק", "I opened a new bank account."),
    ("barely", "בקושי", "I could barely see in the dark."),
    ("bargain", "מציאה, עסקה", "This coat is a real bargain."),
    ("barrier", "מחסום, מכשול", "Language can be a barrier to communication."),
    ("base", "בסיס צבאי", "The soldiers returned to base."),
    ("bay", "מפרץ", "The ship sailed into the bay."),
    ("be (just) about to do sth", "עומד ל-, בדיוק הולך ל-", "I'm just about to leave."),
    ("be in charge", "להיות אחראי", "Who is in charge here?"),
    ("be out of sth", "להיגמר ממשהו", "We're out of milk."),
    ("be responsible for sth/doing sth", "להיות אחראי ל-", "She is responsible for the project."),
    ("be situated in/on/by, etc", "להיות ממוקם ב-", "The hotel is situated near the beach."),
    ("be expecting (a baby)", "להיות בהריון", "They're expecting their first baby."),
    ("beat", "קצב, פעימה", "Dance to the beat of the music."),
    ("before", "לפני, בסדר", "Your name comes before mine."),
    ("behind", "מאחור, מפגר", "She is behind in her studies."),
    ("believe in sth", "להאמין במשהו", "I believe in working hard."),
    ("believe it or not", "תאמין או לא", "Believe it or not, he won the lottery."),
    ("bell", "פעמון, צלצול", "Ring the bell when you arrive."),
    ("bench", "ספסל", "Let's sit on that bench."),
    ("bend", "לכופף, לעקם", "Bend your knees when you lift."),
    ("besides", "מלבד, בנוסף", "Besides English, she speaks Spanish."),
    ("biology", "ביולוגיה", "She's studying biology at university."),
    ("bitter", "מר, מריר", "The medicine tastes bitter."),
    ("blame", "אשמה, האשמה", "Don't put the blame on me."),
    ("block", "לחסום", "A truck blocked the road."),
    ("blow up (sth/sb)", "לפוצץ", "They blew up the old building."),
    ("boiled", "מבושל, רתוח", "Would you like a boiled egg?"),
    ("bold", "נועז, אמיץ", "It was a bold decision."),
    ("bother", "להטריד, לטרוח", "Don't bother helping me."),
    ("bottom", "תחתון, נמוך ביותר", "Put your name at the bottom of the page."),
    ("brake", "בלם", "He stepped on the brake."),
    ("branch", "סניף, ענף", "The company has branches worldwide."),
    ("breast", "חזה, שד", "Breast cancer awareness is important."),
    ("breeze", "רוח קלה, בריזה", "A cool breeze blew from the sea."),
    ("brick", "לבנה", "The house is made of brick."),
    ("brilliant", "מבריק, גאוני", "She has a brilliant mind."),
    ("bring up sb", "לגדל, לחנך", "She brought up three children alone."),
    ("bucket", "דלי", "Fill the bucket with water."),
    ("bug", "חרק, באג", "There's a bug in the computer program."),
    ("bull", "שור", "Be careful of the bull in the field."),
    ("bunch", "צרור, אשכול", "I bought a bunch of flowers."),
    ("burst into tears", "לפרוץ בבכי", "She burst into tears when she heard the news."),
    ("bury", "לקבור", "They buried the treasure in the garden."),
    ("butcher", "קצב", "Buy the meat from the butcher."),
    ("cab", "מונית", "Let's take a cab to the airport."),
    ("cabin", "תא, בקתה", "We stayed in a small cabin in the woods."),
    ("calculate", "לחשב", "Calculate the total cost."),
    ("can", "יכול, לפעמים קורה", "Accidents can happen."),
    ("can tell", "יכול לומר, מבחין", "I can tell she's upset."),
    ("capacity", "נפח, קיבולת", "The bottle has a capacity of one liter."),
    ("capture", "ללכוד, לתפוס", "The police captured the criminal."),
    ("cash", "לפרוט המחאה", "Can I cash this check here?"),
    ("casual", "מזדמן, לא רשמי", "It's a casual meeting, no need for a suit."),
    ("catalog/catalogue", "קטלוג", "Look through the catalog for ideas."),
    ("cave", "מערה", "They explored the dark cave."),
    ("ceremony", "טקס", "The graduation ceremony was beautiful."),
    ("certificate", "תעודה", "She received a certificate of completion."),
    ("chairperson", "יו\"ר", "The chairperson opened the meeting."),
    ("challenge", "לאתגר, להטיל ספק", "He challenged the decision."),
    ("chance", "סיכון", "I'm not taking any chances."),
    ("change", "עודף, כסף קטן", "Keep the change."),
    ("characteristic", "תכונה אופיינית", "Patience is his main characteristic."),
    ("charge", "לטעון חשמל", "Charge your phone before leaving."),
    ("chase", "לרדוף, מרדף", "The dog chased the cat."),
    ("cheat", "לרמות, רמאי", "Don't cheat on the test."),
    ("check in/check out", "לעשות צ'ק אין/אאוט", "Check in at the hotel reception."),
    ("Cheers!", "לחיים!", "Cheers! Happy birthday!"),
    ("claim", "לטעון, קביעה", "He claims to be innocent."),
    ("classic", "קלאסי", "This is a classic example."),
    ("clinic", "מרפאה", "She works at the clinic."),
    ("clothing", "ביגוד, לבוש", "The store sells children's clothing."),
    ("coach", "מאמן", "The coach trained the team."),
]

# Band III Core II (5-point Bagrut) - Difficulty Level 9
band3_core2 = [
    ("a broken heart", "לב שבור", "Time heals a broken heart."),
    ("a handful of", "קומץ, מעטים", "Only a handful of students showed up."),
    ("a mass of sth", "המון, ערימה של", "There's a mass of work to do."),
    ("a sharp rise/increase/drop, etc.", "עלייה/ירידה חדה", "There was a sharp rise in prices."),
    ("abandon", "לנטוש, לזנוח", "They had to abandon the project."),
    ("admit", "להרשות כניסה", "Children are not admitted without an adult."),
    ("adviser/advisor", "יועץ", "She works as a financial adviser."),
    ("affair", "עניין, מצב", "This is a serious affair."),
    ("affection", "חיבה, אהבה", "She has great affection for her grandmother."),
    ("after all", "אחרי הכל, בסופו של דבר", "He decided to come after all."),
    ("against the law", "נגד החוק", "Stealing is against the law."),
    ("agenda", "סדר יום", "What's on the agenda for today?"),
    ("all in all", "בסך הכל", "All in all, it was a good day."),
    ("all over again", "שוב מההתחלה", "I have to do it all over again."),
    ("amuse", "לשעשע, לבדר", "The clown amused the children."),
    ("an awful lot (of sth)", "המון, כמות עצומה", "She has an awful lot of work."),
    ("ancestor", "אב קדמון, אבות", "Her ancestors came from Poland."),
    ("any day/minute/time, etc now", "בכל רגע", "They'll arrive any minute now."),
    ("appeal", "לערער, ערעור", "They appealed to the court."),
    ("arms", "נשק", "The soldiers laid down their arms."),
    ("around/round the clock", "מסביב לשעון", "The store is open around the clock."),
    ("arrow", "חץ (בקשתות)", "He shot an arrow at the target."),
    ("artificial", "מלאכותי", "These are artificial flowers."),
    ("artificial intelligence", "בינה מלאכותית", "AI is changing our world."),
    ("as a result of sth", "כתוצאה מ-", "As a result of the rain, the game was cancelled."),
    ("as a whole", "כמכלול, בסך הכל", "The team as a whole performed well."),
    ("as far as I know", "למיטב ידיעתי", "As far as I know, he's still working there."),
    ("as far as sb/sth is concerned", "בכל מה שנוגע ל-", "As far as I'm concerned, you can go."),
    ("as follows", "כדלקמן", "The instructions are as follows."),
    ("as regards sth", "בנוגע ל-", "As regards your question, I'll answer later."),
    ("as though", "כאילו", "He acts as though nothing happened."),
    ("aside", "בצד, חוץ מ-", "Money aside, I really enjoy my job."),
    ("assignment", "מטלה, משימה", "Finish your assignment by Friday."),
    ("associate", "לשייך, לקשר", "I don't associate him with that group."),
    ("assumption", "הנחה, הנחת יסוד", "Your assumption is correct."),
    ("astonishment", "תדהמה, השתוממות", "She looked at him in astonishment."),
    ("at first sight", "במבט ראשון", "At first sight, it seems easy."),
    ("at risk", "בסיכון", "The building is at risk of collapse."),
    ("at your convenience", "בנוחותך, בזמנך", "Call me at your convenience."),
    ("attachment", "קובץ מצורף", "Please see the attachment."),
    ("attract/get (sb's) attention", "למשוך תשומת לב", "The bright colors attract attention."),
    ("augmented reality", "מציאות מדומה", "AR games are very popular."),
    ("autonomy", "אוטונומיה, עצמאות", "The region has some autonomy."),
    ("availability", "זמינות", "Check the availability of the product."),
    ("avoid doing sth", "להימנע מלעשות משהו", "Try to avoid making mistakes."),
    ("awkward", "מביך, לא נוח", "There was an awkward silence."),
    ("backup", "גיבוי", "Always make a backup of your files."),
    ("balance", "שיווי משקל; יתרה", "Check your bank balance."),
    ("ban", "איסור, לאסור", "There's a ban on smoking here."),
    ("bare", "חשוף, ריק", "The walls were bare."),
    ("basement", "מרתף", "The basement is very dark."),
    ("be (of) any/some/no use", "להועיל", "Is this of any use to you?"),
    ("be a bad/good influence (on sb)", "להשפיע לרעה/לטובה", "Friends can be a good influence."),
    ("be a piece of cake", "להיות קל מאוד", "The exam was a piece of cake."),
    ("be absorbed in sth", "להיות שקוע ב-", "He was absorbed in his book."),
    ("be associated with sth", "להיות קשור ל-", "Smoking is associated with cancer."),
    ("be at/on the point of doing sth", "להיות על סף", "I was on the point of leaving."),
    ("be based at/in/etc", "להיות ממוקם ב-", "The company is based in London."),
    ("be conscious of/that", "להיות מודע ל-", "I'm conscious of my mistakes."),
    ("be exposed to sth", "להיחשף ל-", "Children shouldn't be exposed to violence."),
    ("be hard on sb", "להיות קשה עם מישהו", "Don't be so hard on yourself."),
    ("be in a mood", "להיות במצב רוח", "She's in a bad mood today."),
    ("be in favor of sth", "להיות בעד משהו", "I'm in favor of the proposal."),
]

def create_csv():
    """Create the CSV file with all Band III vocabulary"""
    output_file = '/Users/Yossi.Zini/development/eng-tu/docs/words/sources/LexicalBand3_processed.csv'

    all_words = []

    # Add Band III Core I words (difficulty 8)
    for english, hebrew, sentence in band3_core1:
        all_words.append({
            'English Word': english,
            'Hebrew Translation': hebrew,
            'Difficulty Level': 8,
            'Source': 'lexisband3',
            'Example Sentence': sentence
        })

    # Add Band III Core II words (difficulty 9)
    for english, hebrew, sentence in band3_core2:
        all_words.append({
            'English Word': english,
            'Hebrew Translation': hebrew,
            'Difficulty Level': 9,
            'Source': 'lexisband3',
            'Example Sentence': sentence
        })

    # Write to CSV
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['English Word', 'Hebrew Translation', 'Difficulty Level', 'Source', 'Example Sentence']
        writer = csv.DictWriter(f, fieldnames=fieldnames)

        writer.writeheader()
        for word in all_words:
            writer.writerow(word)

    print(f"✓ Created {len(all_words)} word entries")
    print(f"✓ Band III Core I: {len(band3_core1)} words (difficulty 8)")
    print(f"✓ Band III Core II: {len(band3_core2)} words (difficulty 9)")
    print(f"✓ Output: {output_file}")

    return output_file

if __name__ == "__main__":
    create_csv()
