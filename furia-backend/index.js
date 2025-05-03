import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

// Configurações
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rota do chat
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message?.trim()) {
            return res.status(400).json({ error: 'Mensagem inválida' });
        }

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'deepseek/deepseek-chat:free',
            messages: [{
                role: 'system',
                content: `Você é o chatbot oficial da FURIA Esports. Responda sobre:
                - CS:GO (arT, KSCERATO, yuurih, drop, FalleN)
                - Valorant
                - League of Legends (CBLOL)`
            }, {
                role: 'user',
                content: message
            }],
            temperature: 0.7,
            max_tokens: 1024
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:5173',
                'X-Title': 'FURIA Chat'
            },
            timeout: 8000
        });

        res.json({
            choices: [{
                message: {
                    content: response.data.choices[0].message.content
                }
            }]
        });

    } catch (error) {
        console.error('Erro na API:', {
            status: error.response?.status,
            data: error.response?.data
        });

        res.status(500).json({
            error: 'Erro ao acessar a API',
            details: error.response?.data?.error?.message || error.message
        });
    }
});

// Inicia servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));