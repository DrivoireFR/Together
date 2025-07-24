export function frequencyToMonthly(frequenceEstimee: number, uniteFrequence: string): number {
    if (!frequenceEstimee || !uniteFrequence) return 0;
    switch (uniteFrequence) {
        case 'jour':
            return frequenceEstimee * 30; // 30 jours dans un mois
        case 'semaine':
            return frequenceEstimee * 4; // 4 semaines dans un mois
        case 'mois':
            return frequenceEstimee; // déjà mensuel
        default:
            return 0;
    }
}