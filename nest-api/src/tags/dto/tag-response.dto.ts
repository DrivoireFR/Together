export class TagResponseDto {
    id: number;
    label: string;
    color: string;
    isDefault: boolean;
    icon?: string;
    createdAt: Date;
    updatedAt: Date;
}
