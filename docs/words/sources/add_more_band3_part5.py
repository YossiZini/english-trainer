#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Continue adding Band III Core II words - Part 5
"""

import csv

# Continue Band III Core II (difficulty 9)
more_band3_core2 = [
    ("pain", "כאב, צער", "She felt a sharp pain in her chest."),
    ("painful", "כואב, מצער", "It was a painful experience."),
    ("panel", "פאנל, צוות", "A panel of experts discussed the issue."),
    ("panic", "פאניקה", "Don't panic, stay calm."),
    ("parliament", "פרלמנט", "Parliament passed a new law."),
    ("participant", "משתתף", "All participants received certificates."),
    ("participate", "להשתתף", "Everyone can participate in the discussion."),
    ("particular", "מסוים", "I'm looking for a particular book."),
    ("partner", "שותף", "She's my business partner."),
    ("passage", "קטע, מעבר", "Read the following passage."),
    ("passion", "תשוקה", "He has a passion for music."),
    ("passive", "פסיבי", "Don't be so passive, take action!"),
    ("paste", "להדביק", "Copy and paste the text."),
    ("patch", "טלאי", "There's a patch on his jacket."),
    ("path", "דרך, שביל", "Follow the path through the woods."),
    ("patience", "סבלנות", "Teaching requires patience."),
    ("pattern", "תבנית, דפוס", "I noticed a pattern in the data."),
    ("pause", "הפסקה, להפסיק", "Let's pause for a moment."),
    ("peak", "שיא, פסגה", "We reached the mountain peak."),
    ("peculiar", "מוזר, מיוחד", "He has peculiar habits."),
    ("peer", "עמית, בן גיל", "Peer pressure affects teenagers."),
    ("penalty", "עונש", "The penalty for speeding is a fine."),
    ("perceive", "לתפוס, להבין", "How do you perceive this situation?"),
    ("perform", "לבצע, להופיע", "The band will perform tonight."),
    ("permanent", "קבוע, קיים", "She has a permanent job."),
    ("permit", "להתיר, אישור", "Smoking is not permitted here."),
    ("persist", "להתמיד", "If you persist, you'll succeed."),
    ("personality", "אישיות", "She has a strong personality."),
    ("personally", "באופן אישי", "I personally disagree."),
    ("perspective", "פרספקטיבה", "Try to see things from my perspective."),
    ("persuade", "לשכנע", "I tried to persuade her to come."),
    ("phase", "שלב, פאזה", "We're in the final phase of the project."),
    ("phenomenon", "תופעה", "Global warming is a serious phenomenon."),
    ("philosophical", "פילוסופי", "That's a philosophical question."),
    ("physical", "פיזי, גופני", "Physical exercise is important."),
    ("pioneer", "חלוץ", "He was a pioneer in computer science."),
    ("pity", "רחמים, חבל", "What a pity you can't come!"),
    ("plain", "פשוט, ברור", "The instructions are written in plain English."),
    ("pleasant", "נעים", "We had a pleasant conversation."),
    ("plot", "עלילה", "The novel has an interesting plot."),
    ("plus", "בנוסף, פלוס", "The room costs $100 plus tax."),
    ("poem", "שיר", "She wrote a beautiful poem."),
    ("pole", "מוט, עמוד", "The flag flies on a tall pole."),
    ("policy", "מדיניות", "What's the company's policy on overtime?"),
    ("politics", "פוליטיקה", "He's not interested in politics."),
    ("poll", "סקר", "The poll shows support for the proposal."),
    ("pollution", "זיהום", "Air pollution is a serious problem."),
    ("pond", "בריכה", "There are fish in the pond."),
    ("portion", "מנה, חלק", "I'll have a small portion please."),
    ("portrait", "דיוקן", "They hung a portrait of the queen."),
    ("pose", "להציב, להוות", "This poses a serious threat."),
    ("position", "עמדה", "What's your position on this issue?"),
    ("possess", "להחזיק, להיות בעל", "He possesses great talent."),
    ("potential", "פוטנציאל", "She has great potential."),
    ("pound", "פאונד", "The bag weighs 5 pounds."),
    ("poverty", "עוני", "Many people live in poverty."),
    ("practical", "מעשי", "Let's find a practical solution."),
    ("praise", "שבח, לשבח", "The teacher praised his work."),
    ("pray", "להתפלל", "They pray every day."),
    ("precaution", "אמצעי זהירות", "Take precautions against fire."),
    ("precise", "מדויק", "Please give me precise instructions."),
    ("predict", "לחזות", "It's hard to predict the future."),
    ("preference", "העדפה", "What's your preference?"),
    ("pregnant", "בהריון", "She's three months pregnant."),
    ("prejudice", "דעה קדומה", "We must fight prejudice."),
    ("premise", "הנחה, מושכל יסוד", "Your argument is based on a false premise."),
    ("preparation", "הכנה", "The meal requires careful preparation."),
    ("prescribe", "לרשום תרופה", "The doctor prescribed antibiotics."),
    ("presence", "נוכחות", "Your presence is requested."),
    ("presentation", "מצגת, הצגה", "She gave an excellent presentation."),
    ("preserve", "לשמר", "We must preserve nature."),
    ("press", "עיתונות", "The press reported the scandal."),
    ("presumably", "ככל הנראה", "Presumably, he'll arrive soon."),
    ("pretend", "להעמיד פנים", "Stop pretending you don't know!"),
    ("previous", "קודם", "I liked the previous version better."),
    ("priest", "כומר", "The priest conducted the service."),
    ("primary", "ראשוני, עיקרי", "What's your primary concern?"),
    ("prime", "ראשוני, עיקרי", "This is of prime importance."),
    ("principal", "ראשי, עיקרי", "Safety is our principal concern."),
    ("principle", "עקרון", "It's a matter of principle."),
    ("prior", "קודם", "You need prior experience for this job."),
    ("priority", "עדיפות", "Education should be a priority."),
    ("prison", "כלא", "He spent 10 years in prison."),
    ("privilege", "זכות, פריווילגיה", "Driving is a privilege, not a right."),
    ("probe", "חקירה, לחקור", "Scientists probe the mysteries of space."),
    ("procedure", "נוהל", "Follow the correct procedure."),
    ("proceed", "להמשיך", "Please proceed with your presentation."),
    ("process", "תהליך", "Learning is a gradual process."),
    ("procession", "תהלוכה", "A funeral procession passed by."),
    ("produce", "תוצרת", "We buy local produce."),
    ("production", "הפקה", "The production will open next month."),
    ("profession", "מקצוע", "What's your profession?"),
    ("profit", "רווח", "The company made a huge profit."),
    ("progress", "התקדמות", "We're making good progress."),
    ("prohibit", "לאסור", "Smoking is strictly prohibited."),
    ("prominent", "בולט, מוביל", "She's a prominent scientist."),
    ("promise", "הבטחה", "He made a promise to help."),
    ("prompt", "מיידי, מהיר", "Thank you for your prompt response."),
    ("pronounce", "לבטא", "How do you pronounce this word?"),
    ("proof", "הוכחה", "Do you have proof?"),
    ("proper", "נאות, ראוי", "Use the proper tools for the job."),
    ("property", "רכוש, נכס", "This is private property."),
    ("proportion", "פרופורציה", "The costs are out of proportion."),
    ("proposal", "הצעה", "They approved our proposal."),
    ("propose", "להציע", "I propose we take a break."),
    ("prospect", "סיכוי, נוף", "There's little prospect of success."),
    ("prosperity", "שגשוג", "The country enjoyed prosperity."),
    ("protect", "להגן", "We must protect the environment."),
    ("protest", "מחאה", "Thousands joined the protest."),
    ("proud", "גאה", "I'm proud of your achievement."),
    ("prove", "להוכיח", "Can you prove your claim?"),
    ("province", "מחוז", "Quebec is a Canadian province."),
    ("provision", "הוראה, אספקה", "There's a provision for emergencies."),
    ("psychological", "פסיכולוגי", "She needs psychological support."),
    ("publication", "פרסום", "His latest publication is excellent."),
    ("publicity", "פרסומת", "The event got a lot of publicity."),
    ("publish", "לפרסם", "When will you publish the results?"),
    ("punish", "להעניש", "Parents shouldn't punish children harshly."),
    ("purchase", "קנייה, לקנות", "Keep your purchase receipt."),
    ("purely", "בצורה טהורה", "It was purely accidental."),
    ("pursue", "לרדוף אחרי", "She pursued her dream."),
    ("puzzle", "חידה, תעלומה", "His behavior is a puzzle."),
    ("qualification", "כישור", "What qualifications do you have?"),
    ("quote", "ציטוט", "He began with a famous quote."),
]

def append_more_words():
    """Append more Band III Core II words to the processed file"""
    output_file = '/Users/Yossi.Zini/development/eng-tu/docs/words/sources/LexicalBand3_processed.csv'

    # Read existing entries
    existing = []
    with open(output_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        existing = list(reader)

    # Add Core II words (difficulty 9)
    for english, hebrew, sentence in more_band3_core2:
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

    print(f"✓ Added {len(more_band3_core2)} more Core II words (difficulty 9)")
    print(f"✓ Total in file: {len(existing)} words")

if __name__ == "__main__":
    append_more_words()
