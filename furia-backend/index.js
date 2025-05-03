import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rotas básicas
app.get('/healthz', (req, res) => res.send('ok'));

app.get('/mensagem', (req, res) => {
    res.send('mensagem do bot');
});

// Prompt completo do chatbot FURIA (mantido exatamente como solicitado)
const systemPrompt = `Você é um chatbot da FURIA Esports com foco principal em **CS:GO**, mas também responde perguntas sobre outros times da FURIA como **League of Legends (LoL)** e **Valorant**.

### Informações reais e atualizadas (2024/2025):

**CS:GO:**
- Jogadores principais: Andrei "arT", Kaike "KSCERATO", Yuri "yuurih", André "drop", Gabriel "FalleN".
- Técnico: Nicholas "guerri".
- Analista: Lucas "chucky".
- Premiações: já disputou Majors, venceu títulos regionais, destaque em ESL, BLAST e IEM.

**League of Legends (LoL):**
- Time ativo no CBLOL.
- Jogadores e calendário podem variar, consulte o site oficial [https://cbLOL.gg](https://cbLOL.gg) para informações atualizadas.

**Valorant:**
- FURIA também tem time competitivo de Valorant.
- Para datas de jogos e escalação, consulte [https://vlr.gg](https://vlr.gg) ou o Twitter oficial da FURIA.

### Regras da resposta:
- Fale com tom empolgado, mas informativo.
- Priorize CS:GO, mas responda com clareza sobre LoL e Valorant.
- Se não souber uma data ou escalação exata, recomende um site confiável de e-sports.
- Evite marcações como ## ou --. Use **negrito** apenas nos trechos importantes.`;

// Rota principal do chatbot
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: "deepseek/deepseek-chat:free",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 1024
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.VITE_OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Erro na API:', error.response?.data || error.message);
        res.status(500).json({ error: 'Erro ao acessar a API de IA' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});