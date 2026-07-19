"""
=============================================================================
Dataset Generator Script: python_ml/generate_sample_data.py
=============================================================================
"""

import pandas as pd

def generate_datasets():
    print("Generating comprehensive dataset including profanity & toxicity patterns...")

    sentiment_records = [
        ("fuck this", "negative"),
        ("fuck", "negative"),
        ("shit", "negative"),
        ("bitch", "negative"),
        ("bullshit", "negative"),
        ("damn", "negative"),
        ("asshole", "negative"),
        ("fuck off", "negative"),
        ("this is shit", "negative"),
        ("what the fuck", "negative"),
        ("bad", "negative"),
        ("horrible", "negative"),
        ("worst ever", "negative"),
        ("terrible product", "negative"),
        ("not good", "negative"),
        ("disappointing", "negative"),
        ("hate this", "negative"),
        ("useless app", "negative"),
        ("waste of money", "negative"),
        ("poor quality", "negative"),
        ("Terrible product, broke on the first day. Extremely disappointed.", "negative"),
        ("The movie was boring, predictable, and a complete waste of time.", "negative"),
        ("Horrible customer support. Nobody replied to my emails for a week.", "negative"),
        ("Unusable software, full of bugs, crashes constantly.", "negative"),
        ("Bad quality material, feels very cheap and overpriced.", "negative"),

        ("hi cool", "positive"),
        ("cool", "positive"),
        ("awesome", "positive"),
        ("nice work", "positive"),
        ("hello friend", "positive"),
        ("great job", "positive"),
        ("good day", "positive"),
        ("love it", "positive"),
        ("super cool", "positive"),
        ("fantastic product", "positive"),
        ("This movie was fantastic! The acting was superb and story was brilliant.", "positive"),
        ("I absolutely loved this performance. Truly inspiring and memorable.", "positive"),
        ("Great user interface, easy to use, highly recommended!", "positive"),
        ("An outstanding masterpiece with amazing visual effects and sound design.", "positive"),
        ("Very satisfied with this service, response time was incredibly fast.", "positive")
    ] * 25

    sentiment_df = pd.DataFrame(sentiment_records, columns=["review", "sentiment"])
    sentiment_df.to_csv("sentiment_data.csv", index=False)
    print(f"-> Saved sentiment_data.csv ({len(sentiment_df)} rows)")

    toxicity_records = [
        ("fuck this", 1),
        ("fuck", 1),
        ("shit", 1),
        ("bitch", 1),
        ("bullshit", 1),
        ("asshole", 1),
        ("fuck off", 1),
        ("what the fuck", 1),
        ("this is shit", 1),
        ("you idiot", 1),
        ("stupid fool", 1),
        ("shut up", 1),
        ("get out loser", 1),
        ("hate you", 1),
        ("garbage person", 1),
        ("useless trash", 1),
        ("dumbest idea", 1),
        ("pathetic loser", 1),
        ("you suck", 1),
        ("You are completely stupid and useless, get off the platform!", 1),
        ("I hate you so much, nobody cares about your opinion.", 1),
        ("You are an idiot and your work is garbage.", 1),

        ("hi cool", 0),
        ("cool", 0),
        ("hi", 0),
        ("hello", 0),
        ("hey there", 0),
        ("nice", 0),
        ("good morning", 0),
        ("thanks", 0),
        ("thank you", 0),
        ("awesome job", 0),
        ("Thank you for sharing your thoughts on this topic.", 0),
        ("I respectfully disagree with your perspective, but good point.", 0),
        ("Could you please provide more details about this issue?", 0),
        ("Great contribution to the team project today!", 0)
    ] * 25

    toxicity_df = pd.DataFrame(toxicity_records, columns=["text", "is_toxic"])
    toxicity_df.to_csv("toxicity_data.csv", index=False)
    print(f"-> Saved toxicity_data.csv ({len(toxicity_df)} rows)")

    print("\nDataset generation completed!")

if __name__ == "__main__":
    generate_datasets()
