#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Continue adding Band III words - Part 4 (completing Core I and starting Core II)
"""

import csv

# Continue and complete Band III Core I
more_band3_core1_part4 = [
    ("internal", "פנימי", "This is an internal matter."),
    ("interrupt", "להפריע, לקטוע", "Sorry to interrupt, but..."),
    ("interval", "הפסקה, מרווח", "There's a 15-minute interval."),
    ("interview", "ראיון עבודה", "I have a job interview tomorrow."),
    ("investigate", "לחקור", "Police are investigating the crime."),
    ("investment", "השקעה", "Property is a good investment."),
    ("invisible", "בלתי נראה", "Germs are invisible to the naked eye."),
    ("involve", "לכלול", "The project involves three teams."),
    ("island", "אי", "They live on a small island."),
    ("issue", "גיליון", "I read the latest issue of the magazine."),
    ("item", "פריט", "This item is on sale."),
    ("jail", "כלא, לכלוא", "He was sent to jail for theft."),
    ("journey", "מסע", "Life is a journey."),
    ("judge", "שופט, לשפוט", "Don't judge people by appearance."),
    ("judgment", "שיקול דעת", "Use your own judgment."),
    ("junior", "זוטר, צעיר", "He's a junior member of staff."),
    ("jury", "חבר מושבעים", "The jury reached a verdict."),
    ("label", "תווית", "Check the label for instructions."),
    ("labor", "עבודה, עמל", "Manual labor is hard work."),
    ("largely", "במידה רבה", "Success depends largely on effort."),
    ("latter", "האחרון (מבין שניים)", "Of the two options, I prefer the latter."),
    ("launch", "לשגר, להשיק", "They will launch a new product."),
    ("leak", "לדלוף", "The pipe is leaking water."),
    ("lean", "רזה, שרירי", "He has a lean physique."),
    ("legal", "חוקי", "Is this legal?"),
    ("leisure", "פנאי", "I enjoy reading in my leisure time."),
    ("lend", "להלוות", "Can you lend me some money?"),
    ("liberate", "לשחרר", "The prisoners were liberated."),
    ("license", "רישיון", "You need a license to drive."),
    ("lie", "שקר", "Don't tell lies."),
    ("link", "קישור, לקשר", "Click on this link."),
    ("literally", "ממש, לממש", "I'm literally dying of hunger!"),
    ("literature", "ספרות", "She studies English literature."),
    ("lively", "מלא חיים", "The party was very lively."),
    ("loads of", "המון", "We have loads of time."),
    ("locate", "למצוא מיקום", "Can you locate the building on the map?"),
    ("logic", "היגיון", "There's no logic in his argument."),
    ("loose", "רופף", "This screw is loose."),
    ("loss", "אובדן, הפסד", "The company reported a loss."),
    ("lots of", "הרבה", "We saw lots of animals at the zoo."),
    ("luxury", "מותרות, יוקרה", "They live in luxury."),
    ("maintain", "לתחזק", "It's important to maintain your car."),
    ("major", "ראשי, עיקרי", "This is a major problem."),
    ("male", "זכר, גברי", "The male students are in the minority."),
    ("manner", "צורה, אופן", "She spoke in a polite manner."),
    ("manufacturer", "יצרן", "This manufacturer makes quality products."),
    ("marriage", "נישואין", "Their marriage lasted 50 years."),
    ("mass", "המון, מסה", "A mass of people gathered."),
    ("massive", "ענק, מסיבי", "There was a massive earthquake."),
    ("mate", "חבר", "He went out with his mates."),
    ("mature", "בוגר, בשל", "She's very mature for her age."),
    ("maximum", "מקסימום", "The maximum speed is 120 km/h."),
    ("meantime", "בינתיים", "Meantime, we should wait."),
    ("medal", "מדליה", "She won a gold medal."),
    ("media", "תקשורת", "The media reported the story."),
    ("medical", "רפואי", "He needs medical attention."),
    ("medium", "בינוני", "What size do you want? Medium."),
    ("melt", "להימס", "The ice is melting."),
    ("mention", "לציין", "He mentioned your name."),
    ("merely", "רק, בסך הכל", "I merely suggested an idea."),
    ("mess", "בלגן", "Your room is a mess!"),
    ("metal", "מתכת", "This box is made of metal."),
    ("mild", "עדין, מתון", "The weather is mild today."),
    ("military", "צבאי", "He has a military background."),
    ("minimal", "מינימלי", "The damage was minimal."),
    ("minimum", "מינימום", "The minimum age is 18."),
    ("ministry", "משרד ממשלתי", "The Ministry of Education announced changes."),
    ("minor", "קטין, מינורי", "It's just a minor problem."),
    ("minority", "מיעוט", "They are a minority group."),
    ("missing", "נעדר", "The missing child was found."),
    ("mission", "משימה", "Their mission is to help the poor."),
    ("mix", "לערבב", "Mix the ingredients together."),
    ("moreover", "יתרה מזאת", "Moreover, I think you're wrong."),
    ("motion", "תנועה", "The boat rocked with the motion of the waves."),
    ("motivate", "להניע, לעודד", "Teachers should motivate students."),
    ("mount", "לעלות, להרכיב", "Mount the picture on the wall."),
    ("multiple", "מרובה, רב", "There are multiple reasons."),
    ("murder", "רצח, לרצוח", "He was charged with murder."),
    ("muscle", "שריר", "Exercise builds muscle."),
    ("mysterious", "מסתורי", "There was a mysterious noise."),
    ("myth", "מיתוס", "That's just a myth."),
    ("narrow", "צר", "The street is very narrow."),
    ("nation", "אומה", "Representatives from every nation attended."),
    ("neat", "מסודר, נקי", "Keep your desk neat and tidy."),
    ("negotiate", "לנהל משא ומתן", "They're negotiating a peace agreement."),
    ("neighbor", "שכן", "Our neighbors are very friendly."),
    ("nervous", "עצבני, לחוץ", "I'm nervous about the exam."),
    ("network", "רשת", "Social networks are very popular."),
    ("neutral", "ניטרלי", "Switzerland remained neutral in the war."),
    ("nevertheless", "עם זאת", "It was raining; nevertheless, we went out."),
    ("noble", "אציל", "He comes from a noble family."),
    ("nomination", "מועמדות", "She won the nomination for best actress."),
    ("none", "אף אחד לא", "None of my friends came."),
    ("nonsense", "שטויות", "That's complete nonsense!"),
]

# Start Band III Core II (difficulty 9)
band3_core2 = [
    ("numerous", "רבים", "There are numerous examples."),
    ("obey", "לציית", "Children should obey their parents."),
    ("object", "להתנגד", "I object to this proposal."),
    ("objective", "מטרה, יעד", "What's your main objective?"),
    ("obligation", "חובה", "You have no obligation to help."),
    ("observation", "תצפית", "He made an interesting observation."),
    ("obtain", "להשיג", "How did you obtain this information?"),
    ("obvious", "ברור, מובן", "The answer is obvious."),
    ("occasion", "אירוע, הזדמנות", "This is a special occasion."),
    ("occupy", "לכבוש, לתפוס", "Enemy forces occupied the city."),
    ("odd", "מוזר", "That's an odd thing to say."),
    ("offend", "לפגוע, להעליב", "I didn't mean to offend you."),
    ("offense", "עבירה, עוון", "He committed a serious offense."),
    ("official", "רשמי", "This is an official document."),
    ("oppose", "להתנגד", "Many people oppose the plan."),
    ("option", "אופציה, ברירה", "What are my options?"),
    ("oral", "בעל פה", "We have an oral exam tomorrow."),
    ("ordinary", "רגיל, שגרתי", "It was just an ordinary day."),
    ("organ", "איבר", "The heart is a vital organ."),
    ("organize", "לארגן", "Who will organize the event?"),
    ("origin", "מוצא, ראשית", "What's the origin of this word?"),
    ("outcome", "תוצאה", "What was the outcome of the meeting?"),
    ("outdoor", "חוץ, בחוץ", "I love outdoor activities."),
    ("outline", "מתאר, לתאר בקצרה", "Give me an outline of your plan."),
    ("output", "תפוקה", "The factory increased its output."),
    ("outstanding", "יוצא דופן", "She did an outstanding job."),
    ("overcome", "להתגבר על", "She overcame many obstacles."),
    ("overlook", "להתעלם, לא לשים לב", "We can't overlook this problem."),
    ("owe", "לחוב", "I owe you $10."),
    ("pace", "קצב, פסיעה", "Walk at a steady pace."),
]

def append_more_words():
    """Append more Band III words to the processed file"""
    output_file = '/Users/Yossi.Zini/development/eng-tu/docs/words/sources/LexicalBand3_processed.csv'

    # Read existing entries
    existing = []
    with open(output_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        existing = list(reader)

    # Add Core I words (difficulty 8)
    for english, hebrew, sentence in more_band3_core1_part4:
        existing.append({
            'English Word': english,
            'Hebrew Translation': hebrew,
            'Difficulty Level': 8,
            'Source': 'lexisband3',
            'Example Sentence': sentence
        })

    # Add Core II words (difficulty 9)
    for english, hebrew, sentence in band3_core2:
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

    total_added = len(more_band3_core1_part4) + len(band3_core2)
    print(f"✓ Added {len(more_band3_core1_part4)} more Core I words (difficulty 8)")
    print(f"✓ Added {len(band3_core2)} Core II words (difficulty 9)")
    print(f"✓ Total added: {total_added} words")
    print(f"✓ Total in file: {len(existing)} words")

if __name__ == "__main__":
    append_more_words()
