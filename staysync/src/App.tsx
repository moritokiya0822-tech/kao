/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Hotel, 
  ShieldAlert, 
  Sparkles, 
  Bell, 
  User, 
  Clock, 
  MessageSquare,
  HelpCircle,
  X,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  LogOut
} from 'lucide-react';

import { 
  Department, 
  LocationId, 
  Employee, 
  Shift, 
  ShiftRequest, 
  ChatMessage 
} from './types';

import { 
  INITIAL_EMPLOYEES, 
  INITIAL_SHIFTS, 
  INITIAL_REQUESTS, 
  INITIAL_CHAT_MESSAGES, 
  LOCATIONS 
} from './data/mockData';

import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import InAppChat from './components/InAppChat';

export default function App() {
  // Mode State: 'manager' | 'employee'
  const [appMode, setAppMode] = useState<'manager' | 'employee'>('manager');
  
  // Shared Live States
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [shifts, setShifts] = useState<Shift[]>(INITIAL_SHIFTS);
  const [requests, setRequests] = useState<ShiftRequest[]>(INITIAL_REQUESTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [selectedLocation, setSelectedLocation] = useState<LocationId>('tokyo_grand');

  // Push Notification state
  const [notifications, setNotifications] = useState<{
    id: string;
    title: string;
    body: string;
    type: 'info' | 'success' | 'warning';
  }[]>([]);

  // Trigger floating mock push notifications
  const triggerPushNotification = (title: string, body: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, title, body, type }, ...prev]);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // State Change Handlers
  
  // 1. Manager adds a shift
  const handleAddShift = (employeeId: string, timeSlotId: number, department: Department) => {
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) return;

    const newShift: Shift = {
      id: `sh_${Math.random().toString(36).substr(2, 9)}`,
      employeeId,
      employeeName: emp.name,
      department,
      date: '2026-07-01', // Target tomorrow for active testing
      timeSlotId
    };

    setShifts(prev => [...prev, newShift]);
    
    // Auto system log in chat
    const systemMsg: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      senderId: 'system',
      senderName: 'StaySync AI',
      senderRole: 'システムアシスタント',
      content: `【シフト更新】${emp.name} さんが 7/1 のシフト枠に配置されました。`,
      timestamp: 'たった今',
      isSystem: true
    };
    setChatMessages(prev => [...prev, systemMsg]);

    triggerPushNotification(
      'シフト割り当てを更新しました',
      `${emp.name}さんを該当シフト枠に追加配置しました。`,
      'success'
    );
  };

  // 2. Manager removes a shift
  const handleRemoveShift = (shiftId: string) => {
    const target = shifts.find(s => s.id === shiftId);
    if (!target) return;

    setShifts(prev => prev.filter(s => s.id !== shiftId));

    // Auto system log in chat
    const systemMsg: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      senderId: 'system',
      senderName: 'StaySync AI',
      senderRole: 'システムアシスタント',
      content: `【シフト変更】${target.employeeName} さんのシフト配置がキャンセルされました。`,
      timestamp: 'たった今',
      isSystem: true
    };
    setChatMessages(prev => [...prev, systemMsg]);

    triggerPushNotification(
      'シフト割り当てを削除しました',
      `${target.employeeName}さんの配置を取り消しました。`,
      'info'
    );
  };

  // 3. Manager approves a pending request
  const handleApproveRequest = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    // Update request status
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: '承認済' } : r));

    // If it's an urgent absence request, remove their shifts for that date automatically
    if (req.type === '急な欠勤') {
      setShifts(prev => prev.filter(s => !(s.employeeId === req.employeeId && s.date === req.date)));
    }

    // Append success message to chat
    const approvalMsg: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      senderId: 'system',
      senderName: 'StaySync AI',
      senderRole: 'システムアシスタント',
      content: `【申請承認】${req.employeeName} さんの ${req.date} に関する「${req.type}」申請が管理者に承認されました。`,
      timestamp: 'たった今',
      isSystem: true
    };
    setChatMessages(prev => [...prev, approvalMsg]);

    triggerPushNotification(
      '申請を承認しました',
      `${req.employeeName}さんの「${req.type}」申請を承認済に更新しました。`,
      'success'
    );
  };

  // 4. Manager rejects a pending request
  const handleRejectRequest = (requestId: string) => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return;

    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: '却下' } : r));

    triggerPushNotification(
      '申請を却下しました',
      `${req.employeeName}さんの「${req.type}」申請を却下しました。`,
      'info'
    );
  };

  // 5. Employee submits a new time-off or availability request
  const handleEmployeeSubmitRequest = (newReq: Omit<ShiftRequest, 'id' | 'timestamp' | 'status'>) => {
    const req: ShiftRequest = {
      ...newReq,
      id: `req_${Math.random().toString(36).substr(2, 9)}`,
      status: '承認待ち',
      timestamp: 'たった今'
    };

    setRequests(prev => [req, ...prev]);

    // Send status log to chat
    const chatMsg: ChatMessage = {
      id: `msg_sys_${Date.now()}`,
      senderId: 'system',
      senderName: 'StaySync AI',
      senderRole: 'システムアシスタント',
      content: `【新規申請】${req.employeeName} さんより ${req.date} の「${req.type}」の申請が提出されました。`,
      timestamp: 'たった今',
      isSystem: true
    };
    setChatMessages(prev => [...prev, chatMsg]);
  };

  // 6. Employee submits an urgent absence report (Feature 4)
  const handleEmployeeUrgentAbsence = (employeeId: string, shiftId: string, reason: string, details: string) => {
    const emp = employees.find(e => e.id === employeeId);
    const targetShift = shifts.find(s => s.id === shiftId);
    if (!emp || !targetShift) return;

    // Create a "急な欠勤" request in the manager's list
    const newRequest: ShiftRequest = {
      id: `req_urg_${Math.random().toString(36).substr(2, 9)}`,
      employeeId,
      employeeName: emp.name,
      department: emp.department,
      type: '急な欠勤',
      date: targetShift.date,
      details: `【緊急欠勤理由: ${reason}】\n${details}`,
      status: '承認待ち',
      timestamp: 'たった今'
    };

    setRequests(prev => [newRequest, ...prev]);

    // Update shift state immediately to signal warning (we don't delete until approved, but we show warning)
    // Post to team chat
    const chatMsg: ChatMessage = {
      id: `msg_chat_urg_${Date.now()}`,
      senderId: employeeId,
      senderName: emp.name,
      senderRole: `${emp.department}スタッフ`,
      avatar: emp.avatar,
      content: `🚨【緊急欠勤・交代要請】本日アサインされていたシフトについて、辞退せざるを得なくなりました。理由: ${reason}。急ぎ代理の方を募集させてください。詳細: ${details}`,
      timestamp: 'たった今',
      isUrgent: true,
      department: emp.department
    };

    const alertMsg: ChatMessage = {
      id: `msg_sys_alert_${Date.now()}`,
      senderId: 'system',
      senderName: 'StaySync 統合アラート',
      senderRole: 'システムアシスタント',
      content: `【自動警報】${emp.name}さんの急な欠勤申請に伴い、${targetShift.date} の客室サービス人員に空きが発生しました。ただいま代理スタッフの自動マッチングプロセスを起動しています。`,
      timestamp: 'たった今',
      isSystem: true,
      isUrgent: true
    };

    setChatMessages(prev => [...prev, chatMsg, alertMsg]);
  };

  // 7. Sends a message inside the in-app chat
  const handleSendMessage = (content: string, isUrgent?: boolean, department?: Department) => {
    const newMsg: ChatMessage = {
      id: `msg_${Math.random().toString(36).substr(2, 9)}`,
      senderId: 'system_operator',
      senderName: 'あなた (管理者コーディネーター)',
      senderRole: '管理者',
      content,
      timestamp: 'たった今',
      isUrgent,
      department
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Simulated auto-agent reaction if urgent
    if (isUrgent) {
      setTimeout(() => {
        const autoMsg: ChatMessage = {
          id: `msg_sys_react_${Date.now()}`,
          senderId: 'system',
          senderName: 'StaySync AI',
          senderRole: 'AIアシスタント',
          content: '【AIアシスタント返答】お困りですね。近隣待機中の他部門・他拠点スタッフへ応援打診オファーを自動展開しました。承諾が得られ次第、本ダッシュボードに反映されます。',
          timestamp: '1秒前',
          isSystem: true
        };
        setChatMessages(prev => [...prev, autoMsg]);
      }, 1000);
    }
  };

  // Kyoto helper automatic dispatch callback
  const handleTriggerKyotoDispatch = () => {
    // Dispatch woodcutter or housekeeper (e.g. 松本 楓) to tomorrow's shift
    const kyotoHelper = employees.find(emp => emp.id === 'emp_13'); // 松本 楓 (Kyoto Housekeeper)
    if (kyotoHelper) {
      const newShift: Shift = {
        id: `sh_dispatch_${Date.now()}`,
        employeeId: kyotoHelper.id,
        employeeName: kyotoHelper.name,
        department: '客室清掃',
        date: '2026-07-01',
        timeSlotId: 5 // 12:00 - 15:00
      };
      setShifts(prev => [...prev, newShift]);
      
      triggerPushNotification(
        '他拠点より応援をアサインしました',
        `京都嵐山ヴィラより「${kyotoHelper.name}」さんを応援アソシエイトとして東京へ仮配置しました。`,
        'success'
      );
    }
  };

  return (
    <div className="min-h-screen bg-hotel-bg font-sans text-neutral-800 antialiased flex flex-col">
      
      {/* Dynamic Floating Push Notification Banner Overlay */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`p-4 rounded-xl border shadow-lg pointer-events-auto bg-white flex items-start gap-3 ${
                notif.type === 'success' ? 'border-emerald-200 bg-emerald-50/90' :
                notif.type === 'warning' ? 'border-amber-200 bg-amber-50/90' :
                'border-luxury-gold-200 bg-luxury-gold-50/90'
              }`}
            >
              {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
              {notif.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
              {notif.type === 'info' && <Sparkles className="w-5 h-5 text-luxury-gold-500 shrink-0 mt-0.5" />}
              
              <div className="flex-1">
                <h4 className={`text-xs font-bold ${
                  notif.type === 'success' ? 'text-emerald-800' :
                  notif.type === 'warning' ? 'text-amber-800' :
                  'text-luxury-gold-900'
                }`}>{notif.title}</h4>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">{notif.body}</p>
              </div>

              <button 
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="text-neutral-400 hover:text-neutral-600 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Luxury Grand Hotel Header Branding */}
      <header className="bg-white border-b border-luxury-gold-100/60 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          {/* Logo Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-hotel-dark rounded-xl flex items-center justify-center text-luxury-gold-300 shadow-sm border border-luxury-gold-400/20">
              <Hotel className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold text-hotel-dark tracking-widest flex items-center gap-1.5">
                STAYSYNC
                <span className="text-[10px] bg-luxury-gold-100 text-luxury-gold-700 px-2 py-0.5 rounded font-sans tracking-normal font-bold">PRO</span>
              </h1>
              <p className="text-[10px] text-neutral-400 font-serif tracking-wider uppercase mt-0.5">
                Luxury Hospitality Shift Coordinator
              </p>
            </div>
          </div>

          {/* Mode Switcher Segmented Control */}
          <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200/40 self-start sm:self-center">
            <button
              onClick={() => {
                setAppMode('manager');
                triggerPushNotification('管理者ビューに切り替えました', 'リアルタイムの人員過不足分析、他拠点との人員横断配置を管理できます。', 'info');
              }}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                appMode === 'manager'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              id="btn-mode-manager"
            >
              <User className="w-3.5 h-3.5 text-luxury-gold-300" />
              管理者ダッシュボード
            </button>
            <button
              onClick={() => {
                setAppMode('employee');
                triggerPushNotification('従業員専用ポータルに切り替えました', 'スマートフォン用画面を模したシミュレーター。希望休・勤務可能日の簡易カレンダー提出や緊急欠勤連絡が体験できます。', 'info');
              }}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                appMode === 'employee'
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              id="btn-mode-employee"
            >
              <Clock className="w-3.5 h-3.5 text-luxury-gold-300" />
              従業員ポータル (Mobile)
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Stage */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-10">
        
        {/* Dynamic visual introduction banner */}
        <div className="bg-white border border-luxury-gold-100/60 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 left-0 w-2 h-full bg-luxury-gold-500"></div>
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-luxury-gold-50 text-luxury-gold-700 text-[10px] font-bold tracking-wider font-serif uppercase rounded border border-luxury-gold-100">
                PORTFOLIO EDITION
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                Live Sync 統合環境
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-800">
              {appMode === 'manager' 
                ? '高級ホテル向け マルチ部門・複数拠点リアルタイムシフト配置' 
                : 'スマートフォン対応 従業員用カレンダー＆緊急欠勤相談システム'
              }
            </h2>
            
            <p className="text-xs text-neutral-500 leading-relaxed">
              {appMode === 'manager'
                ? '東京と京都のラグジュアリーホテルでの、フロント・清掃・料飲・スパなどの各部門にわたるシフトアサイン。現在の人数が時間帯別に過剰か、ピッタリ充足か、それとも不足しているかをリアルタイムに自動算出してビジュアル表示します。'
                : '従業員自身がスマートフォン画面（カレンダーや突発の欠勤・辞退フォーム）から登録します。送信された希望休や突発的な交代希望は、即時的に管理者のダッシュボードとチャットルームに警告として自動反映されます。'
              }
            </p>
          </div>

          <div className="shrink-0 flex flex-col gap-2.5 bg-neutral-50 p-4 rounded-xl border border-neutral-200/50 min-w-[220px]">
            <span className="text-[10px] text-neutral-400 tracking-wider font-semibold uppercase font-serif">Quick Demo Guides</span>
            <ul className="text-[10px] text-neutral-600 space-y-1.5 list-disc pl-3.5 leading-normal">
              <li><strong className="text-neutral-800">管理者モード</strong>で不足している時間帯の「京都から応援派遣」を試す</li>
              <li><strong className="text-neutral-800">従業員モード</strong>で「希望休」を申請し、ポップアップ通知を見る</li>
              <li>「突発欠勤フォーム」を送信し、<strong className="text-neutral-800">チャットチャンネル</strong>の自動警報を確認する</li>
            </ul>
          </div>
        </div>

        {/* Dashboard Grid */}
        <AnimatePresence mode="wait">
          {appMode === 'manager' ? (
            <motion.div
              key="manager-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              <ManagerDashboard 
                shifts={shifts}
                employees={employees}
                requests={requests}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                onAddShift={handleAddShift}
                onRemoveShift={handleRemoveShift}
                onApproveRequest={handleApproveRequest}
                onRejectRequest={handleRejectRequest}
              />

              {/* Shared Chat Console integration below Manager Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-neutral-200/50">
                <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
                  <div>
                    <span className="text-[10px] text-luxury-gold-600 font-serif tracking-wider uppercase block mb-1">DEPARTMENTAL COLLABORATION</span>
                    <h3 className="text-lg font-serif text-neutral-800 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-luxury-gold-500" />
                      部門間連絡・アラートチャット
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed mt-2">
                      シフト変更や急な欠勤発生は、SNSや外部ツールを一切通さず、このアプリ内のリアルタイム連絡網で直接完結。
                    </p>
                    <p className="text-xs text-neutral-400 leading-relaxed mt-2">
                      管理者とスタッフが同じチャット上で議論し、不足発生時にはAIアラートが人員補充マクロのクリック起動を促します。
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <InAppChat 
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    triggerKyotoDispatch={handleTriggerKyotoDispatch}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="employee-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              <EmployeeDashboard 
                employees={employees}
                shifts={shifts}
                requests={requests}
                onSubmitRequest={handleEmployeeSubmitRequest}
                onSubmitUrgentAbsence={handleEmployeeUrgentAbsence}
                triggerPushNotification={triggerPushNotification}
              />

              {/* Shared Chat Console below Employee Dashboard too, for mobile discussion test */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-neutral-200/50">
                <div className="lg:col-span-4 flex flex-col justify-center space-y-4">
                  <div>
                    <span className="text-[10px] text-luxury-gold-600 font-serif tracking-wider uppercase block mb-1">STAFF DISCUSSION ROOM</span>
                    <h3 className="text-lg font-serif text-neutral-800 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-luxury-gold-500" />
                      チーム相談用チャットボード
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed mt-2">
                      従業員用スマートフォンアプリにもチャットをシームレスに統合。緊急時、他のスタッフへワンタッチでの代理引き受け交渉を可能にします。
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <InAppChat 
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    triggerKyotoDispatch={handleTriggerKyotoDispatch}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Luxury Brand Footer */}
      <footer className="bg-hotel-dark text-neutral-400 py-10 px-6 border-t border-luxury-gold-500/10 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center text-luxury-gold-300 border border-neutral-700">
              <Hotel className="w-4 h-4" />
            </div>
            <div>
              <p className="text-neutral-200 font-serif font-bold tracking-widest text-[11px]">STAYSYNC HOTEL SHIFT ENGINE</p>
              <p className="text-[9px] text-neutral-500 mt-0.5">© 2026 StaySync System. All Rights Reserved. Fully Fictional Concept.</p>
            </div>
          </div>

          <div className="flex gap-6 font-serif text-[10px] uppercase tracking-widest text-neutral-500">
            <span className="hover:text-luxury-gold-300 cursor-help" title="Fictional Terms">Terms of Harmony</span>
            <span className="hover:text-luxury-gold-300 cursor-help" title="Fictional Policy">Hotelier Ethics</span>
            <span className="hover:text-luxury-gold-300 cursor-help" title="Fictional Support">Grand Helpdesk</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
