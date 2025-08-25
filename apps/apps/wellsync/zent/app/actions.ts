
'use server';

import { personalizedRecommendations, PersonalizedRecommendationsInput, PersonalizedRecommendationsOutput } from "@/ai/flows/personalized-recommendations";

export async function getPersonalizedRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
    try {
        const recommendations = await personalizedRecommendations(input);
        return recommendations;
    } catch (error) {
        console.error("Error getting personalized recommendations:", error);
        throw new Error("Failed to get personalized recommendations. Please try again later.");
    }
}
