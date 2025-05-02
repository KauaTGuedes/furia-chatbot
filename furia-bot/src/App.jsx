import './App.css';
import { useState } from 'react';
import ChatBox from './API/ChatBox';

import logoFuria from './imagens/logo_furia.svg';
import iconLoja from './imagens/icon_loja.svg';
import iconTwitter from './imagens/icon_twitter.svg';
import iconInstagram from './imagens/icon_instagram.svg';
import iconLinkedin from './imagens/icon_linkedin.svg';
import iconGithub from './imagens/icon_github.svg';

function App() {
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            content: 'Bem-vindo ao FURIA Chat, o lugar certo para descobrir sobre o melhor time de CS com a gente!',
        },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="App">
            <header className="header">
                <div className="logo-container">
                    <img src={logoFuria} alt="Logo da Fúria" className="logo-img" />
                    <span className="furia-text">FuriaChat</span>
                </div>
                <nav>
                    <ul className="social-icons">
                        <li><a href="https://www.furia.gg/" target="_blank"><img src={iconLoja} alt="Loja" /></a></li>
                        <li><a href="https://x.com/FURIA" target="_blank"><img src={iconTwitter} alt="Twitter" /></a></li>
                        <li><a href="https://www.instagram.com/furiagg" target="_blank"><img src={iconInstagram} alt="Instagram" /></a></li>
                    </ul>
                </nav>
            </header>

            <ChatBox messages={messages} setMessages={setMessages} isLoading={isLoading} setIsLoading={setIsLoading} />

            <footer className="footer">
                <p>© 2025 - Kauā Teixeira Guedes</p>
                <ul className="social-icons">
                    <li><a href="https://github.com/KauaTGuedes" target="_blank"><img src={iconGithub} alt="Github" /></a></li>
                    <li><a href="https://www.linkedin.com/in/kaua-teixeira-guedes" target="_blank"><img src={iconLinkedin} alt="Linkedin" /></a></li>
                </ul>
            </footer>
        </div>
    );
}

export default App;
