import { useState, useRef, useEffect } from 'react';
import bannerFuria from '../imagens/banner_furia.svg';
import logoFuria from '../imagens/logo_furia.svg';

export default function ChatBox({ messages, setMessages, isLoading, setIsLoading }) {
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const userMessage = { role: 'user', content: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userInput }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error?.details || 'Erro no servidor');
            }

            if (data.choices?.[0]?.message?.content) {
                setMessages(prev => [...prev, {
                    role: 'bot',
                    content: data.choices[0].message.content
                }]);
            } else {
                throw new Error("Resposta da API incompleta");
            }
        } catch (error) {
            console.error("Erro:", error);
            setMessages(prev => [...prev, {
                role: 'bot',
                content: `⚠️ Erro: ${error.message}`
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = () => {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatMessage = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    return (
        <section className="chat-section">
            <img src={bannerFuria} alt="Banner da Furia" className="background-img" />
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.role}`}>
                            <div className="avatar">
                                {msg.role === 'bot' ? (
                                    <img src={logoFuria} alt="Bot Avatar" />
                                ) : (
                                    <span className="user-avatar">👤</span>
                                )}
                            </div>
                            <div className="message-content">
                                <p dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                                <span className="timestamp">{formatTime()}</span>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="chat-message bot">
                            <div className="avatar">
                                <img src={logoFuria} alt="Bot Avatar" />
                            </div>
                            <div className="message-content">
                                <p>Digitando...</p>
                                <span className="timestamp">{formatTime()}</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chat-input-area">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Digite sua mensagem..."
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !userInput.trim()}
                    >
                        {isLoading ? '...' : 'Enviar'}
                    </button>
                </div>
            </div>
        </section>
    );
}