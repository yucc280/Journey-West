import React, { useState, useRef, useEffect } from 'react';

export default function AIChatAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '吾乃西游智囊。施主对《西游记》百回典故、八十一难或仙魔关系有何疑问？' }
  ]);
  const [loading, setLoading] = useState(false);

  const chatBodyRef = useRef(null);

  // 消息更新时自动平滑滚动到底部
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

try {
      // 请求自己的后端代理服务 (端口 3001)
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 只需把聊天上下文传给后端，不用暴露系统提示词和密钥
        body: JSON.stringify({
          messages: newMessages
        })
      });

      const data = await response.json();
      const reply = data.choices[0]?.message?.content || '（智囊沉思良久，未能参透机锋，请重试）';
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('API 请求出错:', err);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '（网络通讯受阻，请检查 API 配置与网络连接）' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-card">
      <div className="ai-chat-header">
        <h3 className="ai-chat-title">西游大模型 AI 智囊</h3>
      </div>

      <div className="ai-chat-body" ref={chatBodyRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`ai-msg-wrapper ${msg.role === 'user' ? 'user' : 'assistant'}`}>
            <span className="ai-msg-bubble">{msg.content}</span>
          </div>
        ))}
        {loading && (
          <div className="ai-msg-wrapper assistant">
            <span className="ai-msg-bubble ai-loading-bubble">
              <i>智囊推演典籍中...</i>
            </span>
          </div>
        )}
      </div>

      <div className="ai-chat-footer">
        <input
          type="text"
          className="ai-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="问问大模型：如“孙悟空借了几次芭蕉扇？”"
        />
        <button className="ai-send-btn" onClick={handleSend} disabled={loading}>
          {loading ? '推演中' : '发送'}
        </button>
      </div>
    </div>
  );
}