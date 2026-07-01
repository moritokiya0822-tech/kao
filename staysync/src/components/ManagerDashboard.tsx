/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  X, 
  Building2, 
  ArrowLeftRight, 
  MapPin, 
  Sparkles, 
  Clock, 
  UserCheck, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';
import { Department, LocationId, TimeSlot, Employee, Shift, ShiftRequest } from '../types';
import { LOCATIONS, TIME_SLOTS } from '../data/mockData';

interface ManagerDashboardProps {
  shifts: Shift[];
  employees: Employee[];
  requests: ShiftRequest[];
  selectedLocation: LocationId;
  setSelectedLocation: (loc: LocationId) => void;
  onAddShift: (employeeId: string, timeSlotId: number, department: Department) => void;
  onRemoveShift: (shiftId: string) => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string) => void;
}

export default function ManagerDashboard({
  shifts,
  employees,
  requests,
  selectedLocation,
  setSelectedLocation,
  onAddShift,
  onRemoveShift,
  onApproveRequest,
  onRejectRequest
}: ManagerDashboardProps) {
  const [selectedDept, setSelectedDept] = useState<Department | 'すべて'>('すべて');
  const [showAssignModal, setShowAssignModal] = useState<{ timeSlotId: number; department: Department } | null>(null);

  // Filter employees of current location
  const locationEmployees = employees.filter(emp => emp.location === selectedLocation);
  
  // Cross-location helper info (surplus staff from the OTHER location)
  const otherLocationId = selectedLocation === 'tokyo_grand' ? 'kyoto_villa' : 'tokyo_grand';
  const otherLocationName = LOCATIONS.find(l => l.id === otherLocationId)?.jpName || '別拠点';
  const otherLocationEmployees = employees.filter(emp => emp.location === otherLocationId);

  // Departments list for filter buttons
  const departments: (Department | 'すべて')[] = ['すべて', 'フロント', '客室清掃', '料飲部門', 'スパ・レジャー'];

  // Helper: Count shifts for a given slot, department, and location
  const getAssignedStaffForSlot = (slotId: number, dept: Department) => {
    return shifts.filter(sh => {
      const emp = employees.find(e => e.id === sh.employeeId);
      return sh.timeSlotId === slotId && 
             sh.department === dept && 
             emp && 
             emp.location === selectedLocation;
    });
  };

  // Dispatch cross-location helper
  const handleDispatchHelper = (slotId: number, dept: Department) => {
    // Find an employee from the other location in the same department, or any department
    const helper = otherLocationEmployees.find(emp => emp.department === dept) || otherLocationEmployees[0];
    if (helper) {
      onAddShift(helper.id, slotId, dept);
      // Trigger a subtle success state by closing any modals
      setShowAssignModal(null);
    }
  };

  return (
    <div className="space-y-8" id="manager-dashboard-root">
      {/* Location Selector & Quick Stats */}
      <div className="bg-white border border-luxury-gold-100/60 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs text-luxury-gold-600 tracking-wider font-serif uppercase block mb-1">STAYSYNC REAL-TIME ENGINE</span>
          <h2 className="text-2xl font-serif text-neutral-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-luxury-gold-500" />
            拠点別人員ステータス
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            複数部門のシフト過不足状況および他拠点との人員横断配置をモニタリングしています。
          </p>
        </div>

        {/* High-end Segmented Control for Location Selector */}
        <div className="flex bg-neutral-50 p-1.5 rounded-full border border-neutral-200/60 max-w-md w-full md:w-auto self-center">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLocation(loc.id)}
              className={`flex-1 md:flex-none px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${
                selectedLocation === loc.id
                  ? 'bg-white text-luxury-gold-700 shadow-sm font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
              id={`btn-location-${loc.id}`}
            >
              <MapPin className={`w-3.5 h-3.5 ${selectedLocation === loc.id ? 'text-luxury-gold-500' : 'text-neutral-400'}`} />
              {loc.jpName}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-luxury-gold-100/60 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">本日稼働スタッフ数</span>
            <span className="p-2 bg-luxury-gold-50 rounded-lg text-luxury-gold-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-neutral-800">
              {locationEmployees.filter(emp => shifts.some(s => s.employeeId === emp.id)).length}
            </span>
            <span className="text-xs text-neutral-400">/ 登録 {locationEmployees.length}名</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span>稼働率: {Math.round((locationEmployees.filter(emp => shifts.some(s => s.employeeId === emp.id)).length / locationEmployees.length) * 100)}%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-luxury-gold-100/60 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">配置状況（全部門計）</span>
            <span className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-neutral-800">92%</span>
            <span className="text-xs text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-semibold">良好</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-luxury-gold-500" />
            <span>24時間中 22時間が充足枠内</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-luxury-gold-100/60 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">要応援アラート</span>
            <span className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-amber-600">
              {TIME_SLOTS.reduce((count, slot) => {
                const deptsToCheck = selectedDept === 'すべて' ? ['フロント', '客室清掃', '料飲部門', 'スパ・レジャー'] as Department[] : [selectedDept];
                const hasShortage = deptsToCheck.some(dept => {
                  const req = slot.requiredStaff[dept];
                  if (req === 0) return false;
                  const assignedCount = getAssignedStaffForSlot(slot.id, dept).length;
                  return assignedCount < req;
                });
                return hasShortage ? count + 1 : count;
              }, 0)}
            </span>
            <span className="text-xs text-neutral-400">時間帯で不足あり</span>
          </div>
          <div className="mt-2 text-xs text-amber-600 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>別拠点から応援要請が可能です</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-luxury-gold-100/60 p-5 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-medium">申請承認待ち</span>
            <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <ArrowLeftRight className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-neutral-800">
              {requests.filter(req => req.status === '承認待ち').length}
            </span>
            <span className="text-xs text-neutral-400">件の未決申請</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            希望休および勤務希望の承認要
          </div>
        </div>
      </div>

      {/* Main Grid: Staffing Timelines & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Time-Slot Staffing Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-serif text-neutral-800 flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-luxury-gold-500" />
                時間帯別・リアルタイム配置状況
              </h3>
              <p className="text-xs text-neutral-400">
                各時間枠における必要人員と、現在の実配置数の比較。追加や調整は即時反映されます。
              </p>
            </div>

            {/* Department Filtering Tabs */}
            <div className="flex gap-1.5 bg-neutral-100 p-1 rounded-lg overflow-x-auto max-w-full">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                    selectedDept === dept
                      ? 'bg-white text-neutral-800 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  id={`btn-dept-${dept}`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Time slot list */}
          <div className="space-y-4">
            {TIME_SLOTS.map((slot) => {
              // Calculate required and assigned based on chosen department filter
              let requiredSum = 0;
              let assignedSum = 0;
              
              const relevantDepts: Department[] = selectedDept === 'すべて' 
                ? ['フロント', '客室清掃', '料飲部門', 'スパ・レジャー'] 
                : [selectedDept];

              relevantDepts.forEach(dept => {
                requiredSum += slot.requiredStaff[dept];
                assignedSum += getAssignedStaffForSlot(slot.id, dept).length;
              });

              // If zero required staff for selected filter in this slot, skip or show grey
              const diff = assignedSum - requiredSum;
              let statusText = '充足';
              let statusClass = 'bg-emerald-50 border-emerald-100 text-emerald-700';
              let progressColor = 'bg-emerald-500';

              if (diff < 0) {
                statusText = `${Math.abs(diff)}名 不足`;
                statusClass = 'bg-amber-50 border-amber-200 text-amber-700';
                progressColor = 'bg-amber-500';
              } else if (diff > 0) {
                statusText = `${diff}名 余剰`;
                statusClass = 'bg-sky-50 border-sky-100 text-sky-700';
                progressColor = 'bg-sky-400';
              }

              if (requiredSum === 0 && assignedSum === 0) {
                statusText = '配置不要';
                statusClass = 'bg-neutral-50 border-neutral-200 text-neutral-400';
                progressColor = 'bg-neutral-200';
              }

              // Percentage for the gauge
              const percent = requiredSum > 0 ? Math.min((assignedSum / requiredSum) * 100, 100) : 100;

              return (
                <motion.div
                  key={slot.id}
                  layout
                  className="bg-white border border-neutral-100 rounded-xl p-5 shadow-xs hover:shadow-sm hover:border-luxury-gold-200/40 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-center bg-neutral-50 px-2.5 py-1 rounded-lg border border-neutral-200/40">
                        <span className="text-xs text-neutral-400 block font-serif">SLOT 0{slot.id}</span>
                        <span className="text-xs font-semibold text-neutral-700 font-mono whitespace-nowrap">{slot.label}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-neutral-800">{slot.name}</h4>
                        <span className="text-[11px] text-neutral-400">
                          {selectedDept === 'すべて' ? '全拠点総合人員' : `${selectedDept}部門`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClass}`}>
                        {statusText}
                      </span>
                      <span className="text-xs text-neutral-400 font-medium font-mono">
                        現在 {assignedSum} / 必要 {requiredSum}
                      </span>
                    </div>
                  </div>

                  {/* Elegant Dynamic Gauge Bar */}
                  {requiredSum > 0 && (
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mb-4">
                      <motion.div
                        className={`h-full ${progressColor}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  )}

                  {/* Assigned Staff Grid & Interactive Action Panel */}
                  <div className="bg-neutral-50/50 p-3 rounded-lg border border-neutral-100">
                    <span className="text-[10px] text-neutral-400 tracking-wider font-semibold block mb-2">配置中のスタッフ</span>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      {relevantDepts.map(dept => {
                        const deptAssigned = getAssignedStaffForSlot(slot.id, dept);
                        return deptAssigned.map(sh => {
                          const emp = employees.find(e => e.id === sh.employeeId);
                          if (!emp) return null;
                          return (
                            <div 
                              key={sh.id}
                              className="flex items-center gap-1.5 bg-white border border-neutral-200/60 px-2.5 py-1 rounded-lg shadow-2xs hover:border-red-200 hover:bg-red-50 group transition-all"
                            >
                              <img src={emp.avatar} alt={emp.name} className="w-4.5 h-4.5 rounded-full object-cover" />
                              <div className="text-[11px]">
                                <span className="font-medium text-neutral-700 group-hover:text-red-700">{emp.name}</span>
                                <span className="text-[9px] text-neutral-400 ml-1">({sh.department.substring(0, 2)})</span>
                              </div>
                              <button 
                                onClick={() => onRemoveShift(sh.id)}
                                className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                                title="シフトから外す"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        });
                      })}

                      {/* Manual Quick Add Trigger */}
                      {selectedDept !== 'すべて' && (
                        <button
                          onClick={() => setShowAssignModal({ timeSlotId: slot.id, department: selectedDept })}
                          className="flex items-center gap-1 border border-dashed border-luxury-gold-300 text-luxury-gold-600 hover:bg-luxury-gold-50/50 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          配置
                        </button>
                      )}

                      {/* Cross Location Help Offer Alert */}
                      {diff < 0 && (
                        <button
                          onClick={() => handleDispatchHelper(slot.id, selectedDept === 'すべて' ? 'フロント' : selectedDept)}
                          className="flex items-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 px-3 py-1 rounded-lg text-[10px] font-semibold border border-amber-500/20 transition-all cursor-pointer animate-pulse ml-auto"
                          title={`${otherLocationName} からの自動応援要請`}
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          {otherLocationName}から応援派遣
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pending Shift Approvals & Cross-Location Metrics */}
        <div className="space-y-6">
          
          {/* Quick Approvals Card */}
          <div className="bg-white border border-luxury-gold-100/60 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-serif text-neutral-800 flex items-center justify-between mb-4">
              <span className="flex items-center gap-2">
                <UserCheck className="w-4.5 h-4.5 text-luxury-gold-500" />
                承認待ち申請リスト
              </span>
              <span className="bg-luxury-gold-100 text-luxury-gold-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                {requests.filter(r => r.status === '承認待ち').length}件
              </span>
            </h3>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {requests.filter(r => r.status === '承認待ち').length === 0 ? (
                <div className="text-center py-8 text-neutral-400 bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                  <p className="text-xs">現在、承認待ちの申請はありません</p>
                </div>
              ) : (
                requests.filter(r => r.status === '承認待ち').map((req) => {
                  const emp = employees.find(e => e.id === req.employeeId);
                  return (
                    <div 
                      key={req.id}
                      className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/50 hover:border-luxury-gold-200/40 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <img src={emp?.avatar} alt={req.employeeName} className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-neutral-700">{req.employeeName}</p>
                            <p className="text-[9px] text-neutral-400">{req.department}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                          req.type === '急な欠勤' ? 'bg-red-50 text-red-600 border border-red-100' :
                          req.type === '希望休' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-indigo-50 text-indigo-600 border border-indigo-100'
                        }`}>
                          {req.type}
                        </span>
                      </div>

                      <div className="text-neutral-600 mb-3 bg-white p-2 rounded border border-neutral-200/30">
                        <p className="text-[10px] text-neutral-400 font-serif mb-1">対象日: {req.date}</p>
                        <p className="text-[11px] leading-relaxed font-sans">{req.details}</p>
                      </div>

                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => onRejectRequest(req.id)}
                          className="px-2.5 py-1 border border-neutral-200 text-neutral-500 hover:bg-neutral-100 rounded text-[10px] font-medium transition-colors cursor-pointer"
                        >
                          却下
                        </button>
                        <button
                          onClick={() => onApproveRequest(req.id)}
                          className="px-3 py-1 bg-luxury-gold-500 hover:bg-luxury-gold-600 text-white rounded text-[10px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          承認する
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Cross-Location Synergy Card */}
          <div className="bg-white border border-luxury-gold-100/60 rounded-xl p-5 shadow-sm">
            <span className="text-[10px] text-luxury-gold-600 font-serif tracking-wider uppercase block mb-1">CROSS-LOCATION OPTIMIZATION</span>
            <h3 className="text-base font-serif text-neutral-800 mb-3 flex items-center gap-1.5">
              <ArrowLeftRight className="w-4 h-4 text-luxury-gold-500" />
              他拠点クロス配置ステータス
            </h3>
            
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              StaySyncは全拠点の空きスタッフ情報を統合管理。京都と東京間での応援派遣やリモート管理者アシストを容易にします。
            </p>

            <div className="space-y-3">
              {/* Loc Item 1 */}
              <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/40">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-700">東京グランドホテル</h4>
                  <p className="text-[10px] text-neutral-400">現在稼働: フロント/清掃ピーク</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-neutral-700 font-mono">11名稼働中</span>
                  <p className="text-[9px] text-emerald-600">充足率 94%</p>
                </div>
              </div>

              {/* Loc Item 2 */}
              <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200/40">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-700">京都リトリートヴィラ</h4>
                  <p className="text-[10px] text-neutral-400">現在稼働: スパ/料飲ピーク</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-neutral-700 font-mono">5名稼働中</span>
                  <p className="text-[9px] text-amber-600">現在余剰スタッフあり</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
              <span>自動同期ステータス</span>
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                オンライン (LIVE)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Quick Assign Modal/Overlay */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-luxury-gold-200 rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-serif text-neutral-800">スタッフをシフト配置</h3>
                <button 
                  onClick={() => setShowAssignModal(null)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-xs text-neutral-500">
                  {TIME_SLOTS.find(t => t.id === showAssignModal.timeSlotId)?.label}（{showAssignModal.department}部門）に配置可能なスタッフを選択してください。
                </p>
              </div>

              {/* Available Staff List */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto mb-6 pr-1">
                {locationEmployees
                  .filter(emp => emp.department === showAssignModal.department)
                  .map(emp => {
                    const isAlreadyAssigned = shifts.some(s => s.employeeId === emp.id && s.timeSlotId === showAssignModal.timeSlotId);
                    return (
                      <div 
                        key={emp.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isAlreadyAssigned 
                            ? 'bg-neutral-50 border-neutral-200 opacity-60' 
                            : 'bg-white border-neutral-200/80 hover:border-luxury-gold-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-semibold text-neutral-700">{emp.name}</p>
                            <p className="text-[10px] text-neutral-400">{emp.role} • ★{emp.rating}</p>
                          </div>
                        </div>

                        {isAlreadyAssigned ? (
                          <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-1 rounded">
                            配置済
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              onAddShift(emp.id, showAssignModal.timeSlotId, showAssignModal.department);
                              setShowAssignModal(null);
                            }}
                            className="bg-luxury-gold-500 hover:bg-luxury-gold-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          >
                            配置する
                          </button>
                        )}
                      </div>
                    );
                  })}

                {/* Offer Cross Location Helper */}
                <div className="border-t border-neutral-100 pt-3 mt-2">
                  <p className="text-[11px] font-serif font-semibold text-luxury-gold-700 mb-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    他拠点({otherLocationName})からの応援候補
                  </p>
                  
                  {otherLocationEmployees
                    .filter(emp => emp.department === showAssignModal.department)
                    .map(emp => (
                      <div 
                        key={emp.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-luxury-gold-50/50 border border-luxury-gold-100 text-xs mb-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-neutral-700">{emp.name}</p>
                            <p className="text-[9px] text-neutral-400">現在京都にて余剰待機中</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onAddShift(emp.id, showAssignModal.timeSlotId, showAssignModal.department);
                            setShowAssignModal(null);
                          }}
                          className="bg-neutral-800 hover:bg-neutral-900 text-white px-2.5 py-1 rounded text-[10px] font-medium transition-colors cursor-pointer"
                        >
                          派遣を要請
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAssignModal(null)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 rounded-lg text-xs font-medium cursor-pointer"
                >
                  キャンセル
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
