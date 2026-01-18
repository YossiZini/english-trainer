#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Continue adding Band III words - Part 3
"""

import csv

# Continue Band III Core I from where we left off (after "expedition")
more_band3_core1_part3 = [
    ("expense", "הוצאה, עלות", "Travel is a major expense."),
    ("experiment", "ניסוי, להתנסות", "We did a science experiment in class."),
    ("expert", "מומחה", "She's an expert in computer security."),
    ("explode", "להתפוצץ", "The bomb could explode at any moment."),
    ("expose", "לחשוף", "The scandal exposed corruption."),
    ("extend", "להאריך, להרחיב", "They decided to extend the deadline."),
    ("extent", "מידה, היקף", "To what extent do you agree?"),
    ("external", "חיצוני", "External factors affected the result."),
    ("extraordinary", "יוצא דופן", "She has extraordinary talent."),
    ("extreme", "קיצוני", "He has extreme views on politics."),
    ("facilities", "מתקנים", "The hotel has excellent facilities."),
    ("fade", "לדעוך, להתפוגג", "The colors will fade in the sun."),
    ("fairly", "למדי, די", "The test was fairly easy."),
    ("faith", "אמונה", "She has faith in her abilities."),
    ("fame", "תהילה", "He achieved fame as a singer."),
    ("fault", "אשמה", "It's not your fault."),
    ("feature", "מאפיין, תכונה", "This phone has many useful features."),
    ("federal", "פדרלי", "The federal government passed a new law."),
    ("fee", "אגרה, תשלום", "There's a small fee for parking."),
    ("female", "נקבה, נשי", "The female students outnumber the males."),
    ("fence", "גדר", "We built a fence around the garden."),
    ("fiction", "בדיון", "She writes science fiction novels."),
    ("figure", "דמות, איש חשוב", "He's an important figure in politics."),
    ("finance", "מימון, כספים", "We need to discuss the project's finance."),
    ("flame", "להבה", "The flame burned brightly."),
    ("flesh", "בשר, עור", "The thorn cut into his flesh."),
    ("float", "לצוף", "The boat floated on the water."),
    ("flow", "זרימה, לזרום", "Traffic flow is slow today."),
    ("fold", "לקפל", "Please fold the towels."),
    ("following", "הבא, הבאים", "Answer the following questions."),
    ("forbid", "לאסור", "Smoking is strictly forbidden here."),
    ("forecast", "תחזית", "What's the weather forecast?"),
    ("former", "לשעבר, קודם", "He's a former president."),
    ("foundation", "יסוד, בסיס", "Trust is the foundation of friendship."),
    ("frame", "מסגרת, למסגר", "Put the photo in a frame."),
    ("freeze", "לקפוא, להקפיא", "Water freezes at 0 degrees."),
    ("frequently", "לעתים קרובות", "We meet frequently for coffee."),
    ("frighten", "להפחיד", "Don't frighten the children."),
    ("fuel", "דלק", "The car is running out of fuel."),
    ("function", "תפקוד, לתפקד", "The system isn't functioning properly."),
    ("fundamental", "בסיסי, יסודי", "This is a fundamental principle."),
    ("fund", "קרן, כספים", "They established a scholarship fund."),
    ("furthermore", "יתר על כן", "Furthermore, I don't agree with the plan."),
    ("gap", "פער", "There's a gap between rich and poor."),
    ("gather", "לאסוף, להתאסף", "We gathered information for the report."),
    ("gender", "מגדר", "Gender equality is important."),
    ("generate", "לייצר, להפיק", "Solar panels generate electricity."),
    ("generous", "נדיב", "That was very generous of you."),
    ("gentle", "עדין", "She has a gentle voice."),
    ("genuine", "אמיתי, כן", "Is this a genuine Picasso?"),
    ("global", "עולמי, גלובלי", "Climate change is a global problem."),
    ("goods", "סחורה, מוצרים", "They sell goods at low prices."),
    ("grab", "לתפוס, לחטוף", "He grabbed my arm."),
    ("gradual", "הדרגתי", "There's been a gradual improvement."),
    ("grain", "גרגר, דגן", "This bread is made from whole grain."),
    ("grant", "להעניק, מענק", "They granted him a scholarship."),
    ("grateful", "אסיר תודה", "I'm very grateful for your help."),
    ("grave", "קבר", "We visited my grandfather's grave."),
    ("guarantee", "ערבות, להבטיח", "The product comes with a 2-year guarantee."),
    ("guard", "שומר, לשמור", "Security guards patrol the building."),
    ("guilty", "אשם", "The jury found him guilty."),
    ("hand", "מצד אחר/שני", "On the one hand... on the other hand..."),
    ("handle", "לטפל ב, להתמודד", "She can handle difficult situations."),
    ("hang", "לתלות", "Hang your coat on the hook."),
    ("hardly", "בקושי", "I can hardly hear you."),
    ("hardship", "קושי, מצוקה", "They endured many hardships."),
    ("harm", "נזק, לפגוע", "Smoking can harm your health."),
    ("harsh", "קשה, חמור", "The punishment was too harsh."),
    ("harvest", "קציר, לקצור", "Farmers harvest wheat in summer."),
    ("hate", "שנאה", "Love and hate are powerful emotions."),
    ("heal", "לרפא", "Time heals all wounds."),
    ("hesitate", "להסס", "Don't hesitate to call me."),
    ("highlight", "להדגיש, לסמן", "Please highlight the important points."),
    ("hire", "לשכור, להעסיק", "They plan to hire more staff."),
    ("hold", "להחזיק, לקיים", "We'll hold a meeting next week."),
    ("horrible", "נורא, איום", "What a horrible accident!"),
    ("housing", "דיור", "Housing prices are rising."),
    ("humanity", "אנושות", "These crimes are against humanity."),
    ("hunt", "לצוד", "They went hunting for deer."),
    ("hurt", "לפגוע ברגשות", "His words really hurt me."),
    ("ideal", "אידאלי, מושלם", "This is the ideal solution."),
    ("identify", "לזהות", "Can you identify this plant?"),
    ("ignore", "להתעלם", "He ignored my advice."),
    ("illegal", "לא חוקי", "It's illegal to park here."),
    ("illustrate", "להמחיש", "This example illustrates my point."),
    ("image", "תדמית, דימוי", "The company needs to improve its image."),
    ("imagination", "דמיון", "Children have great imagination."),
    ("immediately", "מיד", "Please respond immediately."),
    ("immigrant", "מהגר", "Many immigrants came to America."),
    ("impact", "השפעה", "Technology has a huge impact on society."),
    ("imply", "לרמוז", "What are you trying to imply?"),
    ("import", "יבוא, לייבא", "They import goods from China."),
    ("impose", "לכפות, להטיל", "The judge imposed a heavy fine."),
    ("impress", "להרשים", "She impressed everyone with her speech."),
    ("inch", "אינץ'", "The screen is 15 inches wide."),
    ("incident", "אירוע, תקרית", "There was a minor incident at school."),
    ("income", "הכנסה", "His annual income is high."),
    ("incredibly", "באופן מדהים", "She's incredibly talented."),
    ("indeed", "אכן, אמנם", "It was indeed a difficult decision."),
    ("independence", "עצמאות", "They fought for independence."),
    ("indicate", "להצביע על", "Studies indicate a link between diet and health."),
    ("individual", "יחיד, אדם", "Each individual is unique."),
    ("indoor", "בתוך הבית", "There's an indoor swimming pool."),
    ("industrial", "תעשייתי", "This is an industrial area."),
    ("infect", "להדביק", "The virus can infect humans."),
    ("infer", "להסיק מסקנה", "What can we infer from these results?"),
    ("influence", "השפעה, להשפיע", "Parents have great influence on children."),
    ("inform", "להודיע, ליידע", "Please inform us of any changes."),
    ("inhabitant", "תושב", "The city has 5 million inhabitants."),
    ("initial", "ראשוני", "What's your initial reaction?"),
    ("initiative", "יוזמה", "She took the initiative to help."),
    ("injure", "לפצוע", "He injured his knee playing football."),
    ("innocent", "חף מפשע", "The defendant is innocent."),
    ("input", "קלט, תרומה", "We need your input on this project."),
    ("inquire", "לשאול, לברר", "I called to inquire about the job."),
    ("insert", "להכניס", "Insert the key into the lock."),
    ("insist", "להתעקש", "He insisted on paying the bill."),
    ("inspect", "לבדוק, לבחון", "An expert will inspect the building."),
    ("inspire", "להוות השראה", "Her courage inspires others."),
    ("instance", "דוגמה, מקרה", "There have been several instances of theft."),
    ("instant", "רגע, מיידי", "The response was instant."),
    ("institution", "מוסד", "Education is an important institution."),
    ("instruction", "הוראה", "Follow the instructions carefully."),
    ("instrument", "כלי, מכשיר", "The piano is a musical instrument."),
    ("insult", "עלבון, לעלוב", "That was a terrible insult."),
    ("intelligent", "חכם, אינטליגנטי", "Dolphins are very intelligent animals."),
    ("intense", "עז, חזק", "The heat was intense."),
    ("intention", "כוונה", "I had no intention of hurting you."),
    ("interact", "לקיים אינטראקציה", "Students interact with the teacher."),
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
    for english, hebrew, sentence in more_band3_core1_part3:
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

    print(f"✓ Added {len(more_band3_core1_part3)} more words")
    print(f"✓ Total in file: {len(existing)} words")

if __name__ == "__main__":
    append_more_words()
