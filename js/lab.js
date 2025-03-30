// JavaScript para a página do laboratório com as melhorias solicitadas

document.addEventListener('DOMContentLoaded', function() {
    // Rolar a página para o topo ao carregar
    window.scrollTo(0, 0);
    
    // Configurar terminal
    setupTerminal();
    
    // Configurar vídeo se a tag de vídeo estiver presente
    setupVideo();
    
    // Configurar timer se o desafio_timer for true
    setupTimer();
    
    // Configurar navegação de passos
    setupNavigation();
    
    // Configurar botões de conclusão de tarefas
    setupTaskCompletion();
    
    // Configurar botões de cópia de código
    setupCodeCopy();
    
    // Configurar navegação na lista de tarefas da barra lateral
    setupTaskNavigation();
    
    // Configurar botão de reset do laboratório
    setupLabReset();
    
    // Adicionar documentação específica do laboratório
    setupDocumentation();
});

// Função para configurar o vídeo do tutorial se a tag video estiver presente
function setupVideo() {
    // Verificar se este laboratório tem tag de vídeo
    const videoTag = document.querySelector('.lab-tag.video');
    if (!videoTag) return;
    
    // Seção para recursos de vídeo
    const labTitle = document.getElementById('labTitle').textContent;
    const labCategory = document.getElementById('labCategory').textContent;
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-tutorial-section';
    
    // Criar o HTML do vídeo
    videoContainer.innerHTML = `
        <h3><i class="fas fa-video"></i> Tutorial em Vídeo</h3>
        <div class="video-container">
            <iframe width="100%" height="315" 
                src="https://www.youtube.com/embed/videoseries?list=PLKZ1xRF1MhWKIK_BGHdHbu5oD7qrXWYWV" 
                title="Tutorial de ${labTitle}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
        <p class="video-description">Este tutorial demonstra as técnicas abordadas neste laboratório de ${labCategory}.</p>
    `;
    
    // Inserir após a descrição do laboratório
    const labDescription = document.querySelector('.lab-description');
    labDescription.parentNode.insertBefore(videoContainer, labDescription.nextSibling);
}

// Função para configurar o timer de desafio se o lab tiver a tag timer
function setupTimer() {
    // Verificar se este laboratório tem tag de desafio timer
    const timerTag = document.querySelector('.lab-tag.desafio');
    if (!timerTag) return;
    
    // Criar elemento de timer
    const timerContainer = document.createElement('div');
    timerContainer.className = 'timer-container';
    timerContainer.innerHTML = `
        <div class="timer-display">
            <span id="minutes">30</span>:<span id="seconds">00</span>
        </div>
        <div class="timer-controls">
            <button id="startTimer" class="timer-btn start"><i class="fas fa-play"></i> Iniciar Timer</button>
            <button id="pauseTimer" class="timer-btn pause" disabled><i class="fas fa-pause"></i> Pausar</button>
            <button id="resetTimer" class="timer-btn reset" disabled><i class="fas fa-redo-alt"></i> Reiniciar</button>
        </div>
    `;
    
    // Inserir após a primeira div no conteúdo do laboratório
    const labContent = document.querySelector('.lab-content');
    labContent.insertBefore(timerContainer, labContent.firstChild.nextSibling);
    
    // Configurar a funcionalidade do timer
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startBtn = document.getElementById('startTimer');
    const pauseBtn = document.getElementById('pauseTimer');
    const resetBtn = document.getElementById('resetTimer');
    
    let totalSeconds = 30 * 60; // 30 minutos em segundos
    let timerInterval;
    let timerRunning = false;
    
    // Função para atualizar a exibição do timer
    function updateTimerDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        
        // Se o timer chegar a zero, finalizar o desafio
        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            timerRunning = false;
            
            // Adicionar classe para indicar que o tempo acabou
            timerContainer.classList.add('time-up');
            
            // Mostrar alerta e redirecionar para a página de laboratórios
            setTimeout(() => {
                alert('Tempo esgotado! O desafio foi finalizado.');
                window.location.href = '/';
            }, 1000);
        }
    }
    
    // Iniciar o timer
    startBtn.addEventListener('click', () => {
        if (!timerRunning) {
            timerInterval = setInterval(() => {
                totalSeconds--;
                updateTimerDisplay();
            }, 1000);
            
            timerRunning = true;
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            resetBtn.disabled = false;
            
            // Adicionar classe para indicar que o timer está rodando
            timerContainer.classList.add('timer-running');
        }
    });
    
    // Pausar o timer
    pauseBtn.addEventListener('click', () => {
        if (timerRunning) {
            clearInterval(timerInterval);
            timerRunning = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            
            // Remover a classe de timer rodando
            timerContainer.classList.remove('timer-running');
        }
    });
    
    // Reiniciar o timer
    resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerRunning = false;
        totalSeconds = 30 * 60;
        updateTimerDisplay();
        
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        
        // Remover as classes de estilo
        timerContainer.classList.remove('timer-running');
        timerContainer.classList.remove('time-up');
    });
}

// Função para adicionar documentação específica do laboratório
function setupDocumentation() {
    const labCategory = document.getElementById('labCategory').textContent;
    const resourcesList = document.querySelector('.resources-list');
    
    if (!resourcesList) return;
    
    // Objeto com links para documentação por categoria
    const documentationLinks = {
        'Kali Linux': 'https://www.kali.org/docs/',
        'Scanning': 'https://nmap.org/book/man.html',
        'Redes': 'https://www.wireshark.org/docs/',
        'Análise': 'https://www.wireshark.org/docs/wsug_html/',
        'Web': 'https://portswigger.net/burp/documentation',
        'Criptografia': 'https://www.openssl.org/docs/',
        'Social': 'https://www.social-engineer.org/framework/general-discussion/',
        'Senhas': 'https://hashcat.net/wiki/'
    };
    
    // Adicionar link para documentação específica da categoria
    if (documentationLinks[labCategory]) {
        const docItem = document.createElement('li');
        docItem.innerHTML = `
            <i class="fas fa-book"></i>
            <a href="${documentationLinks[labCategory]}" class="resource-link" target="_blank">
                Documentação Oficial: ${labCategory}
            </a>
        `;
        resourcesList.appendChild(docItem);
    }
    
    // Adicionar mais recursos específicos
    const additionalResources = {
        'Kali Linux': [
            { icon: 'fas fa-book-open', title: 'Manual do Kali Linux', url: 'https://www.kali.org/docs/introduction/what-is-kali-linux/' },
            { icon: 'fas fa-graduation-cap', title: 'Treinamento Oficial Kali', url: 'https://kali.training/' }
        ],
        'Scanning': [
            { icon: 'fas fa-book-open', title: 'Guia Nmap', url: 'https://nmap.org/book/toc.html' },
            { icon: 'fas fa-file-alt', title: 'Exemplos de Scanning', url: 'https://nmap.org/nsedoc/' }
        ],
        'Redes': [
            { icon: 'fas fa-book-open', title: 'Fundamentos de Redes', url: 'https://www.netacad.com/' },
            { icon: 'fas fa-file-alt', title: 'Protocolos de Rede', url: 'https://wiki.wireshark.org/ProtocolReference' }
        ],
        'Análise': [
            { icon: 'fas fa-book-open', title: 'Análise de Pacotes', url: 'https://www.wireshark.org/docs/wsug_html_chunked/ChapterIntroduction.html' },
            { icon: 'fas fa-file-alt', title: 'Forense Digital', url: 'https://forensicswiki.xyz/' }
        ],
        'Web': [
            { icon: 'fas fa-book-open', title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
            { icon: 'fas fa-file-alt', title: 'Guia de Teste Web', url: 'https://owasp.org/www-project-web-security-testing-guide/' }
        ],
        'Criptografia': [
            { icon: 'fas fa-book-open', title: 'Fundamentos de Criptografia', url: 'https://www.ssl.com/faqs/what-is-cryptography/' },
            { icon: 'fas fa-file-alt', title: 'Algoritmos de Hash', url: 'https://en.wikipedia.org/wiki/Cryptographic_hash_function' }
        ],
        'Social': [
            { icon: 'fas fa-book-open', title: 'Framework de Engenharia Social', url: 'https://www.social-engineer.org/framework/general-discussion/' },
            { icon: 'fas fa-file-alt', title: 'Técnicas de Phishing', url: 'https://www.social-engineer.org/wiki/archives/PhishingAttacks/PhishingAttacks-main.html' }
        ],
        'Senhas': [
            { icon: 'fas fa-book-open', title: 'Técnicas de Quebra de Senhas', url: 'https://hashcat.net/wiki/doku.php?id=example_hashes' },
            { icon: 'fas fa-file-alt', title: 'Geração de Wordlists', url: 'https://github.com/danielmiessler/SecLists' }
        ]
    };
    
    // Adicionar recursos adicionais específicos
    if (additionalResources[labCategory]) {
        additionalResources[labCategory].forEach(resource => {
            const resourceItem = document.createElement('li');
            resourceItem.innerHTML = `
                <i class="${resource.icon}"></i>
                <a href="${resource.url}" class="resource-link" target="_blank">
                    ${resource.title}
                </a>
            `;
            resourcesList.appendChild(resourceItem);
        });
    }
}

// Funções existentes de navegação, terminal, etc.
function setupNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const steps = document.querySelectorAll('.instruction-step');
    const currentStepEl = document.querySelector('.current-step');
    const totalStepsEl = document.querySelector('.total-steps');
    
    if (!prevBtn || !nextBtn || !steps.length) return;
    
    let currentStep = 1;
    const totalSteps = steps.length;
    
    // Atualizar indicadores de passo
    totalStepsEl.textContent = totalSteps;
    
    // Função para atualizar a visualização dos passos
    function updateStepView() {
        steps.forEach(step => {
            step.classList.remove('active');
        });
        
        document.querySelector(`.instruction-step[data-step="${currentStep}"]`).classList.add('active');
        currentStepEl.textContent = currentStep;
        
        // Atualizar estado dos botões
        prevBtn.disabled = currentStep === 1;
        nextBtn.disabled = currentStep === totalSteps;
        
        // Atualizar item ativo na lista de tarefas lateral
        document.querySelectorAll('.task-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.task-item[data-step="${currentStep}"]`).classList.add('active');
    }
    
    // Botão anterior
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepView();
        }
    });
    
    // Botão próximo
    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepView();
        }
    });
    
    // Inicializar view
    updateStepView();
}

function setupTaskCompletion() {
    const completeButtons = document.querySelectorAll('.task-complete-btn');
    const taskItems = document.querySelectorAll('.task-item');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const completionMessage = document.querySelector('.completion-message');
    
    if (!completeButtons.length || !taskItems.length) return;
    
    // Recuperar tarefas concluídas do armazenamento local (se existir)
    const labId = window.location.pathname.split('/lab/')[1] || '1';
    const storageKey = `lab_${labId}_progress`;
    let completedTasks = JSON.parse(localStorage.getItem(storageKey)) || [];
    
    // Aplicar estado inicial baseado nas tarefas já concluídas
    updateTasksState();
    
    completeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const step = button.getAttribute('data-step');
            
            // Marcar tarefa como concluída se ainda não estiver
            if (!completedTasks.includes(step)) {
                completedTasks.push(step);
                localStorage.setItem(storageKey, JSON.stringify(completedTasks));
            }
            
            // Atualizar estado das tarefas
            updateTasksState();
            
            // Avançar para próxima tarefa automaticamente
            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn && !nextBtn.disabled) {
                nextBtn.click();
            }
        });
    });
    
    function updateTasksState() {
        // Atualizar indicadores visuais das tarefas concluídas
        taskItems.forEach(item => {
            const step = item.getAttribute('data-step');
            const checkIcon = item.querySelector('.task-check i');
            
            if (completedTasks.includes(step)) {
                item.classList.add('completed');
                checkIcon.className = 'fas fa-check-circle';
            } else {
                item.classList.remove('completed');
                checkIcon.className = 'far fa-circle';
            }
        });
        
        // Atualizar barra de progresso
        if (progressFill && progressText) {
            const progress = (completedTasks.length / taskItems.length) * 100;
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}% Concluído`;
            
            // Mostrar mensagem de conclusão se todas as tarefas estiverem concluídas
            if (completionMessage && completedTasks.length === taskItems.length) {
                completionMessage.classList.remove('hidden');
            } else if (completionMessage) {
                completionMessage.classList.add('hidden');
            }
        }
    }
}

function setupCodeCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    if (!copyButtons.length) return;
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const code = button.getAttribute('data-code');
            
            // Copiar para a área de transferência
            navigator.clipboard.writeText(code).then(() => {
                // Feedback visual da cópia
                button.innerHTML = '<i class="fas fa-check"></i>';
                
                // Restaurar ícone original após um tempo
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
                
                // Inserir comando automaticamente no terminal
                const terminalInput = document.getElementById('terminalInput');
                
                if (terminalInput) {
                    terminalInput.value = code;
                    terminalInput.focus();
                    
                    // Simular pressionar Enter para executar o comando
                    const enterEvent = new KeyboardEvent('keydown', {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true
                    });
                    terminalInput.dispatchEvent(enterEvent);
                }
            });
        });
    });
}

function setupTaskNavigation() {
    const taskItems = document.querySelectorAll('.task-item');
    
    if (!taskItems.length) return;
    
    taskItems.forEach(item => {
        item.addEventListener('click', () => {
            const step = item.getAttribute('data-step');
            const steps = document.querySelectorAll('.instruction-step');
            const currentStepEl = document.querySelector('.current-step');
            
            if (!steps.length || !currentStepEl) return;
            
            // Atualizar navegação para o passo selecionado
            steps.forEach(stepEl => {
                stepEl.classList.remove('active');
            });
            
            document.querySelector(`.instruction-step[data-step="${step}"]`).classList.add('active');
            currentStepEl.textContent = step;
            
            // Atualizar estado dos botões de navegação
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const totalSteps = steps.length;
            
            if (prevBtn) prevBtn.disabled = step == 1;
            if (nextBtn) nextBtn.disabled = step == totalSteps;
            
            // Atualizar item ativo na lista de tarefas
            taskItems.forEach(taskEl => {
                taskEl.classList.remove('active');
            });
            item.classList.add('active');
        });
    });
}

function setupLabReset() {
    const resetBtn = document.getElementById('resetLabBtn');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja reiniciar este laboratório? Todo o progresso será perdido.')) {
                // Limpar progresso salvo
                const labId = window.location.pathname.split('/lab/')[1] || '1';
                const storageKey = `lab_${labId}_progress`;
                localStorage.removeItem(storageKey);
                localStorage.removeItem(`lab_${labId}_packages`);
                
                // Recarregar a página
                window.location.reload();
            }
        });
    }
}

function setupTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    
    if (!terminalInput || !terminalOutput) return;
    
    terminalInput.addEventListener('keydown', async function(e) {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (command === '') return;
            
            // Adicionar comando à saída
            const commandLine = document.createElement('p');
            commandLine.innerHTML = `<span class="prompt">kali@cyberlab:~$</span> ${command}`;
            terminalOutput.appendChild(commandLine);
            
            // Limpar input
            terminalInput.value = '';
            
            // Processar comando com a API ou simulação local
            try {
                const labId = window.location.pathname.split('/lab/')[1] || '1';
                
                const response = await fetch('/api/terminal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        command: command,
                        lab_id: labId
                    })
                });
                
                const data = await response.json();
                
                // Comando para limpar o terminal
                if (command === 'clear' || data.output === 'clear') {
                    terminalOutput.innerHTML = '';
                    return;
                }
                
                // Adicionar resultado à saída
                const resultLine = document.createElement('p');
                resultLine.textContent = data.output;
                terminalOutput.appendChild(resultLine);
                
                // Se um pacote foi instalado, salvar no localStorage
                if (data.package_installed && command.startsWith('apt-get install ')) {
                    const packageName = command.split(' ').pop();
                    const installedPackages = JSON.parse(localStorage.getItem(`lab_${labId}_packages`)) || [];
                    if (!installedPackages.includes(packageName)) {
                        installedPackages.push(packageName);
                        localStorage.setItem(`lab_${labId}_packages`, JSON.stringify(installedPackages));
                    }
                }
                
                // Se um pacote foi removido, remover do localStorage
                if (data.package_removed && command.startsWith('apt-get remove ')) {
                    const packageName = command.split(' ').pop();
                    let installedPackages = JSON.parse(localStorage.getItem(`lab_${labId}_packages`)) || [];
                    installedPackages = installedPackages.filter(pkg => pkg !== packageName);
                    localStorage.setItem(`lab_${labId}_packages`, JSON.stringify(installedPackages));
                }
                
            } catch (error) {
                console.error('Erro ao processar comando:', error);
                
                // Simulação de resposta em caso de falha de conexão
                simularComandoTerminal(command, terminalOutput);
            }
            
            // Rolar para o final do terminal
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
    
    // Função para simular comandos do terminal localmente (fallback)
    function simularComandoTerminal(command, output) {
        // Simulação básica de comandos
        if (command === 'clear') {
            output.innerHTML = '';
            return;
        }
        
        if (command.startsWith('apt-get install ')) {
            const package = command.split(' ').pop();
            const resultLine = document.createElement('p');
            resultLine.textContent = `Lendo listas de pacotes... Pronto\nConstruindo árvore de dependências... Pronto\nLendo informações de estado... Pronto\nOs seguintes pacotes NOVOS serão instalados:\n  ${package}\n0 atualizados, 1 novos instalados, 0 a serem removidos e 0 não atualizados.`;
            output.appendChild(resultLine);
            
            // Simular animação de instalação
            setTimeout(() => {
                const installLine = document.createElement('p');
                installLine.textContent = `Baixados 2.505 kB em 1s (2.505 kB/s)\nSelecionando ${package} previamente não selecionado.\nPreparando para desempacotar ./${package}.deb ...`;
                output.appendChild(installLine);
                output.scrollTop = output.scrollHeight;
                
                setTimeout(() => {
                    const completeLine = document.createElement('p');
                    completeLine.textContent = `Desempacotando ${package} (1:2.0-1) ...\nConfigurando ${package} (1:2.0-1) ...\nProcessando gatilhos para man-db (2.10.2-1) ...`;
                    output.appendChild(completeLine);
                    output.scrollTop = output.scrollHeight;
                    
                    // Salvar pacote instalado
                    const labId = window.location.pathname.split('/lab/')[1] || '1';
                    const installedPackages = JSON.parse(localStorage.getItem(`lab_${labId}_packages`)) || [];
                    if (!installedPackages.includes(package)) {
                        installedPackages.push(package);
                        localStorage.setItem(`lab_${labId}_packages`, JSON.stringify(installedPackages));
                    }
                }, 1500);
            }, 1000);
            
            return;
        }
        
        if (command.startsWith('apt-get remove ')) {
            const package = command.split(' ').pop();
            const resultLine = document.createElement('p');
            resultLine.textContent = `Lendo listas de pacotes... Pronto\nConstruindo árvore de dependências... Pronto\nLendo informações de estado... Pronto\nOs seguintes pacotes serão REMOVIDOS:\n  ${package}\n0 atualizados, 0 novos instalados, 1 a serem removidos e 0 não atualizados.`;
            output.appendChild(resultLine);
            
            setTimeout(() => {
                const removeLine = document.createElement('p');
                removeLine.textContent = `Removendo ${package} (1:2.0-1) ...\nProcessando gatilhos para man-db (2.10.2-1) ...`;
                output.appendChild(removeLine);
                output.scrollTop = output.scrollHeight;
                
                // Remover pacote da lista de instalados
                const labId = window.location.pathname.split('/lab/')[1] || '1';
                let installedPackages = JSON.parse(localStorage.getItem(`lab_${labId}_packages`)) || [];
                installedPackages = installedPackages.filter(pkg => pkg !== package);
                localStorage.setItem(`lab_${labId}_packages`, JSON.stringify(installedPackages));
            }, 1000);
            
            return;
        }
        
        // Comandos básicos
        const commandResponses = {
            'ls': 'documentos  ferramentas  logs  scripts',
            'pwd': '/home/kali',
            'help': 'Comandos disponíveis: ls, cd, pwd, help, clear, apt-get install, apt-get update, apt-get remove',
            'apt-get update': 'Atingido:1 http://kali.download/kali kali-rolling InRelease\nBaixados 6.450 kB em 3s (2.150 kB/s)\nLendo listas de pacotes... Pronto',
            'ifconfig': 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.5  netmask 255.255.255.0  broadcast 192.168.1.255'
        };
        
        // Verificar comandos conhecidos
        if (command.startsWith('cd ')) {
            const dir = command.slice(3);
            const resultLine = document.createElement('p');
            resultLine.textContent = `Diretório alterado para ${dir}`;
            output.appendChild(resultLine);
            return;
        }
        
        if (command.startsWith('nmap ')) {
            const target = command.split(' ')[1] || 'localhost';
            const resultLine = document.createElement('p');
            resultLine.textContent = `Iniciando Nmap 7.92...\nScanning ${target}...\nDiscovered open port: 80/tcp (HTTP)\nDiscovered open port: 443/tcp (HTTPS)\nDiscovered open port: 22/tcp (SSH)\nNmap done: 1 IP address scanned in 2.34 seconds`;
            output.appendChild(resultLine);
            return;
        }
        
        // Resposta genérica para outros comandos
        const response = commandResponses[command] || `Comando '${command}' não reconhecido. Digite 'help' para ver os comandos disponíveis.`;
        const resultLine = document.createElement('p');
        resultLine.textContent = response;
        output.appendChild(resultLine);
    }
}