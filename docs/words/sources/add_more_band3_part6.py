#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Final batch - Complete Band III Core II words
"""

import csv

# Final batch of Band III Core II (difficulty 9)
final_band3_core2 = [
    ("race", "גזע", "People of all races should be treated equally."),
    ("rack", "מדף", "Put the dishes on the rack."),
    ("rage", "זעם, חמה", "He was filled with rage."),
    ("raid", "פשיטה", "Police conducted a raid on the building."),
    ("rail", "מסילה", "Don't cross the rail tracks."),
    ("range", "טווח, מגוון", "The store offers a wide range of products."),
    ("rank", "דרגה", "He holds the rank of captain."),
    ("rapid", "מהיר", "The city is experiencing rapid growth."),
    ("rare", "נדיר", "This is a rare opportunity."),
    ("rarely", "לעיתים רחוקות", "She rarely complains."),
    ("rate", "קצב", "Crime is increasing at an alarming rate."),
    ("rating", "דירוג", "The show has high ratings."),
    ("rational", "רציונלי", "Try to be rational about this."),
    ("raw", "גלם, נא", "Don't eat raw meat."),
    ("react", "להגיב", "How did she react to the news?"),
    ("reading", "פרשנות", "What's your reading of the situation?"),
    ("reality", "מציאות", "Face reality!"),
    ("realm", "תחום, ממלכה", "That's beyond the realm of possibility."),
    ("rear", "אחורי, לגדל", "The rear entrance is locked."),
    ("reasonable", "סביר", "That's a reasonable price."),
    ("reasoning", "הגיון, חשיבה", "I don't follow your reasoning."),
    ("recall", "לזכור", "I can't recall his name."),
    ("reception", "קבלת פנים", "The reception was very friendly."),
    ("recipe", "מתכון", "Do you have a recipe for chocolate cake?"),
    ("recognition", "הכרה", "He deserves recognition for his work."),
    ("recommend", "להמליץ", "Can you recommend a good restaurant?"),
    ("recover", "להתאושש", "It takes time to recover from illness."),
    ("recruit", "לגייס", "The company is recruiting new staff."),
    ("reduce", "להפחית", "We need to reduce costs."),
    ("refer", "להתייחס", "The article refers to recent events."),
    ("reference", "התייחסות", "He made reference to your work."),
    ("reflect", "לשקף", "His behavior reflects his upbringing."),
    ("reform", "רפורמה", "The government proposed reforms."),
    ("refugee", "פליט", "Many refugees fled the war."),
    ("refusal", "סירוב", "His refusal surprised everyone."),
    ("refuse", "אשפה, פסולת", "Put the refuse in the bin."),
    ("regard", "התייחסות", "He has no regard for others."),
    ("regarding", "בנוגע ל", "I'm calling regarding your application."),
    ("regime", "משטר", "The regime fell after the revolution."),
    ("region", "אזור", "This region is known for wine production."),
    ("register", "לרשום, רישום", "Please register for the course."),
    ("regret", "חרטה, להצטער", "I regret my decision."),
    ("regulate", "לווסת", "Laws regulate business practices."),
    ("regulation", "תקנה", "Follow safety regulations."),
    ("reinforce", "לחזק", "This reinforces my argument."),
    ("reject", "לדחות", "They rejected our offer."),
    ("relate", "לקשר", "How does this relate to our topic?"),
    ("relation", "יחס, קשר", "There's a relation between diet and health."),
    ("relative", "יחסי", "Everything is relative."),
    ("relatively", "יחסית", "The test was relatively easy."),
    ("release", "לשחרר", "The prisoner was released."),
    ("relevant", "רלוונטי", "Is this information relevant?"),
    ("reliable", "אמין", "He's a reliable person."),
    ("relief", "הקלה", "What a relief!"),
    ("religion", "דת", "Freedom of religion is a basic right."),
    ("rely", "לסמוך על", "You can rely on me."),
    ("remain", "להישאר", "Please remain seated."),
    ("remark", "הערה", "She made a rude remark."),
    ("remarkable", "יוצא דופן", "That's a remarkable achievement."),
    ("remind", "להזכיר", "Remind me to call John."),
    ("remote", "מרוחק", "They live in a remote village."),
    ("remove", "להסיר", "Remove your shoes before entering."),
    ("render", "לגרום ל", "The accident rendered him unable to walk."),
    ("renew", "לחדש", "I need to renew my passport."),
    ("rent", "שכר דירה", "How much is the monthly rent?"),
    ("repair", "תיקון, לתקן", "The car needs repair."),
    ("repeat", "לחזור", "Could you repeat that please?"),
    ("repetition", "חזרה", "Repetition helps learning."),
    ("replace", "להחליף", "We need to replace the old computer."),
    ("reply", "תשובה, להשיב", "I'm waiting for his reply."),
    ("report", "דו״ח", "Write a report on your findings."),
    ("represent", "לייצג", "Who will represent us at the meeting?"),
    ("representative", "נציג", "He's the company's representative."),
    ("reputation", "מוניטין", "The school has an excellent reputation."),
    ("request", "בקשה", "They made a request for help."),
    ("require", "לדרוש", "This job requires experience."),
    ("requirement", "דרישה", "What are the requirements for the job?"),
    ("rescue", "חילוץ, להציל", "The rescue team saved the climbers."),
    ("research", "מחקר", "She's doing research on climate change."),
    ("resemble", "להידמות", "She resembles her mother."),
    ("reservation", "הזמנה", "I made a reservation for dinner."),
    ("reserve", "שמורה, לשמור", "This area is a nature reserve."),
    ("residence", "מקום מגורים", "What's your place of residence?"),
    ("resist", "להתנגד", "She couldn't resist the chocolate."),
    ("resolve", "לפתור", "We need to resolve this conflict."),
    ("resort", "אתר נופש", "They stayed at a beach resort."),
    ("resource", "משאב", "Natural resources are limited."),
    ("respect", "כבוד, לכבד", "Treat others with respect."),
    ("respond", "להגיב", "He didn't respond to my email."),
    ("response", "תגובה", "What was her response?"),
    ("responsibility", "אחריות", "Parents have great responsibility."),
    ("responsible", "אחראי", "Who's responsible for this mess?"),
    ("restore", "לשחזר", "They restored the old building."),
    ("restrain", "לרסן", "Please restrain yourself."),
    ("restrict", "להגביל", "Parking is restricted here."),
    ("restriction", "הגבלה", "Are there any restrictions?"),
    ("retain", "לשמור", "Try to retain this information."),
    ("retire", "לפרוש", "He plans to retire next year."),
    ("retreat", "נסיגה, לסגת", "The army was forced to retreat."),
    ("reveal", "לחשוף", "The investigation revealed the truth."),
    ("revenue", "הכנסה", "Tax revenue increased this year."),
    ("reverse", "הפוך, להפוך", "Put the car in reverse."),
    ("review", "סקירה, לסקור", "The book received good reviews."),
    ("revise", "לתקן, לשנות", "I need to revise my essay."),
    ("revolution", "מהפכה", "The industrial revolution changed the world."),
    ("reward", "פרס, לתגמל", "Hard work brings rewards."),
    ("rhythm", "קצב", "I love the rhythm of this song."),
    ("ridiculous", "מגוחך", "That's a ridiculous idea!"),
    ("rigid", "נוקשה", "The rules are too rigid."),
    ("ring", "טבעת", "She wore a diamond ring."),
    ("ripe", "בשל", "The fruit is ripe."),
    ("ritual", "טקס", "They performed a religious ritual."),
    ("rival", "יריב", "The two teams are rivals."),
    ("role", "תפקיד", "He played an important role."),
    ("romantic", "רומנטי", "They went on a romantic dinner."),
    ("root", "שורש", "Education is the root of success."),
    ("rope", "חבל", "Tie it with a rope."),
    ("rot", "להירקב", "The wood will rot if it gets wet."),
    ("rough", "מחוספס, קשה", "The sea was rough today."),
    ("roughly", "בערך", "There were roughly 100 people."),
    ("route", "מסלול", "What route should we take?"),
    ("routine", "שגרה", "Exercise should be part of your daily routine."),
    ("row", "שורה", "Sit in the front row."),
    ("rub", "לשפשף", "Rub your hands together to warm them."),
    ("rude", "גס רוח", "That was very rude!"),
    ("ruin", "הריסה, להרוס", "The rain ruined our picnic."),
    ("rural", "כפרי", "They prefer rural life to city life."),
    ("rush", "למהר", "Don't rush, we have time."),
    ("sacred", "קדוש", "This is a sacred place."),
    ("sacrifice", "קורבן, להקריב", "She sacrificed everything for her children."),
]

def append_final_words():
    """Append final batch of Band III Core II words"""
    output_file = '/Users/Yossi.Zini/development/eng-tu/docs/words/sources/LexicalBand3_processed.csv'

    # Read existing entries
    existing = []
    with open(output_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        existing = list(reader)

    # Add final Core II words (difficulty 9)
    for english, hebrew, sentence in final_band3_core2:
        existing.append({
            'English Word': english,
            'Hebrew Translation': hebrew,
            'Difficulty Level': 9,
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

    print(f"✓ Added {len(final_band3_core2)} final Core II words (difficulty 9)")
    print(f"✓ Total in file: {len(existing)} words")
    print(f"\n✓ Band III vocabulary extraction complete!")

if __name__ == "__main__":
    append_final_words()
