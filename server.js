import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.ZHIPU_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: '服务端未配置智谱 API Key' });
    }

    // 调用智谱 AI 开放平台的 OpenAI 兼容接口
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'glm-4-flash', 
        messages: [
          {
            role: 'system',
            content: '你是一个精通《西游记》原著的古典文学专家与导览员。请用半文半白、风趣优雅且符合《西游记》韵味的口吻回答用户关于《西游记》的问题。'
          },
          ...messages
        ]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('智谱 API 返回错误:', data.error);
      return res.status(400).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('代理请求失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`智谱 AI 代理服务已启动，监听端口: http://localhost:${PORT}`);
});