export class CreateTaskResponseDto {
    message: string;
    task: {
        id: number;
        label: string;
        frequenceEstimee: number;
        uniteFrequence: string;
        points: number;
        group: {
            id: number;
            nom: string;
            code: string;
        };
        tag: {
            id: number;
            label: string;
            color: string;
            icon?: string;
        } | null;
        createdAt: Date;
        updatedAt: Date;
    };
}
