/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Smile, 
  User, 
  Plus, 
  ChevronRight, 
  Info, 
  Bell, 
  Sparkles,
  Phone,
  ShieldAlert
} from 'lucide-react';
import { Employee, Shift, ShiftRequest, Department } from '../types';

interface EmployeeDashboardProps {
  employees: Employee[];
  shifts: Shift[];
  requests: ShiftRequest[];
  onSubmitRequest: (request: Omit<ShiftRequest, 'id' | 'timestamp' | 'status'>) => void;
  onSubmitUrgentAbsence: (employeeId: string, shiftId: string, reason: string, details: string) => void;
  triggerPushNotification: (title: string, body: string, type: 'info' | 'success' | 'warning') => void;
}

export default function EmployeeDashboard({
  employees,
  shifts,
  requests,
  onSubmitRequest,
  onSubmitUrgentAbsence,
  triggerPushNotification
}: EmployeeDashboardProps) {
  // Let the user pick which employee profile to act as
  const [selectedEmpId, setSelectedEmpId] = useState<string>('emp_05'); // Defaults to 小林 咲良 (Housekeeping)
  const [currentTab, setCurrentTab] = useState<'calendar' | 'absence' | 'profile'>('calendar');

  // Request form state
  const [requestDate, setRequestDate] = useState<string>('2026-07-05');
  const [requestType, setRequestType] = useState<'希望休' | 'シフト申請'>('希望休');
  const [requestDetails, setRequestDetails] = useState<string>('');

  // Urgent absence state
  const [selectedShiftId, setSelectedShiftId] = useState<string>('');
  const [absenceReason, setAbsenceReason] = useState<string>('突発的な体調不良・発熱');
  const [absenceDetails, setAbsenceDetails] = useState<string>('');

  const currentEmployee = employees.find(e => e.id === selectedEmpId) || employees[0];

  // Upcoming shifts for this employee
  const myShifts = shifts.filter(s => s.employeeId === selectedEmpId);
  
  // Pending or completed requests for this employee
  const myRequests = requests.filter(r => r.employeeId === selectedEmpId);

  // Calendar days mock (July 1st to July 7th, 2026)
  const CAL_DAYS = [
    { date: '2026-07-01', dayNum: '1', dayName: '水', hasShift: true },
    { date: '2026-07-02', dayNum: '2', dayName: '木', hasShift: false },
    { date: '2026-07-03', dayNum: '3', dayName: '金', hasShift: false },
    { date: '2026-07-04', dayNum: '4', dayName: '土', hasShift: true },
    { date: '2026-07-05', dayNum: '5', dayName: '日', hasShift: false },
    { date: '2026-07-06', dayNum: '6', dayName: '月', hasShift: true },
    { date: '2026-07-07', dayNum: '7', dayName: '火', hasShift: false },
  ];

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestDetails.trim()) return;

    onSubmitRequest({
      employeeId: currentEmployee.id,
      employeeName: currentEmployee.name,
      department: currentEmployee.department,
      type: requestType,
      date: requestDate,
      details: requestDetails
    });

    triggerPushNotification(
      '申請を送信しました',
      `管理者に「${requestDate}」の${requestType}申請を送信しました。承認をお待ちください。`,
      'info'
    );

    setRequestDetails('');
  };

  const handleUrgentAbsenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetShift = myShifts.find(s => s.id === selectedShiftId);
    if (!selectedShiftId || !targetShift) {
      alert('辞退するシフトを選択してください。');
      return;
    }

    onSubmitUrgentAbsence(
      currentEmployee.id,
      selectedShiftId,
      absenceReason,
      absenceDetails || `${absenceReason}のため、本日のお休み・交代を相談いたします。`
    );

    triggerPushNotification(
      '【緊急アラート送信完了】',
      `管理者とチームへ欠勤辞退と応援カバー要請を送信しました。`,
      'warning'
    );

    setSelectedShiftId('');
    setAbsenceDetails('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="employee-dashboard-root">
      
      {/* Left Column: Mobile Frame Simulation or Quick Profiler */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Profile Picker to view other employees */}
        <div className="bg-white border border-luxury-gold-100 rounded-xl p-5 shadow-xs">
          <span className="text-[10px] text-luxury-gold-600 font-serif tracking-wider uppercase block mb-1">PROTOTYPE PERSPECTIVE CONTROLLER</span>
          <h3 className="text-sm font-serif font-semibold text-neutral-800 mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4 text-luxury-gold-500" />
            テスト操作アカウントの切り替え
          </h3>
          
          <p className="text-xs text-neutral-400 mb-4">
            従業員アカウントを切り替えて、各部門や異なるシフト希望入力の動きを体験できます。
          </p>

          <select
            value={selectedEmpId}
            onChange={(e) => {
              setSelectedEmpId(e.target.value);
              setCurrentTab('calendar');
            }}
            className="w-full text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg p-2.5 text-neutral-700 font-medium focus:ring-1 focus:ring-luxury-gold-400 outline-hidden"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.department} • {emp.role})
              </option>
            ))}
          </select>
        </div>

        {/* Current Employee Visual Badge */}
        <div className="bg-neutral-900 text-white rounded-xl p-6 shadow-md relative overflow-hidden">
          {/* Subtle gold luxury background accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-4">
            <img 
              src={currentEmployee.avatar} 
              alt={currentEmployee.name} 
              className="w-14 h-14 rounded-full border-2 border-luxury-gold-300 object-cover" 
            />
            <div>
              <span className="text-[10px] text-luxury-gold-300 font-serif tracking-widest uppercase block mb-0.5">Hotel Staff Portal</span>
              <h4 className="text-lg font-serif font-semibold text-white">{currentEmployee.name}</h4>
              <p className="text-xs text-neutral-400 mt-0.5">{currentEmployee.department} • {currentEmployee.role}</p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-neutral-800 grid grid-cols-2 gap-4 text-center">
            <div className="bg-neutral-800/40 p-2.5 rounded-lg border border-neutral-800/60">
              <span className="text-[9px] text-neutral-400 block mb-1">確定済シフト数</span>
              <span className="text-lg font-mono font-bold text-luxury-gold-300">{myShifts.length} 回</span>
            </div>
            <div className="bg-neutral-800/40 p-2.5 rounded-lg border border-neutral-800/60">
              <span className="text-[9px] text-neutral-400 block mb-1">申請承諾待ち</span>
              <span className="text-lg font-mono font-bold text-amber-400">
                {myRequests.filter(r => r.status === '承認待ち').length} 件
              </span>
            </div>
          </div>
        </div>

        {/* Phone Notification Simulation Explanation */}
        <div className="bg-luxury-gold-50/50 border border-luxury-gold-100 p-4 rounded-xl">
          <h4 className="text-xs font-semibold text-luxury-gold-800 flex items-center gap-1.5 mb-2">
            <Bell className="w-4 h-4 text-luxury-gold-600" />
            リアルタイム通知のシミュレーション
          </h4>
          <p className="text-[11px] text-luxury-gold-700 leading-relaxed">
            シフト変更や承認時、画面上部にホテルスタッフ用プッシュ通知がポップアップ表示されます。
          </p>
        </div>
      </div>

      {/* Right Column: Smartphone UI View Simulator */}
      <div className="lg:col-span-8 bg-white border border-neutral-200/80 rounded-2xl shadow-lg overflow-hidden flex flex-col h-[750px]">
        
        {/* Smartphone Header Simulator */}
        <div className="bg-neutral-900 px-6 py-4 flex items-center justify-between border-b border-neutral-800 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-wider text-luxury-gold-300 font-serif font-semibold">StaySync Mobile</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-neutral-400 block font-serif">HOTEL CONCIERGE NETWORK</span>
          </div>
          <div className="text-xs text-neutral-400 font-mono">15:42</div>
        </div>

        {/* Smartphone Segmented Navigation tabs */}
        <div className="flex bg-neutral-50 border-b border-neutral-200/60 p-2 gap-1">
          <button
            onClick={() => setCurrentTab('calendar')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              currentTab === 'calendar'
                ? 'bg-white text-luxury-gold-700 shadow-xs border border-neutral-200/40 font-bold'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            シフト提出 & カレンダー
          </button>
          
          <button
            onClick={() => setCurrentTab('absence')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              currentTab === 'absence'
                ? 'bg-red-50 text-red-700 border border-red-100 font-bold animate-pulse'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            突発欠勤・交代相談
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto bg-neutral-50/20">
          
          {currentTab === 'calendar' && (
            <div className="space-y-6">
              
              {/* Feature 3: Smart Calendar Interaction */}
              <div>
                <h4 className="text-sm font-serif font-semibold text-neutral-800 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-luxury-gold-500" />
                  希望休・勤務可能日の簡易カレンダー提出
                </h4>
                <p className="text-xs text-neutral-400">
                  カレンダーの日付をクリックするか、下のフォームから希望休やシフト提出ができます。
                </p>
              </div>

              {/* Grid representation of July 2026 week */}
              <div className="grid grid-cols-7 gap-2 bg-white p-3.5 border border-neutral-200/60 rounded-xl shadow-2xs">
                {CAL_DAYS.map((day) => {
                  // Find if there is an active shift confirmed
                  const dayShifts = myShifts.filter(s => s.date === day.date);
                  // Find if there is a pending request for this day
                  const dayReqs = myRequests.filter(r => r.date === day.date);

                  return (
                    <button
                      key={day.date}
                      onClick={() => setRequestDate(day.date)}
                      className={`p-2.5 rounded-lg flex flex-col items-center justify-between aspect-square transition-all border cursor-pointer ${
                        requestDate === day.date 
                          ? 'border-luxury-gold-500 bg-luxury-gold-50/50 scale-105' 
                          : 'border-neutral-100 hover:border-neutral-300 bg-neutral-50/30'
                      }`}
                    >
                      <span className="text-[10px] text-neutral-400 font-medium">{day.dayName}</span>
                      <span className="text-sm font-semibold font-mono text-neutral-800">{day.dayNum}</span>
                      
                      {/* Visual indicator badges */}
                      <div className="flex gap-0.5 mt-1">
                        {dayShifts.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="確定シフトあり"></span>
                        )}
                        {dayReqs.some(r => r.type === '希望休') && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="希望休申請中"></span>
                        )}
                        {dayReqs.some(r => r.type === 'シフト申請') && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" title="追加可能日申請中"></span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-[10px] text-neutral-500 bg-white p-3.5 border border-neutral-100 rounded-lg">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 確定シフトあり
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> 希望休
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span> 勤務可能日
                </span>
                <span className="ml-auto font-mono text-neutral-400">2026年7月</span>
              </div>

              {/* Add Availability Request Form */}
              <div className="bg-white border border-neutral-200/60 rounded-xl p-5 shadow-2xs">
                <h5 className="text-xs font-semibold text-neutral-800 mb-4 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-luxury-gold-500" />
                  【{requestDate}】の勤務状況を登録・更新
                </h5>

                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 block mb-1.5">区分</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRequestType('希望休')}
                        className={`py-2 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                          requestType === '希望休'
                            ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
                            : 'bg-white border-neutral-200 text-neutral-600'
                        }`}
                      >
                        希望休 (お休み希望)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRequestType('シフト申請')}
                        className={`py-2 text-xs rounded-lg border font-medium transition-all cursor-pointer ${
                          requestType === 'シフト申請'
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                            : 'bg-white border-neutral-200 text-neutral-600'
                        }`}
                      >
                        シフト申請 (勤務可能日)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 block mb-1.5">理由・詳細コメント</label>
                    <textarea
                      value={requestDetails}
                      onChange={(e) => setRequestDetails(e.target.value)}
                      placeholder={requestType === '希望休' ? '（例）家族イベントのため終日希望します' : '（例）15:00以降の遅番シフト枠に入れます'}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-luxury-gold-400 h-20 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-luxury-gold-500 hover:bg-luxury-gold-600 text-white font-medium text-xs py-2.5 rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    シフト管理者へ申請する
                  </button>
                </form>
              </div>

              {/* Active Submissions Status List */}
              <div className="bg-white border border-neutral-200/60 rounded-xl p-5 shadow-2xs">
                <h5 className="text-xs font-semibold text-neutral-800 mb-3">提出済みのシフト希望履歴</h5>
                <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                  {myRequests.length === 0 ? (
                    <p className="text-[11px] text-neutral-400 text-center py-4">現在、提出済みの希望履歴はありません</p>
                  ) : (
                    myRequests.map((req) => (
                      <div key={req.id} className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/30 text-xs">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-neutral-700">{req.date}</span>
                            <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-bold ${
                              req.type === '希望休' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                            }`}>{req.type}</span>
                          </div>
                          <p className="text-[10px] text-neutral-400 mt-1 truncate max-w-[200px]">{req.details}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          req.status === '承認済' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          req.status === '却下' ? 'bg-red-50 text-red-700 border border-red-100' :
                          'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {currentTab === 'absence' && (
            <div className="space-y-6">
              
              {/* Feature 4: Emergency Consultation / Immediate Call-off */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-red-800">突発的な欠勤辞退・シフト交代の申請 console</h4>
                  <p className="text-[11px] text-red-700 leading-relaxed mt-1">
                    SNSや外部の連絡手段を使用せず、このアプリ内で欠勤報告が完結。自動で他拠点および部門全体にヘルプ支援の「お助けアラート」が送信され、代理候補スタッフへ瞬時に通知されます。
                  </p>
                </div>
              </div>

              {/* Form to submit sudden absence */}
              <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs">
                <h5 className="text-xs font-semibold text-neutral-800 mb-4">欠勤申請・交代希望フォーム</h5>
                
                <form onSubmit={handleUrgentAbsenceSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 block mb-1.5">辞退・交代を希望する確定シフト</label>
                    <select
                      value={selectedShiftId}
                      onChange={(e) => setSelectedShiftId(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-neutral-700 font-medium focus:ring-1 focus:ring-red-400 outline-hidden"
                    >
                      <option value="">-- シフトを選択してください --</option>
                      {myShifts.map(sh => (
                        <option key={sh.id} value={sh.id}>
                          {sh.date} - シフト {sh.timeSlotId}番枠
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 block mb-1.5">主な欠勤・辞退の理由</label>
                    <select
                      value={absenceReason}
                      onChange={(e) => setAbsenceReason(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-neutral-700 font-medium focus:ring-1 focus:ring-red-400 outline-hidden"
                    >
                      <option value="突発的な体調不良・発熱">突発的な体調不良・発熱</option>
                      <option value="家族・子供の緊急の体調不良">家族・子供の緊急の体調不良</option>
                      <option value="冠婚葬祭・緊急の法要">冠婚葬祭・緊急の法要</option>
                      <option value="交通機関の遅延・運休">交通機関の遅延・運休</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 block mb-1.5">状況の詳細（管理者と共有されます）</label>
                    <textarea
                      value={absenceDetails}
                      onChange={(e) => setAbsenceDetails(e.target.value)}
                      placeholder="例: 朝より38度の熱があり動くのが難しいため、恐縮ですがお休み、もしくはどなたか代役の調整をお願いしたいです。"
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-red-400 h-24 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                    緊急カバー要請をチームへブロードキャスト
                  </button>
                </form>
              </div>

              {/* Informative text about how it replaces emails/SNS */}
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-xs text-neutral-500 space-y-2">
                <p className="font-semibold text-neutral-700">💡 StaySync 連携の仕組み</p>
                <p className="leading-relaxed text-[11px]">
                  送信ボタンを押すと、管理者のシフト表には「一時的な欠員」を知らせる赤い枠が即座に表示されます。
                  また、アプリ内チャット（StaySyncチャンネル）に自動でヘルプ要請がポストされ、近隣に居住しているか、他拠点で余剰になっている代替可能スタッフに対してワンタップで応援を引き受けられるオファーが自動配信されます。
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Smartphone Footer Simulator */}
        <div className="bg-neutral-900 py-3.5 px-6 border-t border-neutral-800 flex items-center justify-around text-neutral-400 text-xs">
          <button onClick={() => setCurrentTab('calendar')} className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'calendar' ? 'text-luxury-gold-300' : 'hover:text-white'}`}>
            <CalendarIcon className="w-4.5 h-4.5" />
            <span className="text-[9px]">カレンダー</span>
          </button>
          
          <button onClick={() => setCurrentTab('absence')} className={`flex flex-col items-center gap-1 cursor-pointer ${currentTab === 'absence' ? 'text-red-400' : 'hover:text-white'}`}>
            <ShieldAlert className="w-4.5 h-4.5" />
            <span className="text-[9px]">緊急欠勤</span>
          </button>
        </div>

      </div>

    </div>
  );
}
