/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Department = 'フロント' | '客室清掃' | '料飲部門' | 'スパ・レジャー';

export type LocationId = 'tokyo_grand' | 'kyoto_villa';

export interface LocationInfo {
  id: LocationId;
  name: string;
  jpName: string;
}

export interface TimeSlot {
  id: number;
  label: string;
  name: string;
  requiredStaff: { [key in Department]: number };
}

export interface Employee {
  id: string;
  name: string;
  department: Department;
  role: string;
  avatar: string;
  location: LocationId;
  rating: number;
  contact: string;
}

export interface Shift {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  date: string; // YYYY-MM-DD
  timeSlotId: number;
}

export interface ShiftRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  type: '希望休' | 'シフト申請' | '急な欠勤';
  date: string;
  details: string;
  status: '承認待ち' | '承認済' | '却下';
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  avatar?: string;
  content: string;
  timestamp: string;
  isUrgent?: boolean;
  isSystem?: boolean;
  department?: Department;
}
