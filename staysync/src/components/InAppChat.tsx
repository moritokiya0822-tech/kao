/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  AlertCircle, 
  MessageSquare, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  ArrowLeftRight, 
  User, 
  CheckCircle2, 
  Megaphone 
} from 'lucide-react';
import { ChatMessage, Department } from '../types';

interface InAppChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, isUrgent?: boolean, department?: Department) => void;
  triggerKyotoDispatch: () => void;
}

export default function InAppChat({
  messages,
  onSendMessage,
  triggerKyotoDispatch
}: InAppChatProps) {
  const [inputText, setInputText] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | '全体'>('全体');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(
      inputText, 
      isUrgent, 
      selectedDept === '全体' ? undefined : selectedDept
    );
    
    setInputText('');
    setIsUrgent(false);
  };

  // Quick Action: Broadcast Cover Call
  const handleBroadcastCall = () => {
    onSendMessage(
      '【ブロードキャスト】本日12:00の客室清掃シフトについて、近隣に住む登録スタッフ全員へ代替応援依頼（時給30%アップ特約付）を自動配信しました。',
      true,
      '客室清掃'
    );

    // Simulate auto-reply from another staff after 1.5 seconds
    setTimeout(() => {
      onSendMessage(
        '【応援受託】客室清掃アソシエイトの木村 舞子（京都拠点より本日リモート待機中）が応援派遣の打診を受諾しました。シフトを確定ステータスに引き継ぎます。',
        false,
        '客室清掃'
      );
      // Execute the actual parent state transfer
      triggerKyotoDispatch();
    }, 1500);
  };

  return (
    <div className="bg-white border border-luxury-gold-100 rounded-2xl shadow-md overflow-hidden flex flex-col h-[650px]" id="in-app-chat-root">
      
      {/* Header */}
      <div className="bg-neutral-900 text-white p-5 flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-luxury-gold-500/15 rounded-xl border border-luxury-gold-400/20 text-luxury-gold-300">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-semibold text-white flex items-center gap-1.5">
              StaySync チームチャット
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-neutral-400">ホテルのシフト調整・緊急辞退・応援調整用内部チャンネル</p>
          </div>
        </div>

        {/* Channel Selector */}
        <div className="flex bg-neutral-800 p-1 rounded-lg text-xs border border-neutral-700 max-w-xs">
          {['全体', 'フロント', '客室清掃'].map(ch => (
            <button
              key={ch}
              onClick={() => setSelectedDept(ch as any)}
              className={`px-3 py-1 rounded-md text-[10px] font-medium transition-colors ${
                selectedDept === ch
                  ? 'bg-luxury-gold-500 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
              id={`btn-chat-filter-${ch}`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Crisis Macros Section */}
      <div className="bg-amber-500/5 px-5 py-3 border-b border-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-amber-800 font-medium flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          突発シフト欠員の緊急解消マクロ:
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleBroadcastCall}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-[10px] transition-all flex items-center gap-1 cursor-pointer"
          >
            <Megaphone className="w-3 h-3" />
            チーム応援ブロードキャスト (時給+30%)
          </button>
          <button
            onClick={() => {
              onSendMessage('【自動打診】京都嵐山リトリートヴィラへ空きセラピスト・清掃スタッフの1名応援派遣を打診しました。', false);
              setTimeout(() => {
                onSendMessage('【受託】京都リトリートヴィラより佐々木 凛の応援アサインが承認されました。', false);
                triggerKyotoDispatch();
              }, 1200);
            }}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-neutral-100 font-medium rounded-lg text-[10px] transition-all flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeftRight className="w-3 h-3 text-luxury-gold-400" />
            京都拠点に応援オファー自動送信
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-neutral-50/30">
        <AnimatePresence initial={false}>
          {messages
            .filter(msg => {
              if (selectedDept === '全体') return true;
              return msg.department === selectedDept || msg.isSystem;
            })
            .map((msg) => {
              if (msg.isSystem) {
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
                      msg.isUrgent
                        ? 'bg-red-50/80 border-red-200 text-red-800 shadow-2xs'
                        : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                    }`}
                  >
                    {msg.isUrgent ? (
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-luxury-gold-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-serif font-bold text-[10px] tracking-wider uppercase block mb-0.5">
                        {msg.senderName}
                      </span>
                      <p className="font-sans font-medium text-[11px]">{msg.content}</p>
                      <span className="text-[9px] text-neutral-400 block mt-1 font-mono">{msg.timestamp}</span>
                    </div>
                  </motion.div>
                );
              }

              const isMe = msg.senderId === 'system_operator'; // Simulated coordinator

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                >
                  {!isMe && (
                    <img 
                      src={msg.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                      alt={msg.senderName} 
                      className="w-8 h-8 rounded-full border border-neutral-200/60 object-cover" 
                    />
                  )}

                  <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-1.5 mb-1 justify-start">
                      {!isMe && (
                        <>
                          <span className="text-xs font-semibold text-neutral-800">{msg.senderName}</span>
                          <span className="text-[9px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-sm">{msg.senderRole}</span>
                        </>
                      )}
                    </div>

                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.isUrgent
                        ? 'bg-red-600 text-white rounded-tl-none font-medium shadow-sm'
                        : isMe
                          ? 'bg-luxury-gold-500 text-white rounded-tr-none'
                          : 'bg-white border border-neutral-200/80 text-neutral-700 rounded-tl-none shadow-2xs'
                    }`}>
                      <p className="font-sans font-medium whitespace-pre-line">{msg.content}</p>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-[9px] text-neutral-400 font-mono justify-start">
                      <Clock className="w-3 h-3 text-neutral-300" />
                      <span>{msg.timestamp}</span>
                      {msg.department && (
                        <span className="bg-neutral-100 text-neutral-500 px-1 py-0.2 rounded-sm text-[8px]">
                          #{msg.department}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input console */}
      <div className="p-4 border-t border-neutral-100 bg-white">
        <form onSubmit={handleSubmit} className="space-y-3">
          
          <div className="flex items-center justify-between flex-wrap gap-2 text-[11px] text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-100">
            <span className="font-medium text-neutral-600">アライアンス送信オプション:</span>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded-xs border-neutral-300 text-red-600 focus:ring-red-400 focus:ring-offset-0"
                />
                <span className="font-semibold text-red-600 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  緊急 (チーム全員に即時プッシュ送信)
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="メッセージを入力してください..."
              className="flex-1 text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-700 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-luxury-gold-400 focus:bg-white transition-all"
            />
            
            <button
              type="submit"
              className="bg-luxury-gold-500 hover:bg-luxury-gold-600 text-white px-5 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
              title="メッセージ送信"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
