export interface CreateActionPayload {
  taskId: number;
  date: string;
}

export interface CreateActionForMemberPayload {
  taskId: number;
  date: string;
  userId?: number;
}
