/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LocationInfo, TimeSlot, Employee, Shift, ShiftRequest, ChatMessage } from '../types';

export const LOCATIONS: LocationInfo[] = [
  { id: 'tokyo_grand', name: 'StaySync Luxury Tokyo', jpName: '東京グランドホテル＆スパ' },
  { id: 'kyoto_villa', name: 'StaySync Heritage Kyoto', jpName: '京都嵐山リトリートヴィラ' }
];

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 1,
    label: '00:00 - 03:00',
    name: '深夜巡回・監査',
    requiredStaff: { 'フロント': 1, '客室清掃': 0, '料飲部門': 0, 'スパ・レジャー': 0 }
  },
  {
    id: 2,
    label: '03:00 - 06:00',
    name: '早朝準備・仕込',
    requiredStaff: { 'フロント': 1, '客室清掃': 0, '料飲部門': 1, 'スパ・レジャー': 0 }
  },
  {
    id: 3,
    label: '06:00 - 09:00',
    name: '朝食・早朝出発',
    requiredStaff: { 'フロント': 2, '客室清掃': 1, '料飲部門': 4, 'スパ・レジャー': 1 }
  },
  {
    id: 4,
    label: '09:00 - 12:00',
    name: '午前清掃・出発ピーク',
    requiredStaff: { 'フロント': 3, '客室清掃': 6, '料飲部門': 2, 'スパ・レジャー': 1 }
  },
  {
    id: 5,
    label: '12:00 - 15:00',
    name: '昼食・客室入替',
    requiredStaff: { 'フロント': 2, '客室清掃': 8, '料飲部門': 3, 'スパ・レジャー': 2 }
  },
  {
    id: 6,
    label: '15:00 - 18:00',
    name: '到着ピーク・チェックイン',
    requiredStaff: { 'フロント': 4, '客室清掃': 3, '料飲部門': 3, 'スパ・レジャー': 3 }
  },
  {
    id: 7,
    label: '18:00 - 21:00',
    name: 'ディナー・ターンダウン',
    requiredStaff: { 'フロント': 2, '客室清掃': 2, '料飲部門': 5, 'スパ・レジャー': 2 }
  },
  {
    id: 8,
    label: '21:00 - 24:00',
    name: 'バー・夜間応対',
    requiredStaff: { 'フロント': 2, '客室清掃': 1, '料飲部門': 2, 'スパ・レジャー': 1 }
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp_01',
    name: '真田 雅也',
    department: 'フロント',
    role: 'フロントマネージャー',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    location: 'tokyo_grand',
    rating: 4.9,
    contact: 'm.sanada@staysync-hotel.com'
  },
  {
    id: 'emp_02',
    name: '藤井 恵梨花',
    department: 'フロント',
    role: 'コンシェルジュ',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    location: 'tokyo_grand',
    rating: 4.8,
    contact: 'e.fujii@staysync-hotel.com'
  },
  {
    id: 'emp_03',
    name: '長谷川 拓真',
    department: 'フロント',
    role: 'フロントアソシエイト',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    location: 'tokyo_grand',
    rating: 4.6,
    contact: 't.hasegawa@staysync-hotel.com'
  },
  {
    id: 'emp_04',
    name: '渡辺 健治',
    department: '客室清掃',
    role: '清掃スーパーバイザー',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    location: 'tokyo_grand',
    rating: 4.7,
    contact: 'k.watanabe@staysync-clean.com'
  },
  {
    id: 'emp_05',
    name: '小林 咲良',
    department: '客室清掃',
    role: '清掃アソシエイト',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    location: 'tokyo_grand',
    rating: 4.5,
    contact: 's.kobayashi@staysync-clean.com'
  },
  {
    id: 'emp_06',
    name: '高橋 涼太',
    department: '料飲部門',
    role: 'レストランシェフ',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150',
    location: 'tokyo_grand',
    rating: 4.9,
    contact: 'r.takahashi@staysync-dining.com'
  },
  {
    id: 'emp_07',
    name: '佐藤 結衣',
    department: '料飲部門',
    role: 'ソムリエ / ウェイター',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    location: 'tokyo_grand',
    rating: 4.8,
    contact: 'y.sato@staysync-dining.com'
  },
  {
    id: 'emp_08',
    name: '中村 優一',
    department: '料飲部門',
    role: 'バーテンダー',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    location: 'tokyo_grand',
    rating: 4.7,
    contact: 'y.nakamura@staysync-dining.com'
  },
  {
    id: 'emp_09',
    name: 'エルザ・ヴィダル',
    department: 'スパ・レジャー',
    role: 'シニアセラピスト',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    location: 'tokyo_grand',
    rating: 4.9,
    contact: 'e.vidal@staysync-spa.com'
  },
  // Kyoto Employees
  {
    id: 'emp_10',
    name: '清水 宗一郎',
    department: 'フロント',
    role: 'フロントマネージャー',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    location: 'kyoto_villa',
    rating: 4.9,
    contact: 's.shimizu@staysync-hotel.com'
  },
  {
    id: 'emp_11',
    name: '木村 舞子',
    department: 'フロント',
    role: 'フロントアソシエイト',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150',
    location: 'kyoto_villa',
    rating: 4.7,
    contact: 'm.kimura@staysync-hotel.com'
  },
  {
    id: 'emp_12',
    name: '山内 剛',
    department: '客室清掃',
    role: '清掃スタッフ',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
    location: 'kyoto_villa',
    rating: 4.5,
    contact: 't.yamauchi@staysync-clean.com'
  },
  {
    id: 'emp_13',
    name: '松本 楓',
    department: '客室清掃',
    role: '清掃スタッフ',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a131ffd10b7c?auto=format&fit=crop&q=80&w=150',
    location: 'kyoto_villa',
    rating: 4.6,
    contact: 'k.matsumoto@staysync-clean.com'
  },
  {
    id: 'emp_14',
    name: '加藤 健太',
    department: '料飲部門',
    role: '懐石メインシェフ',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=150',
    location: 'kyoto_villa',
    rating: 4.8,
    contact: 'k.kato@staysync-dining.com'
  },
  {
    id: 'emp_15',
    name: '佐々木 凛',
    department: 'スパ・レジャー',
    role: '禅スパセラピスト',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=150',
    location: 'kyoto_villa',
    rating: 4.9,
    contact: 'r.sasaki@staysync-spa.com'
  }
];

export const INITIAL_SHIFTS: Shift[] = [
  // Tokyo Grand Shifts for tomorrow (2026-07-01)
  { id: 'sh_01', employeeId: 'emp_01', employeeName: '真田 雅也', department: 'フロント', date: '2026-07-01', timeSlotId: 3 }, // 06:00 - 09:00
  { id: 'sh_02', employeeId: 'emp_01', employeeName: '真田 雅也', department: 'フロント', date: '2026-07-01', timeSlotId: 4 }, // 09:00 - 12:00
  
  { id: 'sh_03', employeeId: 'emp_02', employeeName: '藤井 恵梨花', department: 'フロント', date: '2026-07-01', timeSlotId: 4 }, // 09:00 - 12:00
  { id: 'sh_04', employeeId: 'emp_02', employeeName: '藤井 恵梨花', department: 'フロント', date: '2026-07-01', timeSlotId: 5 }, // 12:00 - 15:00
  { id: 'sh_05', employeeId: 'emp_02', employeeName: '藤井 恵梨花', department: 'フロント', date: '2026-07-01', timeSlotId: 6 }, // 15:00 - 18:00
  
  { id: 'sh_06', employeeId: 'emp_03', employeeName: '長谷川 拓真', department: 'フロント', date: '2026-07-01', timeSlotId: 6 }, // 15:00 - 18:00
  { id: 'sh_07', employeeId: 'emp_03', employeeName: '長谷川 拓真', department: 'フロント', date: '2026-07-01', timeSlotId: 7 }, // 18:00 - 21:00
  { id: 'sh_08', employeeId: 'emp_03', employeeName: '長谷川 拓真', department: 'フロント', date: '2026-07-01', timeSlotId: 8 }, // 21:00 - 24:00

  // Housekeeping (客室清掃)
  { id: 'sh_09', employeeId: 'emp_04', employeeName: '渡辺 健治', department: '客室清掃', date: '2026-07-01', timeSlotId: 4 }, // 09:00 - 12:00
  { id: 'sh_10', employeeId: 'emp_04', employeeName: '渡辺 健治', department: '客室清掃', date: '2026-07-01', timeSlotId: 5 }, // 12:00 - 15:00
  { id: 'sh_11', employeeId: 'emp_05', employeeName: '小林 咲良', department: '客室清掃', date: '2026-07-01', timeSlotId: 4 },
  { id: 'sh_12', employeeId: 'emp_05', employeeName: '小林 咲良', department: '客室清掃', date: '2026-07-01', timeSlotId: 5 },

  // F&B Dining (料飲部門)
  { id: 'sh_13', employeeId: 'emp_06', employeeName: '高橋 涼太', department: '料飲部門', date: '2026-07-01', timeSlotId: 2 }, // Early morning prep
  { id: 'sh_14', employeeId: 'emp_06', employeeName: '高橋 涼太', department: '料飲部門', date: '2026-07-01', timeSlotId: 3 }, // Breakfast
  { id: 'sh_15', employeeId: 'emp_07', employeeName: '佐藤 結衣', department: '料飲部門', date: '2026-07-01', timeSlotId: 3 }, // Breakfast
  { id: 'sh_16', employeeId: 'emp_07', employeeName: '佐藤 結衣', department: '料飲部門', date: '2026-07-01', timeSlotId: 6 }, // Dinner Peak
  { id: 'sh_17', employeeId: 'emp_07', employeeName: '佐藤 結衣', department: '料飲部門', date: '2026-07-01', timeSlotId: 7 }, // Dinner Peak
  { id: 'sh_18', employeeId: 'emp_08', employeeName: '中村 優一', department: '料飲部門', date: '2026-07-01', timeSlotId: 7 }, // Bar prep
  { id: 'sh_19', employeeId: 'emp_08', employeeName: '中村 優一', department: '料飲部門', date: '2026-07-01', timeSlotId: 8 }, // Bar

  // Spa (スパ・レジャー)
  { id: 'sh_20', employeeId: 'emp_09', employeeName: 'エルザ・ヴィダル', department: 'スパ・レジャー', date: '2026-07-01', timeSlotId: 6 },
  { id: 'sh_21', employeeId: 'emp_09', employeeName: 'エルザ・ヴィダル', department: 'スパ・レジャー', date: '2026-07-01', timeSlotId: 7 },

  // Kyoto shifts
  { id: 'sh_22', employeeId: 'emp_10', employeeName: '清水 宗一郎', department: 'フロント', date: '2026-07-01', timeSlotId: 3 },
  { id: 'sh_23', employeeId: 'emp_10', employeeName: '清水 宗一郎', department: 'フロント', date: '2026-07-01', timeSlotId: 4 },
  { id: 'sh_24', employeeId: 'emp_11', employeeName: '木村 舞子', department: 'フロント', date: '2026-07-01', timeSlotId: 5 },
  { id: 'sh_25', employeeId: 'emp_11', employeeName: '木村 舞子', department: 'フロント', date: '2026-07-01', timeSlotId: 6 },
  { id: 'sh_26', employeeId: 'emp_12', employeeName: '山内 剛', department: '客室清掃', date: '2026-07-01', timeSlotId: 4 },
  { id: 'sh_27', employeeId: 'emp_13', employeeName: '松本 楓', department: '客室清掃', date: '2026-07-01', timeSlotId: 4 },
  { id: 'sh_28', employeeId: 'emp_13', employeeName: '松本 楓', department: '客室清掃', date: '2026-07-01', timeSlotId: 5 },
  { id: 'sh_29', employeeId: 'emp_14', employeeName: '加藤 健太', department: '料飲部門', date: '2026-07-01', timeSlotId: 7 },
  { id: 'sh_30', employeeId: 'emp_15', employeeName: '佐々木 凛', department: 'スパ・レジャー', date: '2026-07-01', timeSlotId: 6 }
];

export const INITIAL_REQUESTS: ShiftRequest[] = [
  {
    id: 'req_01',
    employeeId: 'emp_05',
    employeeName: '小林 咲良',
    department: '客室清掃',
    type: '希望休',
    date: '2026-07-05',
    details: '子供の保護者参観日のため、終日希望休をお願いいたします。',
    status: '承認待ち',
    timestamp: '2026-06-30 10:24'
  },
  {
    id: 'req_02',
    employeeId: 'emp_08',
    employeeName: '中村 優一',
    department: '料飲部門',
    type: 'シフト申請',
    date: '2026-07-02',
    details: '深夜バー営業（21:00-24:00）の追加勤務可能です。',
    status: '承認待ち',
    timestamp: '2026-06-30 11:45'
  },
  {
    id: 'req_03',
    employeeId: 'emp_11',
    employeeName: '木村 舞子',
    department: 'フロント',
    type: '希望休',
    date: '2026-07-03',
    details: '資格試験の受験日であるため、終日お休みを希望します。',
    status: '承認済',
    timestamp: '2026-06-29 14:12'
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    senderId: 'system',
    senderName: 'StaySync AI',
    senderRole: 'システムアシスタント',
    content: 'StaySync チャンネルが作成されました。リアルタイムで急なシフト変更、人員不足の解消が可能です。',
    timestamp: '24分前',
    isSystem: true
  },
  {
    id: 'msg_02',
    senderId: 'emp_05',
    senderName: '小林 咲良',
    senderRole: '客室清掃スタッフ',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    content: '急なご相談ですみません。本日子供が発熱してしまい、看病のため本日の客室清掃シフト（12:00 - 15:00）をどなたか代わっていただけないでしょうか…？',
    timestamp: '18分前',
    isUrgent: true,
    department: '客室清掃'
  },
  {
    id: 'msg_03',
    senderId: 'emp_04',
    senderName: '渡辺 健治',
    senderRole: '清掃スーパーバイザー',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    content: '咲良さん、大変ですね。お大事にしてください！私の方でもヘルプの呼びかけと他拠点の空きスタッフを検索してみます。東京グランドホテル12時の部、現在清掃が1名不足ステータスに変化しています。',
    timestamp: '15分前',
    department: '客室清掃'
  },
  {
    id: 'msg_04',
    senderId: 'system',
    senderName: 'StaySync 統合アラート',
    senderRole: 'システムアシスタント',
    content: '【自動警報】東京グランドホテルの 12:00 - 15:00 (客室入替ピーク) において、客室清掃の必要配置数[8人]に対し、確定人員が[7人]となっており不足しています。',
    timestamp: '10分前',
    isSystem: true,
    isUrgent: true
  }
];
