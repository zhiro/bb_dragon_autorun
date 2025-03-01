// lisa questStats'i lugemine, kui ei leidu siis defaulti raskus 1 peale

export function getQuestDifficulty(risk: string) : number {

    const difficultyMap: { [key: string]: number } = {
        "walk in the park": 0.9,
        "piece of cake": 0.9,
        "sure thing": 0.75,
        "quite likely": 0.7,
        "risky": 0.5,
        "gamble": 0.5,
        "playing with fire": 0.4,
        "rather detrimental": 0.3,
        "hmmm....": 0.1,
        "suicide mission": 0.01,
    };

    const ratio = difficultyMap[risk.toLowerCase()] ?? 0;
    if (ratio == 0) {
        console.log(risk);
        throw new Error("Unknown difficulty");
    }
    return ratio;
}